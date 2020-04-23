//to load the file properly, serve the whole folder on local server like this:
// in terminal, open this folder and type "python -m SimpleHTTPServer 8888 &"

(function(d3){
    //imports
    const select = d3.select //sort of like import {select} from 'd3'
    const csv = d3.csv
    const scaleLinear = d3.scaleLinear
    const extent = d3.extent
    const axisLeft = d3.axisLeft
    const axisBottom = d3.axisBottom
    const format = d3.format //(numberFormattingModule)
    //imports end


    const svg = select('svg')
        // .style('background-color', 'red')

    const height = +svg.attr("height");
    const width = +svg.attr("width");

    const render = data => { 
        const ChartTitle = "Scatter Plot: Horsepower vs weight";

        const xValue = d => d.horsepower;
        const xAxisLabel = 'Horsepower';

        const yValue = d => d.weight;
        const yAxisLabel = 'Weight';

        const margin = { top: 60, right: 20, bottom: 100, left: 200};
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        const circleRadius = 10;

        const xScale = scaleLinear()
            .domain(extent(data, xValue)) //domain is data. we find min and max data for chart , same as [max(data, xValue), max(data, xValue)]
            .range([0, innerWidth]) //for horizontal bar chart, max val should be max width of svg
            .nice()

        const yScale = scaleLinear()
            .domain(extent(data, yValue))
            .range([0, innerHeight])
            .nice()
        
        const yAxis = axisLeft(yScale)
            .tickSize(-innerWidth)
            .tickPadding(10)

   
        const xAxis = axisBottom(xScale)
            .tickSize(-innerHeight) //to make vertical gridlines
            .tickPadding(20)

       
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)

       
        
    
        const yAxisG =  g.append('g')
            .call(yAxis) // same as yAxis(g.append('g'))
            yAxisG
                .selectAll('.domain')
                    .remove()
           
            yAxisG.append('text')
                .attr('text-ancor', 'middle')
                .attr('class', 'axis-label')
                .attr('transform', `translate(${-90}, ${innerHeight/2})rotate(-90)`,)
                .text(yAxisLabel)


        const xAxisG = g.append('g').call(xAxis) // same as xAxis(g.append('g'))
             .attr('transform', `translate(0, ${innerHeight})`)
             
             xAxisG.select('.domain').remove()
             xAxisG.append('text')
                .attr('class', 'axis-label')
                .text(xAxisLabel)
                .attr('y', 70)
                .attr('x', innerWidth/2)
                .attr('fill', 'black')

        g.selectAll('circle').data(data)
            .enter().append('circle')
                .attr('cy', d => yScale(yValue(d)))
                .attr('cx', d => xScale(xValue(d)))
                .attr('r', circleRadius)

        g.append('text')
            .attr('class', 'title')
            .attr('y', -10)
            .text(ChartTitle)
    }

    csv("https://vizhub.com/curran/datasets/auto-mpg.csv").then(function(data) {
        data.forEach(d => {
            d.mpg = +d.mpg
            d.cylinders = +d.cylinders
            d.displacement = +d.displacement
            d.horsepower = +d.horsepower
            d.weight = +d.weight
            d.acceleration = +d.acceleration
            d.year = +d.year




        })
        console.log(data)
        render(data);
    });


}(d3))













