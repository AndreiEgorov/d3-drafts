(function(d3){

    //imports
    const scaleOrdinal = d3.scaleOrdinal
    //imports end



    const colorScale = scaleOrdinal()
        .domain(['apple', 'lemon'])
        .range(['orange', 'yellow'])

    const radiusScale = scaleOrdinal()
        .domain(['apple', 'lemon'])
        .range([20, 15])

    
    // should be exporting rendering function (should be "export fruitBowl" when Bable used)
    //however returnning it since i need fruitBowl to be available to index.js
    return fruitBowl = (selection, props) => {
        const  { fruits, height } = props


        const groups = selection.selectAll('g')
            .data(fruits)
        const groupsEnter = groups.enter().append('g')
        
        groupsEnter
            .merge(groups) // (**2) will apply the below attrs to enter and update     
                .attr('transform', (d,i) => 
                    `translate(${i * 70 + 60}, ${height / 2})`
                )
            
        groups
            .exit().remove()


        groupsEnter.append('circle')
            .merge(groups.select('circle')) // (**2) will apply the below attrs to enter and update
                .attr('r', d => radiusScale(d.type))
                .attr('fill', d => colorScale(d.type))       
    

        

        const text = selection.selectAll('text')
            .data(fruits)
            text
            .enter().append('text')
                .attr('x', (d, i)=> i * 70 + 60 ) //i is nee
                .attr('y', height / 2)
            .merge(text) // (**2) will apply the below attrs to enter and update
                .text( d => d.type)       
            text
            .exit().remove()
    }

}(d3))




