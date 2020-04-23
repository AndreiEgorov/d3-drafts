(function(d3, fruitBowl){
    //imports
    const select = d3.select //sort of like import {select} from 'd3'
    const range = d3.range

    //imports end

    const svg = select('svg')
        .style('background-color', 'olive');

    const makeFruit = type => ({
        type,
        id: Math.random()
    })
    
    let fruits = range(5)
        .map(() => makeFruit('apple'))

    
    let selectedFruit = null;

    const setSelectedFruit = id => {
       
        selectedFruit = id
        render()
    }

    const render = () => {
        fruitBowl(svg, {
            fruits, 
            height: +svg.attr("height"),
            setSelectedFruit,
            selectedFruit 
        })
    }

    render()

    //eat an apple
    setTimeout(() => {
        fruits.pop();
        render()
    }, 1000)

    //replace an apple with a lemon
    setTimeout(() => {
        fruits[2].type = 'lemon';
        fruitBowl(svg, {fruits})
    }, 2000)


     //eat another apple
     setTimeout(() => {
        fruits = fruits.filter((d, i) => i !== 1);
        render()
    }, 3000)

   console.log(fruits)
  


    


    

    
























}(d3, fruitBowl))













