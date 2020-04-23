(function(d3, topojson ){
    //imports
    const select = d3.select //sort of like import {select} from 'd3'
    const json = d3.json
    const geoPath = d3.geoPath
    const zoom = d3.zoom
    const event = d3.event

    const geoNaturalEarth1 = d3.geoNaturalEarth1
    // const geoMercator = d3.geoMercator
    // const geoOrthographic = d3.geoOrthographic

    const feature = topojson.feature
    //imports end


    const svg = select('svg').style('background-color', 'steelblue')


    
    const g = svg.append('g')

    svg.call(zoom().on('zoom', ()=> {
        console.log('g', g)
        g.attr('transform', d3.event.transform)
        console.log("ZOMMKI")
    }))

    const projection = geoNaturalEarth1();
    // const projection = geoMercator();
    // const projection = geoOrthographic()
    const pathGenerator = geoPath().projection(projection)


    //create sphere around map (works for geoNaturalEarth1)
    g.append('path') //sphere path
        .attr('class', 'sphere')
        .attr('d', pathGenerator({type: 'Sphere'}))

    json('https://unpkg.com/world-atlas@1.1.4/world/50m.json').then((data) => {
        //'https://unpkg.com/world-atlas@1.1.4/world/110m.json
        //http://localhost:8888/countries-110m.json -> 110 meter resolution
        // console.log("D1", data)

        //countries-110m.json comes from 'world-atlas -npm' by Mike Bostock
        // need to convert topo json to geo json using TOP json library
        //for that use unpkg.com 
        //to download min version of topojson, use "https://unpkg.com/topojson@3.0.2/dist/topojson.min.js"
        const countries = feature(data, data.objects.countries)
        // console.log("D2", countries)

        const paths = g.selectAll('path')
            .data(countries.features)
        paths.enter().append('path')
            .attr('class', 'countries')
            .attr('d', d => pathGenerator(d))
        .append('title')
            .text(d => {
                // console.log(d)
                return d.properties.name
            })

    })

    
























}(d3, topojson))













