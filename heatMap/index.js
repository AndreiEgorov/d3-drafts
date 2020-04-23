//to load the file properly, serve the whole folder on local server like this:
// in terminal, open this folder and type "python -m SimpleHTTPServer 8888 &"

(function(d3){
    //imports
    const json = d3.json
    const select = d3.select 
    const timeDay = d3.timeDay
    const nest = d3.nest
    const utcSunday = d3.utcSunday
    const scaleSequential = d3.scaleSequential
    const interpolateBuGn = d3.interpolateBuGn
    const min = d3.min
    const max = d3.max



    //imports end


    const svg = select('svg')
        .style('background-color', 'olive')
    const margin = 60;
    const height = +svg.attr("height") - 2 * margin;
    const width = +svg.attr("width") - 2 * margin;

    const cellSize = 15;
    const yearHeight = cellSize * 7 + 25;

    const formatDay = d => ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"][d.getUTCDay()];
    const countDay = d => d.getUTCDay();
    const timeWeek = utcSunday
    



    const render = data => {
        data.sort((a, b) => new Date(a.date) - new Date(b.date))
        console.log("DATOS 1", data)


        const dateValues = data.map(dv => ({
            date: timeDay(new Date(dv.date)),
            value: Number(dv.AnswerCount)
        }))

        const countValues = dateValues.map(c => c.value)
        const maxValue = max(countValues)
        const minValue = min(countValues)

        console.log("dateValues", dateValues)

        const group = svg.append('g').attr('class', 'main-group')
    
        const years = nest()
            .key(d => d.date.getUTCFullYear())
            .entries(dateValues)
            .reverse()
        console.log("YEARS", years)

        const year = group
            .selectAll("g")
            .data(years)
            .enter()
            .append('g')
            .attr('class', 'year-group')
            // .join("g")
            .attr("transform", (d, i) => `translate(50, ${yearHeight * i + cellSize * 1.5})`);

        year
            .append('text')
            .attr('x', -5)
            .attr('y', -30)
            .attr('text-anchor', 'end')
            .attr('font-size', 16)
            .attr('font-weight', 550)
            .attr('transform', 'rotate(270)')
            .text(d => d.key);


            
        //     //show the names of the days on the left side of the calendar.
        year.append('g')
            .attr('text-anchor', 'end')
            .selectAll('text')
            .data(d3.range(7).map(i => new Date(1999, 0, i)))
            .enter()
            .append('text')
            .attr('x', -5)
            .attr('y', d => (countDay(d) + 0.5) * cellSize)
            .attr('dy', '0.31em')
            .text(formatDay);


        const colorFn = scaleSequential((interpolateBuGn))
            .domain([minValue, maxValue]);

        year.append('g')
            .selectAll('rect')
            .data(d => d.values)
            .enter()
            .append('rect')
            .attr('width', cellSize - 1.5)
            .attr('height', cellSize - 1.5)

            .attr('x', (d, i) => {
                console.log("DISTANCE", timeWeek.count(d3.utcYear(d.date), d.date) * cellSize + 10)
                
                
                
                return timeWeek.count(d3.utcYear(d.date), d.date) * cellSize + 10
            
            })


            // .attr('x', (d, i) => timeWeek.count(d3.utcYear(d.date), d.date) * cellSize + 10)
            .attr('y', d => countDay(d.date) * cellSize + 0.5)
            .attr('fill', d => colorFn(d.value))
        
        const legend = group.append('g')
            .attr('transform', `translate(10, ${years.length * yearHeight + cellSize * 4})`);


        const categoriesCount = 10;

        const categories = [...Array(categoriesCount)].map((_, i) => {
            const upperBound = maxValue / categoriesCount * (i + 1);
            const lowerBound = maxValue / categoriesCount * i;

            return {
                upperBound, 
                lowerBound,
                color: interpolateBuGn(upperBound / maxValue)
            }
        })

        const legendWidth = 60;
        const legendHeight = 15;

        legend
            .selectAll('rect')
            .data(categories)
            .enter()
            .append('rect')
            .attr('fill', d => d.color)
            .attr('x', (d, i) => legendWidth * i)
            .attr('width', legendWidth)
            .attr('height', legendHeight)
            .on('click', toggle)


        legend //text technically should be inside legend's rects
            .selectAll("text")
            .data(categories)
            .enter()
            .append("text")
            .attr("transform", "rotate(90)")
            .attr("y", (d, i) => - legendWidth * i)
            .attr("dy", -30)
            .attr("x", 18)
            .attr("text-anchor", "start")
            .attr("font-size", 11)
            .text(d => `${d.lowerBound.toFixed(2)} - ${d.upperBound.toFixed(2)}`);


        function toggle(legend){
            const {lowerBound, upperBound, selected} = legend
            
            legend.selected = !selected

            const highlightedDates = years.map(y => ({
                key: y.key, 
                values: y.values.filter(v => v.value > lowerBound && v.value <= upperBound)
            }))

            year.data(highlightedDates)
                .selectAll('rect')
                .data(d => d.values, d => d.date)
                .transition()
                    .duration(500)
                    .attr('fill', d => legend.selected ? colorFn(d.value) : 'white')



        }

        
        
    }

   
 




    json("http://localhost:8080/data.json").then(function(data) {
      
        console.log("BOSOS", data)
        render(data);
    })


}(d3))













