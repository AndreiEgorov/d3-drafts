//to load the file properly, serve the whole folder on local server like this:
// in terminal, open this folder and type "python -m SimpleHTTPServer 8888 &"

(function(d3){
    //imports
    const select = d3.select //sort of like import {select} from 'd3'
    const csv = d3.csv
    //imports end




        d3.select('body').selectAll('p')
            .data( [5, 10, 15, 20, 25 ])
            .enter()
            .append('p')
            .text(s => "New" + s)
            .html("color", 'red')






}(d3))













