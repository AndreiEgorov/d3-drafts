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

    const xPosition = (d, i)=> i * 70 + 60 // is needed to guarantee the object consistency (transform happens to the element you expect)
    
    // should be exporting rendering function (should be "export fruitBowl" when Bable used)
    //however returnning it since i need fruitBowl to be available to index.js
    return fruitBowl = (selection, props) => {
        const  { 
            fruits, 
            height, 
            setSelectedFruit, 
            selectedFruit 
        } = props 
        
        
        
        const circles = selection.selectAll('circle')
            .data(fruits, (d) => d.id) //data join (joining dom Elements and data)

        circles
            .enter().append('circle')
                .attr('cx', xPosition ) //i is nee
                .attr('cy', height / 2)
                .attr('r', 0)
            .merge(circles) // (**2) will apply the below attrs to enter and update
                .attr('fill', d => colorScale(d.type))
                .attr('stroke-width', 5)
                .attr('stroke', d =>
                    d.id === selectedFruit ? 'black' : 'none')
                .on('mouseover', (d) => setSelectedFruit(d.id))
                .on('mouseout', (d) => setSelectedFruit(null))
            .transition().duration(1000)
                .attr('cx', xPosition)
                .attr('r', d => radiusScale(d.type))
         
                
        circles
            .exit()
            .transition().duration(1000)
                .attr('r', 0)
            .remove()
    }

}(d3))




