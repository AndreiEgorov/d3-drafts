(function(d3){
    //imports
    const select = d3.select //sort of like import {select} from 'd3'
    const range = d3.range
    const scaleOrdinal = d3.scaleOrdinal
    //imports end


    const svg = select('svg')
        .style('background-color', 'olive')

    const height = +svg.attr("height");
    const width = +svg.attr("width");

    const colorScale = scaleOrdinal()
        .domain(['apple', 'lemon'])
        .range(['orange', 'yellow'])

    const radiusScale = scaleOrdinal()
        .domain(['apple', 'lemon'])
        .range([20, 15])


    //rendering function
    const render = (selection, { fruits }) => {
            //.enter() if Dom Items# < data.length
            // (**1) update (circles itself is update function) if Dom Items# == data.length, but they are not the same items (aka, data item was modified)
            // or, (**2) instead of calling circles when updating, you can just call "merge(circles)" on enter and set all attr that you want to change on second invocation to the merge 
            //.exit() if Dom Items# > data.length
            

        const circles = selection.selectAll('circle').data(fruits) //data join (joining dom Elements and data)

        circles
            .enter().append('circle')
                .attr('cx', (d, i)=> i * 70 + 60)
                .attr('cy', 60)
            .merge(circles) // (**2) will apply the below attrs to enter and update
                .attr('fill', d => colorScale(d.type))
                .attr('r', d => radiusScale(d.type))

        // circles     //(**1)
        //     .attr('fill', d => colorScale(d.type))
        //     .attr('r', d => radiusScale(d.type))


        circles
            .exit().remove()
    }



    const makeFruit = type => ({type})

    const fruits = range(5)
        .map(() => makeFruit('apple'))
    render(svg, {fruits})

    setTimeout(() => {
        fruits.pop();
        render(svg, {fruits})
    }, 1000)

    setTimeout(() => {
        fruits[2].type = 'lemon';
        render(svg, {fruits})
    }, 2000)

   console.log(fruits)
  


    


    

    
























}(d3))













