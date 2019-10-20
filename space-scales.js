/**
 * This module assumes there is an svg element already, and a variable named svg that contains the
 * selection for it. You can use this for the variable: const svg = d3.select('#canvas')
 * 
 * There should also be a variable "dataset" that contains the dataset you want to use
 */
let width, height, g, xMax, spacer, xScale, sizeBy = 'radius', insideHole = false

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
 * Sets the metric by which to size bodies, then redraws. A string needs to be passed in that is
 * either 'radius', 'density', or 'mass'. Returns the button selection.
 */
const setSizeBy = (value = 'radius') => {
    sizeBy = value
    draw(true)
    return d3.select(`#${value}`)
}

/**
 * Adds or removes a body, then redraws. Returns the button selection.
 */
const toggleBody = index => {
    dataset[index].enabled = !dataset[index].enabled
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
const draw = (isTransition = false, duration = 4000) => {
    if (!isTransition) {
        _clear()

        // additional padding on svg since using straight window size causes scrollbars
        // also useful if needing to add other stuff to the window (buttons, etc)
        const horizontalResize = 16
        const verticalResize = d3.select('#buttons').node().clientHeight + 3

        const svgWidth = window.innerWidth - horizontalResize
        svg.attr('width', svgWidth)
        let svgHeight = window.innerHeight - verticalResize
        if (svgHeight > svgWidth) svgHeight = svgWidth
        svg.attr('height', svgHeight)

        width = svgWidth - margin.left - margin.right
        height = svgHeight - margin.top - margin.bottom

        g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

        createBlackHole()
    }
    
    dataset = calcXpos()

    xScale = d3.scaleLinear().domain([0, xMax]).range([0, width])

    let selection = g.selectAll('.bod').data(dataset)
    if (isTransition) { selection = selection.transition().duration(duration) }
    else {
        selection = selection.enter()
            .append('circle')
            .on('click', (d, i) => toggleBody(i))
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
        

    drawLabels(isTransition, duration)
}

const getBBox = d => {
    const ele = g.append('text').attr('font-size', getFontSize(d)).text(d.name).attr('id', 'deleteme')
    const bbox = ele.node().getBBox()
    d3.select('#deleteme').remove()
    return bbox
}

const getFontSize = d => {
    const fontScale = d3.scaleLinear().domain([0, xMax / 2]).range([.5, 3])
    return `${fontScale(d[sizeBy]) * isVisible(d)}rem`
}

const getTransform = d => {
    const offset = getBBox(d).width / 2
    const rotate = `rotate(${isBig(d) ? 0 : -90}, ${xScale(d.xPos)}, ${height / 2})`
    let x
    if (isVisible(d)) {
        x = isBig(d) ? xScale(d.xPos) - offset : xScale(d.xPos + d[sizeBy]) + 5
    } else {
        return d3.select(`#${d.name}-label`).attr('transform')
    }
    const y = isVisible(d) ? height / 2 + 2 : 0
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

const drawLabels = (isTransition = false, duration = 4000) => {
    if (!isTransition) {
        g.selectAll('.label')
            .data(dataset)
            .enter()
            .append('g')
                .on('click', (d, i) => toggleBody(i))
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

let hole = { radius: 20, x: width, y: height }
const createBlackHole = () => {
    var radius = 20
    var blackhole = g.append('g').attr('transform', `translate(${width - radius}, ${height - radius})`)
    blackhole.on('click', activateHole)
    blackhole.append('circle').attr('cx', 5).attr('cy', 5).attr('r', radius).attr('id', 'outside')
    blackhole.append('circle').attr('cx', 5).attr('cy', 5).attr('r', radius * .33).attr('fill', 'white').attr('id', 'inside')
    hole.x = width - radius
    hole.y = height - radius

    var repeat = () => {
        blackhole.select('#inside')
            .transition()
            .duration(5000)
            .attr('r', radius * .8)
            .transition()
            .duration(5000)
            .attr('r', radius * .3)
            .on('end', repeat)
    }

    repeat()
}

const activateHole = () => {
    insideHole = !insideHole
    draw(true)
}
