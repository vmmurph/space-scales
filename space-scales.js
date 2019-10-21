/**
 * This module assumes there is an svg element already, and a variable named svg that contains the
 * selection for it. You can use this for the variable: const svg = d3.select('#canvas')
 * 
 * There should also be a variable "dataset" that contains the dataset you want to use
 */
let width, height, g, xMax, spacer, xScale, sizeBy = 'radius', insideHole = false
const defaultDuration = 2000

const isVisible = d => {
    if (insideHole) {
        return !d.enabled
    } else {
        return d.enabled
    }
}

// removes all svg objects for a blank slate
const _clear = () => {
    svg.selectAll('*').remove()
}

/**
 * Sets the metric by which to size bodies, then redraws.
 */
const switchSizeBy = () => {
    sizeBy = getNextSize(sizeBy)
    draw(true)
}

const getSizebyDisplay = () => {
    switch (sizeBy) {
        case 'radius': return 'Radius'
        case 'mass': return 'Mass'
        case 'density': return 'Density'
    }
    return '?'
}

const getNextSize = (value) => {
    switch (value) {
        case 'radius': return 'mass'
        case 'mass': return 'density'
        case 'density': return 'radius'
    }
    return '?'
}

const drawSizeButton = (isTransition = false) => {
    const x = 0
    const y = 0
    const w = 80
    const h = 40

    if (isTransition) {
        d3.select('.button').remove()
    }

    const b = g.append('g').attr('id', 'buttons').attr('transform', `translate(${x}, ${y})`)
        .attr('class', 'button')
        .on('click', switchSizeBy)

    b.append('rect')
        .attr('x', 0).attr('y', 0).attr('width', w).attr('height', h)
        .attr('stroke', 'black').attr('stroke-width', 2)
        .attr('rx', 10).attr('ry', 10)
        .attr('fill', 'white')
        
    b.append('text')
        .text(getSizebyDisplay)
        .style('font-size', 20)
        .attr('x', w / 2)
        .attr('y', h / 2)
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
}

/**
 * Adds or removes a body, then redraws. Returns the button selection.
 */
const toggleBody = (d, i) => {
    dataset[i].enabled = !dataset[i].enabled
    draw(true)
}

// math to give bodies x-positions and add space between them
const calcXpos = () => {
    const totalRadius = dataset.reduce((sum, d) => sum + (d[sizeBy] * 2 * isVisible(d)), 0)
    xMax = totalRadius / (1 - spacerPercent)
    const spacerTotal = xMax * spacerPercent
    const visibleBodies = dataset.reduce((sum, d) => sum + isVisible(d), 0)
    spacer = spacerTotal / (visibleBodies + 1)

    let startPosition = spacer
    return dataset.map(d => {
        d.xPos = startPosition + d[sizeBy]
        startPosition += (d[sizeBy] * 2 + spacer) * isVisible(d)
        return d
    })
}

// draws everything
const draw = (isTransition = false, duration = defaultDuration) => {
    if (!isTransition) {
        _clear()

        // additional resize to account for padding or other elements on the page
        const horizontalResize = 6
        const verticalResize = 6

        const svgWidth = window.innerWidth - horizontalResize
        svg.attr('width', svgWidth)
        let svgHeight = window.innerHeight - verticalResize
        if (svgHeight > svgWidth * .6) svgHeight = svgWidth * .6
        svg.attr('height', svgHeight)

        width = svgWidth - margin.left - margin.right
        height = svgHeight - margin.top - margin.bottom

        g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)
    }
    
    dataset = calcXpos()

    xScale = d3.scaleLinear().domain([0, xMax]).range([0, width])

    drawBodies(isTransition, duration)
    drawLabels(isTransition, duration)
    drawSizeButton(isTransition)
    createBlackHole(isTransition)
}

const drawBodies = (isTransition = false, duration = defaultDuration) => {
    let selection = g.selectAll('.bod').data(dataset)
    if (isTransition) { selection = selection.transition().duration(duration) }
    else {
        selection = selection.enter()
            .append('circle')
            .on('click', toggleBody)
    }

    selection
        .attr('class', 'bod')
        .attr('cx', d => isVisible(d) ? xScale(d.xPos) : hole.x)
        .attr('cy', d => isVisible(d) ? height / 2 : hole.y)
        .attr('r', d => xScale(d[sizeBy]) * isVisible(d))
        .attr('fill', d => d.color)
        .attr('stroke-width', 2)
        .attr('stroke', 'black')
        .attr('id', d => d.name)
}

const getBBox = d => {
    const ele = g.append('text').attr('font-size', getFontSize(d)).text(d.name).attr('id', 'deleteme')
    const bbox = ele.node().getBBox()
    d3.select('#deleteme').remove()
    return bbox
}

const getFontSize = d => {
    const fontScale = d3.scaleLinear().domain([0, xMax / 2]).range([.5, 12])
    return `${fontScale(d[sizeBy]) * isVisible(d)}rem`
}

const getTransform = d => {
    const bbox = getBBox(d)
    const xOffset = bbox.width / 2
    const yOffset = bbox.height / 8
    const rotate = `rotate(${isBig(d) ? 0 : -90}, ${xScale(d.xPos)}, ${height / 2})`
    let x, y
    if (isVisible(d)) {
        x = isBig(d) ? xScale(d.xPos) - xOffset : xScale(d.xPos + d[sizeBy]) + 5
        y = height / 2 + 2 + yOffset
    } else {
        return d3.select(`#${d.name}-label`).attr('transform')
    }
    const translate = `translate(${x}, ${y})`
    return `${rotate} ${translate}`
}

// func that decides if body is big enough to put label inside
// const isBig = d => xScale(d[sizeBy] * 2) > (width * .035)
const isBig = d => {
    const pad = 10
    const w = getBBox(d).width
    return w + pad * 2 < xScale(d[sizeBy] * 2)
}

const drawLabels = (isTransition = false, duration = defaultDuration) => {
    if (!isTransition) {
        g.selectAll('.label')
            .data(dataset)
            .enter()
            .append('g')
                .on('click', toggleBody)
                .attr('class', 'label')
                .attr('id', d => `${d.name}-label`)
                .attr('transform', getTransform)
                .append('text')
                    .text(d => d.name)
                    .attr('font-size', getFontSize)
    } else {
        g.selectAll('.label').data(dataset).transition().duration(duration)
            .attr('transform', getTransform)
            .select('text').attr('font-size', getFontSize)
    }
}

let hole = {}
const createBlackHole = (isTransition = false, duration = 5000) => {
    if (isTransition) {
        d3.selectAll('.blackhole').remove()
    }
    var radius = 20
    var blackhole = g.append('g')
        .attr('class', 'blackhole')
        .attr('transform', `translate(${100}, ${15})`)
    blackhole.on('click', activateHole)
    blackhole.append('circle').attr('cx', 5).attr('cy', 5)
        .attr('r', radius).attr('id', 'outside')
    blackhole.append('circle').attr('cx', 5).attr('cy', 5)
        .attr('r', radius * .33).attr('fill', 'white').attr('id', 'inside')
    hole.x = 105
    hole.y = 20

    var repeat = () => {
        blackhole.select('#inside')
            .transition()
            .duration(duration)
            .attr('r', radius * .8)
            .transition()
            .duration(duration)
            .attr('r', radius * .3)
            .on('end', repeat)
    }

    repeat()
}

const activateHole = () => {
    insideHole = !insideHole
    draw(true, defaultDuration / 2)
}
