import { menuArray } from './data.js'

const menuItems = document.getElementById('menu-items');

let itemHTML = '';
menuArray.forEach( function(item){
    let ingredients = (item.ingredients).join(', ')

    itemHTML = `<section class="menu-item">
                    <div class="item-info">
                        <div class="emoji">${item.emoji}</div>
                        <div class="text">
                            <div class="item-name">${item.name}</div>
                            <div class="item-ingredients">${ingredients}</div>
                            <div class="item-price">$${item.price}</div>
                        </div>
                    </div>
                    <div class="add-to-cart">
                        <i class="fa-solid fa-plus"></i>
                    </div>
                </section>`;

    menuItems.innerHTML += itemHTML;
})