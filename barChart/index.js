//to load the file properly, serve the whole folder on local server like this:
// in terminal, open this folder and type "python -m SimpleHTTPServer 8888 &"

(function(d3){
    //imports
    const select = d3.select //sort of like import {select} from 'd3'
    const csv = d3.csv
    const scaleLinear = d3.scaleLinear
    const max = d3.max
    const scaleBand = d3.scaleBand
    const axisLeft = d3.axisLeft
    const axisBottom = d3.axisBottom
    //imports end


    const svg = select('svg')
        .style('background-color', 'red')

    const height = +svg.attr("height");
    const width = +svg.attr("width");

    const render = data => { 
        const xValue = d => d.population;
        const yValue = d => d.country;
        const margin = { top: 20, right: 20, bottom: 100, left: 100}
        const innerWidth = width - margin.left - margin.right
        const innerHeight = height - margin.top - margin.bottom

        const xScale = scaleLinear()
            .domain([0, max(data, xValue)]) //domain is data. we find min and max data for chart
            .range([0, innerWidth]) //for horizontal bar chart, max val should be max width of svg

        const yScale = scaleBand()
            .domain(data.map(yValue))
            .range([0, innerHeight])
            .padding(0.1)

        const yAxis = axisLeft(yScale)
        const xAxis = axisBottom(xScale)x
       
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)

        
        g.append('g').call(yAxis) // same as yAxis(g.append('g'))
        g.append('g').call(xAxis) // same as yAxis(g.append('g'))
             .attr('transform', `translate(0, ${innerHeight})`)

        g.selectAll('rect').data(data)
            .enter()//identifies elements that are missing if the data input is longer than the selection. This returns a new selection representing the elements that need to be added.
            .append('rect')
                .attr('y', d => yScale(yValue(d)))
                .attr('width', d => xScale(xValue(d)))
                .attr('height', yScale.bandwidth())
    }

    csv("http://localhost:8888/data.csv").then(function(data) {
        data.forEach(d => {
            d.population = +d.population
        })
        console.log(data)
        render(data);
    });


}(d3))













