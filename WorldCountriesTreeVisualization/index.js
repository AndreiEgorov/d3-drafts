(function(d3){
    //imports
    const select = d3.select //sort of like import {select} from 'd3'
    const json = d3.json
    const tree = d3.tree
    const hierarchy = d3.hierarchy
    const linkHorizontal =  d3.linkHorizontal
    //imports end

    // console.log("WIDHT", document.)
    const height = document.body.clientHeight;
    const width = document.body.clientWidth;
    const margin = {
        top:0,
        right:200,
        bottom: 0,
        left:0
    }
    
    const innerWidth = height-margin.left - margin.right 
    const innerHeight = height-margin.top - margin.bottom 
    const svg = select('svg')
        .attr('width', width)
        .attr('height', height)




    const treeLayout = tree()
        .size([innerHeight, innerWidth])


       
    json('http://localhost:8887/countryHierarchy.json').then((data) => {
        console.log("DATA", data)
        const root = hierarchy(data)
        const links = treeLayout(root).links()
        console.log("DATA1", root)

        const linkPathGenerator = linkHorizontal()
            .x(d => d.y)
            .y(d => d.x)
        //create one path for each of the links

        svg.selectAll('path')
            .data(links)
            .enter()
            .append('path')
            .attr('d', linkPathGenerator)

        svg.selectAll('text').data(root.descendants())
            .enter().append('text')
            .attr('x', d => d.y)
            .attr('y', d => d.x)
            .attr('dy', '0.32em')
            .text(d => d.data.data.id)


    })



}(d3))













