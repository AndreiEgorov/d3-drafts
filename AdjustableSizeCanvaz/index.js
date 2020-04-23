(function(d3){
    //imports
    const select = d3.select //sort of like import {select} from 'd3'
    const arc = d3.arc
    //imports end

    // console.log("WIDHT", document.)
    const height = document.body.clientHeight;
    const width = document.body.clientWidth;
    
    const svg = select('svg')
        .attr('width', width)
        .attr('height', height)
      

        svg.append('rect')
         .attr('width', width)
         .attr('height', height)
         .attr('rx', 40)

       

     


}(d3))













