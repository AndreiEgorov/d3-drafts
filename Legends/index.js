(function(d3, colorLegend){
    //imports
    const select = d3.select //sort of like import {select} from 'd3'
    const scaleOrdinal = d3.scaleOrdinal

    //imports end


    const colorScale = scaleOrdinal()
        .domain(['apple', 'lemon'])
        .range(['orange', 'yellow'])

    const svg = select('svg')
        .style('background-color', 'olive');
 

    const render = () => {
        fruitBowl(svg, {
            colorScale, 
            height: +svg.attr("height"),

        })
    }

    


    


    

    
























}(d3, colorLegend))













