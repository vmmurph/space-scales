/**
 * This module assumes there is an svg element already, and a variable named svg that contains the
 * selection for it. You can use this for the variable: const svg = d3.select('#canvas')
 * 
 * There should also be a variable "dataset" that contains the dataset you want to use
 */
let width, height, g, xMax, spacer, sizeBy = 'radius'

/**
 * Creates toggle buttons for each body. Requires a selection (the dom element you want the buttons
 * created in) and toggleFunctionName - name of the func that the button will call (see example
 * below).
 * 
 * const onBodyToggle = (index) => {
 *      const toggled = toggleBody(index)
 *      toggled
 *          .classed('btn-primary', dataset[index].enabled)
 *          .classed('btn-outline-primary', !dataset[index].enabled)
 *  }
 */
const createToggleButtons = (selection, toggleFunctionName) => {
    selection.selectAll('button')
        .data(dataset)
        .enter()
        .append('button')
            .attr('class', 'btn btn-primary')
            .text(d => d.name)
            .attr('onclick', (d, i) => `${toggleFunctionName}(${i})`)
            .attr('id', (d, i) => `toggle${i}`)
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

// adds or removes a body, then redraws
/**
 * Adds or removes a body, then redraws. Returns the button selection.
 */
const toggleBody = index => {
    dataset[index].enabled = !dataset[index].enabled
    draw(true)
    return d3.select(`#toggle${index}`)
}

// math to give bodies x-positions and add space between them
const calcXpos = () => {
    const totalRadius = dataset.reduce((sum, d) => sum + (d[sizeBy] * 2 * d.enabled), 0)
    xMax = totalRadius / (1 - spacerPercent)
    const spacerTotal = xMax * spacerPercent
    const visibleBodies = dataset.reduce((sum, d) => sum + d.enabled, 0)
    spacer = spacerTotal / (visibleBodies + 1)

    let startPosition = spacer
    return dataset.map(d => {
        d.xPos = startPosition + d[sizeBy]
        startPosition += (d[sizeBy] * 2 + spacer) * d.enabled
        return d
    })
}

// draws everything
const draw = (isTransition = false) => {
    if (!isTransition) {
        _clear()
        // sets svg dimensions
        width = window.innerWidth - margin.left - margin.right - rightPadding
        height = window.innerHeight - margin.top - margin.bottom - bottomPadding
        svg.attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
        g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)
    }
    
    dataset = calcXpos()

    const xScale = d3.scaleLinear().domain([0, xMax]).range([0, width])

    let selection = g.selectAll('circle').data(dataset)
    if (isTransition) { selection = selection.transition().duration(4000) }
    else { selection = selection.enter().append('circle') }

    selection
        .attr('cx', d => xScale(d.xPos))
        .attr('cy', height / 2)
        .attr('r', d => xScale(d[sizeBy]) * d.enabled)
        .attr('fill', d => d.color)
        .attr('stroke-width', 2)
        .attr('stroke', 'black')
        .attr('id', d => d.name)

    drawLabels(xScale, isTransition)
}

const getBBox = d => {
    const ele = svg.append('text').attr('font-size', getFontSize(d)).text(d.name).attr('id', 'deleteme')
    const bbox = ele.node().getBBox()
    d3.select('#deleteme').remove()
    return bbox
}

const getFontSize = d => {
    const fontScale = d3.scaleLinear().domain([0, xMax / 2]).range([.6, 3])
    return `${fontScale(d[sizeBy]) * d.enabled}rem`
}

const drawLabels = (xScale, isTransition = false) => {
    // func that decides if body is big enough to put label inside
    const isBig = d => xScale(d[sizeBy] * 2) > (width * .03)
    
    const getTransform = d => {
        const offset = getBBox(d).width / 2
        const rotate = `rotate(${isBig(d) ? 0 : -90}, ${xScale(d.xPos)}, ${height / 2})`
        const translate = `translate(${isBig(d) ? xScale(d.xPos) - offset : xScale(d.xPos + d[sizeBy]) + 5}, ${height / 2 + 2})`
        return `${rotate} ${translate}`
    }

    if (!isTransition) {
        g.selectAll('g')
            .data(dataset)
            .enter()
            .append('g')
                .attr('id', d => `${d.name}-label`)
                .attr('transform', getTransform)
                .append('text')
                    .text(d => d.name)
                    .attr('font-size', getFontSize)
    } else {
        g.selectAll('g').data(dataset).transition().duration(4000)
            .attr('transform', getTransform)
            .select('text').attr('font-size', getFontSize)
    }
}
