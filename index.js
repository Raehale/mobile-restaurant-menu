import { menuArray } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const menuItems = document.getElementById('menu-items');
const cartEl = document.getElementById('cart');
const itemsInCartEl = document.getElementById('items-in-cart');
const totalEl = document.getElementById('total');
const completeOrderBtn = document.getElementById('complete-order');
const checkoutModal = document.getElementById('checkout-modal');
const rateModal = document.getElementById('rate-modal');
const payBtn = document.getElementById('pay-btn');
const nameInput = document.getElementById('name-input');
const cardInput = document.getElementById('card-input');
const cvvInput = document.getElementById('cvv-input');
const closeModalBtn = document.getElementById('x-modal');
const submitRateBtn = document.getElementById('submit-btn');
const newOrderBtn = document.getElementById('new-order-btn');

let cartTotal = 0;

/**POPUP CHECKOUT MODAL */
completeOrderBtn.addEventListener('click', function(){
    checkoutModal.style.display = 'flex';
});

/**POPUP RATE MODAL */
payBtn.addEventListener('click', function(){
    rateModal.style.display = 'flex';
});

/**CLOSE RATE MODAL */
closeModalBtn.addEventListener('click', function(){
    rateModal.style.display = 'none';
    newOrderBtn.style.display = 'flex';
})
submitRateBtn.addEventListener('click', function(){
    rateModal.style.display = 'none';
    newOrderBtn.style.display = 'flex';

    returnTotalStarRating();
})

/**CLOSE MODAL ON PAY BUTTON CLICK */
payBtn.addEventListener('click', function(){
    if (validateCardForm()){
        checkoutModal.style.display = 'none';
        renderThankYouNotif(nameInput.value);

        nameInput.value = '';
        cardInput.value = '';
        cvvInput.value = '';
    };
});

/**CREATES MENU ITEM HTML */
let itemHTML = '';
menuArray.forEach( function(item){
    let ingredients = (item.ingredients).join(', ');

    itemHTML = `<section class="menu-item" id="${item.id}">
                    <div class="item-info">
                        <div class="emoji">${item.emoji}</div>
                        <div class="text">
                            <div class="item-name">${item.name}</div>
                            <div class="item-ingredients">${ingredients}</div>
                            <div class="item-price">$${item.price}</div>
                        </div>
                    </div>
                    <i class="add-to-cart fa-solid fa-plus" data-id="${item.id}"></i>
                </section>`;

    menuItems.innerHTML += itemHTML;
})

/**ADD ITEM TO CART */
let cartItemHTML = '';
menuItems.addEventListener('click', function(event){
    if (event.target.getAttribute('data-id')){
        cartEl.style.display = 'flex';

        let itemID = Number(event.target.getAttribute('data-id'));
        const currentItemArr = menuArray.find(item => item.id === itemID);

        getCartItemHTML(currentItemArr);
        let recentItemAdd = itemsCartArr[itemsCartArr.length -1];
        itemsInCartEl.innerHTML += (recentItemAdd.content);
    };
});

/**CREATE CART ITEM HTML */
let itemsCartArr = []
let itemCartObj = {}
function getCartItemHTML(itemArr){

    let itemUUID = uuidv4();
    cartItemHTML = `<section class="cart-item" id="cart-item-${itemUUID}" data-name="cart-item-${itemArr.name}">
                        <div class="item-title">
                            ${itemArr.name}
                            <div class="remove" data-id="${itemUUID}">remove</div>
                        </div>
                        <div class="item-total" id="price-${itemUUID}">$${itemArr.price}</div>
                    </section>`;

    itemCartObj = {id: itemUUID, name: itemArr.name, price: itemArr.price, content: cartItemHTML}

    itemsCartArr.push(itemCartObj);
    calculateMealTotal(itemsCartArr);
    return itemsCartArr;
}

/**REMOVE AN ITEM FROM THE CART */
itemsInCartEl.addEventListener('click', function(event){
    if (event.target.getAttribute('data-id')){
        let itemID = event.target.getAttribute('data-id');
        let indexOfItem = itemsCartArr.findIndex(obj => obj.id === itemID);

        if (indexOfItem !== -1){
            itemsCartArr.splice(indexOfItem, 1)
        }

        calculateMealTotal(itemsCartArr);

        itemsInCartEl.innerHTML = '';
        itemsCartArr.forEach( function(item){
            itemsInCartEl.innerHTML += item.content;
        });
    };
});

/**VALIDATE FORM */
function validateCardForm(){
    let isFilled = true;

    if (nameInput.value === '' || cardInput.value === '' || cvvInput.value === ''){
        isFilled = false;
    }

    if (!Number(cardInput.value) || (cardInput.value.length !== 16)){
        isFilled = false;
    }

    if (!Number(cvvInput.value) || (cvvInput.value.length !== 3)){
        isFilled = false;
    }

    return isFilled
}

/**CONFIRMATION NOTIFICATION HTML */
function renderThankYouNotif(name) {
    cartEl.innerHTML = `<div class="confirm-notif">
                            Thanks, ${name}! Your order is on its way!
                        </div>`;
                        
    hideMenuItems();
}

/**HIDE MENU ITEMS */
function hideMenuItems() {
    menuItems.style.display = 'none';
}

/**MEAL TOTAL */
function calculateMealTotal(items) {
    let nameArray = [];
    cartTotal = 0;
    for (const { name, price } of items) {
        nameArray.push(name);
        cartTotal += price;
    }

    const discountEl = document.getElementById('discount');
    discountEl.innerHTML = '';
    nameArray.forEach(function(item){

        findMealType(discountEl, nameArray);

        totalEl.innerHTML = `$${cartTotal}`;
    })
}

/**DETERMINE MEAL TYPE */
function findMealType(discountEl, nameArray){

    renderPizzaMeal(discountEl, nameArray);
    renderBurgerMeal(discountEl, nameArray);

}

/**PIZZA MEAL */
function renderPizzaMeal(discountEl, nameArray){
    if (((nameArray.includes('Beer')) && (nameArray.includes('Pizza')))){
        cartTotal -= 6;
        discountEl.innerHTML += `<section class="discount-section">
                                    <div class="discount-title">
                                        Meal Deal Discount for Pizza and Beer
                                    </div>
                                    <div class="discount-total">-$6</div>
                                </section>`;
        nameArray.splice(nameArray.indexOf('Beer'), 1);
        nameArray.splice(nameArray.indexOf('Pizza'), 1);
    }
}

/**BURGER MEAL */
function renderBurgerMeal(discountEl, nameArray){
    if (((nameArray.includes('Beer')) && (nameArray.includes('Hamburger')))){
        cartTotal -= 4;
        discountEl.innerHTML += `<section class="discount-section">
                                    <div class="discount-title">
                                        Meal Deal Discount for Burger and Beer
                                    </div>
                                    <div class="discount-total">-$4</div>
                                </section>`;
        nameArray.splice(nameArray.indexOf('Beer'), 1);
        nameArray.splice(nameArray.indexOf('Hamburger'), 1);
    }
}

/**RATE */
const starsEl = document.getElementById('stars');
const stars = document.getElementsByClassName('star');
const rateEl = document.getElementById('rate');
let cls = '';

starsEl.addEventListener('click', function(event){
    let starNumber = event.target.dataset.star;
    addStarRating(starNumber);
})

function returnTotalStarRating(){
    const solidStars = starsEl.getElementsByClassName('fa-solid');
    let totalStars = 0;
    for (let i = 0; i < solidStars.length; i++){
        totalStars += 1;
    }
    rateMessage(totalStars);
}

function addStarRating(n){
    removeStarRating();

    for (let i = 0; i < n; i++){
        if (n == 1){
            cls = 'fa-solid one';
        }
        if (n == 2){
            cls = 'fa-solid two';
        }
        if (n == 3){
            cls = 'fa-solid three';
        }
        if (n == 4){
            cls = 'fa-solid four';
        }
        if (n == 5){
            cls = 'fa-solid five';
        }

        stars[i].className = 'fa-star star ' + cls;
    }
}

function removeStarRating(){
    let i = 0;
    while (i < 5){
        stars[i].className = 'fa-regular fa-star star';
        i++;
    }
}

/**RATE MESSAGE */
function rateMessage(n) {
    let totalStars = [];
    for (let i = 0; i < n; i++){
        totalStars.push(`<i class="fa-solid fa-star star mini-star"></i>`);
    }

    rateEl.innerHTML += `<div class="confirm-notif">
                            Thanks for your rating of ${totalStars.join(' ')}, we think you're worth ${totalStars.join(' ')} too!
                        </div>`;
}

/**REFRESH PAGE TO START NEW ORDER */
newOrderBtn.addEventListener('click', function(){
    window.location.reload();
})