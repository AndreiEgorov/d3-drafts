(function(d3, topojson ){
    //imports
    const select = d3.select //sort of like import {select} from 'd3'
    const json = d3.json
    const geoPath = d3.geoPath

    const geoNaturalEarth1 = d3.geoNaturalEarth1
    // const geoMercator = d3.geoMercator
    // const geoOrthographic = d3.geoOrthographic

    const feature = topojson.feature
    //imports end


    const svg = select('svg').style('background-color', 'steelblue')



    const projection = geoNaturalEarth1();
    // const projection = geoMercator();
    // const projection = geoOrthographic()
    const pathGenerator = geoPath().projection(projection)


    //create sphere around map (works for geoNaturalEarth1)
    svg.append('path')
        .attr('class', 'sphere')
        .attr('d', pathGenerator({type: 'Sphere'}))

    json('http://localhost:8888/countries-110m.json').then((data) => {
        console.log("D1", data)

        //countries-110m.json comes from 'world-atlas -npm' by Mike Bostock
        // need to convert topo json to geo json using TOP json library
        //for that use unpkg.com 
        //to download min version of topojson, use "https://unpkg.com/topojson@3.0.2/dist/topojson.min.js"
        const countries = feature(data, data.objects.countries)
        console.log("D2", countries)

        const paths = svg.selectAll('path')
            .data(countries.features)
        paths.enter().append('path')
        .attr('class', 'countries')
        .attr('d', d => pathGenerator(d))
            

    })

    
























}(d3, topojson))













