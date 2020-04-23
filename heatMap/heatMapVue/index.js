//to load the file properly, serve the whole folder on local server like this:
// in terminal, open this folder and type "python -m SimpleHTTPServer 8888 &"

(function(d3){
    //imports
    const json = d3.json
    const select = d3.select 

    //imports end

    const svg = select('svg')
        .style('background-color', 'white')
    const height = +svg.attr("height");
    const width = +svg.attr("width");


    let requestedData = null;

    const render = () => {
        if (requestedData !== null) {
            heatMapBuilder(svg, {
                data:requestedData,
                height,
                width,
                }
            )
        } else {
            console.log("NO data YET!!")
        }
    }
    
  

    json("http://localhost:8008/data.json").then(function(data) {

        data.sort((a, b) => new Date(b.date) - new Date(a.date))
        
        const oneYearData = data.filter(d => {
            return new Date(d.date).getFullYear() == 2019 }
        )
        const dateValues = oneYearData.map(dv => ({
            date: utcHour(new Date(dv.date)),
            value: Number(dv.reads),
            id: dv.date * Math.random()
            })
        )

        requestedData = dateValues;
        // console.log("REAQ",requestedData )
        render();
    })


    


























    //BUILDER MODULE, KEEP SEPARATELY!

    const utcDay = d3.utcDay
    const utcHour = d3.utcHour
    const scaleSequential = d3.scaleSequential
    const interpolateBlues = d3.interpolateBlues
    const min = d3.min
    const max = d3.max
    const scaleBand = d3.scaleBand
    const axisBottom = d3.axisBottom
    const axisRight = d3.axisRight

    
    // should be exporting rendering function (should be "export fruitBowl" when Bable used)
    //however returnning it since i need fruitBowl to be available to index.js
    const heatMapBuilder = (selection, props) => {
        const  {
            data,
            height, 
            width
        } = props 
        
        

        var toolTipDiv = d3.select("body").append("div")	
            .attr("class", "cell-tooltip")				
            .style("opacity", 0);

        const verticalMargin = height/10;
        const horizontalMargin = width/10
        const margin = {top: verticalMargin, right: 20 + horizontalMargin * 2, bottom: verticalMargin, left: horizontalMargin};
        
        const innerHeight = height - margin.top - margin.bottom;
        const innerWidth = width - margin.left - margin.right ;
        const hourCellHeight = innerWidth/20;
        const cellGap = 3;
        const hourCellWidth = hourCellHeight * 3 + cellGap;

        const days = [ "Sun","Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        const hours = ['12am', null, '2am', null ,'4am', null ,'6am',null,'8am',null,'10am',null,'12pm',null,'2pm', null, '4pm', null, '6pm', null, '8pm', null, '10pm', null]

        const chartRowWidth = hourCellWidth * days.length
        const chartColumnHeight = hourCellHeight * hours.length;

        const weekNumber = date => utcDay(date).getDay()


        const getReadsArr = data.map(c => c.value)
        const maxValue = max(getReadsArr)
        const minValue = min(getReadsArr)
        
        const colorFn = scaleSequential(interpolateBlues)
            .domain([minValue, maxValue]);

        const xScale = scaleBand() 
            .domain(days.map((_, i) => i)) //returning index and not d, only to use i in attr('x') rect calc
            .range([0, chartRowWidth])

        const xAxis = axisBottom(xScale)
            xAxis.tickFormat((i)=>  days[i])


        const yScale = scaleBand()
            .domain(hours.map((d,i)=> i ))
            .range([0, chartColumnHeight])

        const yAxis = axisRight(yScale)
            yAxis.tickFormat((i)=>  hours[i])

    
        const chart = selection.append('g')
                        .attr('class', 'chart-main-group')


        const chartTitle = chart.append('text')
            .text("Users by time of day")
            .attr('class', 'chart-title')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)

        const hourCellsG = chart.append('g')
            .attr('class', 'hour-cells-group')
            .attr('transform', `translate(${margin.left}, ${margin.top + 20})`)

       
        const rectG = hourCellsG.selectAll('g')
                .data(data, (d) => d.id)
                .enter()
                .append('g')

            const rectCell = rectG.append('rect')
                .attr('class', 'hour-cell')
                .attr('width', hourCellWidth - cellGap)
                .attr('height', hourCellHeight- cellGap)
                .attr('x', d => xScale(weekNumber(d.date)))
                .attr('y', d => yScale(utcHour(new Date(d.date)).getHours()))
                .attr('fill', d => colorFn(d.value))


            rectG
                .on('mouseover', function(d) {
                    const currentRectG = d3.select(this) //get current rectG
                        .attr('stroke', 'black')
                        .attr('stroke-width', 3)

                    const childRect = currentRectG.selectAll('rect') 
                    
                    const xPosition = childRect.attr('x')    
                    const yPosition = childRect.attr('y')    

                    toolTipDiv
                        .html(`<span class="reads-value">Reads: ${d.value}</span>` + "<br/>" + `<span>ID:${d.id}</span>` )
                        .style('position', 'absolute')	
                        .style("left", (`${+xPosition + 10}px`))		
                        .style("top", (`${+yPosition + 35}px`)) 	
                        .style("opacity", 0.9);	
                })

                .on('mouseout', function(d){
                    const currentRectG = d3.select(this);
                    currentRectG.attr('stroke', 'none')
                        .attr('stroke-width', 1)
                    toolTipDiv
                        .style("opacity", 0);
                })
            
        const xAxisG = hourCellsG.append('g').call(xAxis)
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${chartColumnHeight})`)
            xAxisG.selectAll('.domain, .tick line')
                .remove()

                
        const yAxisG = hourCellsG.append('g').call(yAxis)
            .attr('class', 'y-axis')
            .attr('transform', `translate(${chartRowWidth }, 0)`)
            yAxisG.selectAll('.domain, .tick line')
                .remove()
            
                
        const legendG = chart.append('g')
            .attr('class', 'legend-group')
            .attr('transform', `translate(${margin.left}, ${chartColumnHeight + 120})`);

        const categoriesCount = 4;
        const categories = [...Array(categoriesCount)].map((_,i) => {
            const upperBound = maxValue / categoriesCount * (i + 1);
            const lowerBound = maxValue / categoriesCount * i;
            return {
                upperBound,
                lowerBound,
                color: interpolateBlues(upperBound / maxValue)
            }
        })

        const legendCellWidth = chartRowWidth / categoriesCount;
        const legendHeight = hourCellHeight;
        
        const alignLegendText = (_, itemIndex) => {
            const lastTextEl = categories.length - 1
            if (itemIndex === lastTextEl) {
                return 'legend-last-text'
            } else {
                return 'legend-middle-text'
            }
        };

        legendG 
            .selectAll('g')
            .data(categories)
            .enter()
            .append('rect')
            .attr('class', 'legend-cell')
            .attr('fill', d => d.color)
            .attr('x', (d, i)=> legendCellWidth * i)
            .attr('width', legendCellWidth - cellGap)
            .attr('height', legendHeight)

        legendG.selectAll('text')
            .data(categories)
            .enter()
            .append('text')
            .attr('class', alignLegendText)
            .text( (d, i)=> `${d.upperBound.toFixed()}`)
            .attr('x',  (d, i)=> legendCellWidth * (i+1))
            .attr('y', hourCellHeight + 15 )

        legendG
            .append('text')
            .text("0")
            .attr('class', 'legend-first-text')
            .attr('y', hourCellHeight + 15 )


    
        
        
    }

   


}(d3))













