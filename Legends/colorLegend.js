(function(d3){

    //imports

    //imports end

    
      return colorLegend = (selection, props) => {
        const  { colorScale, height } = props
        
        
        const groups = selection.selectAll('g')
            .data(colorScale.domain()) 
            
        const groupsEnter = groups.enter().append('g')

            groupsEnter.append('circle')
                .merge(groups.select('circle')) 
                    .attr('r', 20)
                    .attr('fill', d => colorScale(d.type))
            
      
    }

}(d3))




