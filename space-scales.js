// this module assumes there is an svg element already, and a variable named svg that contains the
// selection for it. You can use this for the variable: const svg = d3.select('#canvas')
// there should also be a variable "dataset" that contains the dataset you want to use
let width, height, g, xMax, spacer

// create toggle buttons for each body
const createToggleButtons = (selection) => {
    selection.selectAll('button')
        .data(dataset)
        .enter()
        .append('button')
            .attr('class', 'btn btn-primary')
            .text(d => d.name)
            .attr('onclick', (d, i) => `toggleBody(${i})`)
            .attr('id', (d, i) => `toggle${i}`)
}

const _clear = () => {
    svg.selectAll('*').remove()
}

const setSizeBy = value => {
    sizeBy = value
    draw(dataset, true)
    d3.selectAll('.sizeby')
        .classed('btn-primary', false)
        .classed('btn-outline-primary', true)
    d3.select(`#${value}`)
        .classed('btn-outline-primary', false)
        .classed('btn-primary', true)
}

const toggleBody = index => {
    dataset[index].enabled = !dataset[index].enabled
    draw(dataset, true)
    d3.select(`#toggle${index}`)
        .classed('btn-primary', dataset[index].enabled)
        .classed('btn-outline-primary', !dataset[index].enabled)
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

const draw = (data, isTransition = false) => {
    if (!isTransition) {
        _clear()
        // sets svg dimensions
        width = window.innerWidth - margin.left - margin.right - rightPadding
        height = window.innerHeight - margin.top - margin.bottom - bottomPadding
        svg.attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
        g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)
    }
    
    data = calcXpos()

    const xScale = d3.scaleLinear().domain([0, xMax]).range([0, width])

    let selection = g.selectAll('circle').data(data)
    if (isTransition) { selection = selection.transition().duration(7000) }
    else { selection = selection.enter().append('circle') }

    selection
        .attr('cx', d => xScale(d.xPos))
        .attr('cy', height / 2)
        .attr('r', d => xScale(d[sizeBy]) * d.enabled)
        .attr('fill', d => d.color)
        .attr('stroke-width', 2)
        .attr('stroke', 'black')
        .attr('id', d => d.name)
}

getUrlParameter = name => {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}
