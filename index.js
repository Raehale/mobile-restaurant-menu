import { menuArray } from './data.js'

const foodItem = document.getElementById('food-item');

for (let item in menuArray){
    foodItem.innerHTML += 'hello'
}