(function(d3){
    //imports
    const select = d3.select //sort of like import {select} from 'd3'
    const arc = d3.arc
    //imports end


    const svg = select('svg')
        .style('background-color', 'red')

    const height = +svg.attr("height");
    const width = +svg.attr("width");

    const g = svg
        .append('g')
            .attr('transform', `translate(${width/2}, ${height/2})`)

    const cirle = g
        .append('circle')
            .attr('r', 200)
            .attr('fill', 'yellow')
            .attr('stroke', 'black')
            .attr('stroke-width', "5")

    const eyeSpacing = 100;
    const eyeYOffset = -70;
    const eyeRadius = 30;
    const eyeBrowWidth = 50;
    const eyeBrowHeight = 10;
    const eyeBrowYOffset = -50;

    const eyesG = g
        .append('g')
            .attr('transform', `translate(0, ${eyeYOffset})`)

    const leftEye = eyesG
        .append('circle')
            .attr('r', eyeRadius)
            .attr('cx',  -eyeSpacing)

    const rightEye = eyesG
        .append('circle')
            .attr('r', eyeRadius)
            .attr('cx', eyeSpacing)
       

    const eyeBrowsG = eyesG
        .append('g')
            .attr('transform', `translate(0, ${eyeYOffset})`);

    eyeBrowsG
        .transition().duration(1000)
            .attr('transform', `translate(0, ${eyeYOffset - 30})`)
        .transition().duration(1000)
            .attr('transform', `translate(0, ${eyeYOffset})`)
                
    
    const leftEyebrow = eyeBrowsG
        .append('rect')
            .attr('x', -eyeSpacing - eyeBrowWidth/2)
            .attr('width', eyeBrowWidth)
            .attr('height', eyeBrowHeight)
        

    const rightEyeBrow = eyeBrowsG
        .append('rect')
            .attr('x', eyeSpacing - eyeBrowWidth/2)
            .attr('width', eyeBrowWidth)
            .attr('height', eyeBrowHeight)
           
    
    const mouth = g
        .append('path')
            .attr('d', arc()({
                innerRadius: 150, 
                outerRadius: 170, 
                startAngle:  Math.PI/2 , 
                endAngle: Math.PI * 3 /2 
            }) )


    

    
























}(d3))













