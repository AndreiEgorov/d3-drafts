//to load the file properly, serve the whole folder on local server like this:
// in terminal, open this folder and type "python -m SimpleHTTPServer 8888 &"

(function(d3){
    //imports
    const select = d3.select //sort of like import {select} from 'd3'
    const scaleLinear = d3.scaleLinear
    const axisLeft = d3.axisLeft
    const axisBottom = d3.axisBottom
    const scaleBand = d3.scaleBand
    const csv = d3.csv
    const bandwidth = d3.bandwidth
    //imports end


    const svg = select('svg')
        .style('background-color', 'olive')
    const margin = 60;
    const height = +svg.attr("height") - 2 * margin;
    const width = +svg.attr("width") - 2 * margin;


    const render = data => {
        const chart = svg.append('g')
            .attr('transform', `translate(${margin}, ${margin})`)


        const yScale = scaleLinear()
            .range([height, 0])
            .domain([0, 100])
    
        const xScale = scaleBand()
            .range([0, width])
            .domain(data.map(s => s.language))
            .padding(0.1)

    
        chart.append('g')
            .call(
                axisLeft(yScale)
                // .tickSize(-400)
                // .tickPadding(10)
            
            )
    
        chart.append('g')
            .call(axisBottom(xScale))
            .attr('transform', `translate(0, ${height})`)
    
        chart.selectAll('rect')
            .data(data).enter()
            .append('rect')
            .attr('x', d => xScale(d.language) )
            .attr('y', d => yScale(d.country))
            .attr('height', (s) => height - yScale(+s.country))
            .attr('width', xScale.bandwidth())


    }

   
 





    csv("http://localhost:8888/data.csv").then(function(data) {
        // data.forEach(d => {
        //     d.population = +d.population
        // })
        console.log(data)
        render(data);
    });

}(d3))













