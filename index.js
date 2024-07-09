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

    rateMessage();
})

/**CLOSE MODAL ON PAY BUTTON CLICK */
payBtn.addEventListener('click', function(){
    if (validateCardForm()){
        checkoutModal.style.display = 'none';
        thankYouNotif(nameInput.value);

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
    mealTotal(itemsCartArr);
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

        mealTotal(itemsCartArr);

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

/**CONFIRMATION NOTIFICATION */
function thankYouNotif(name) {
    cartEl.innerHTML = `<div class="confirm-notif">
                            Thanks, ${name}! Your order is on its way!
                        </div>`
                        
    menuItems.style.display = 'none';
}

/**MEAL TOTAL */
function mealTotal(items) {
    let nameArray = [];
    cartTotal = 0;
    for (const { name, price } of items) {
        nameArray.push(name);
        cartTotal += price;
    }

    console.log(nameArray)

    const discountEl = document.getElementById('discount');
    discountEl.innerHTML = '';
    nameArray.forEach(function(item){

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
            // console.log(nameArray.indexOf('Beer'))
        }

        totalEl.innerHTML = `$${cartTotal}`;
    })
}

/**RATE */
const oneStar = document.getElementById('one-star');
const twoStar = document.getElementById('two-star');
const threeStar = document.getElementById('three-star');
const fourStar = document.getElementById('four-star');
const fiveStar = document.getElementById('five-star');
const stars = document.getElementsByClassName('star');

/**RATE MESSAGE */
const rateEl = document.getElementById('rate');
function rateMessage() {
    const stars = document.getElementById('stars');
    let fullStars = stars.getElementsByClassName('fa-solid');
    console.log(fullStars)
    let totalStars = [];
    for (let i = 0; i < fullStars.length; i++){
        totalStars.push(`<i class="fa-solid fa-star star mini-star"></i>`)
    }
    rateEl.innerHTML += `<div class="confirm-notif">
                            Thanks for your rating of ${totalStars.join(' ')}, we think you're worth ${totalStars.join(' ')} too!
                        </div>`
}

for (let i = 0; i < stars.length; i++){
    stars[i].addEventListener('click', function(event){
    
        if (event.target === fiveStar){
            oneStar.classList.remove('fa-regular');
            oneStar.classList.add('fa-solid');

            twoStar.classList.remove('fa-regular');
            twoStar.classList.add('fa-solid');

            threeStar.classList.remove('fa-regular');
            threeStar.classList.add('fa-solid');

            fourStar.classList.remove('fa-regular');
            fourStar.classList.add('fa-solid');

            fiveStar.classList.remove('fa-regular');
            fiveStar.classList.add('fa-solid');
        } else if (event.target === fourStar){
            oneStar.classList.remove('fa-regular');
            oneStar.classList.add('fa-solid');

            twoStar.classList.remove('fa-regular');
            twoStar.classList.add('fa-solid');

            threeStar.classList.remove('fa-regular');
            threeStar.classList.add('fa-solid');

            fourStar.classList.remove('fa-regular');
            fourStar.classList.add('fa-solid');

            fiveStar.classList.remove('fa-solid');
            fiveStar.classList.add('fa-regular');
        } else if (event.target === threeStar){
            oneStar.classList.remove('fa-regular');
            oneStar.classList.add('fa-solid');

            twoStar.classList.remove('fa-regular');
            twoStar.classList.add('fa-solid');

            threeStar.classList.remove('fa-regular');
            threeStar.classList.add('fa-solid');

            fourStar.classList.remove('fa-solid');
            fourStar.classList.add('fa-regular');

            fiveStar.classList.remove('fa-solid');
            fiveStar.classList.add('fa-regular');
        } else if (event.target === twoStar){
            oneStar.classList.remove('fa-regular');
            oneStar.classList.add('fa-solid');

            twoStar.classList.remove('fa-regular');
            twoStar.classList.add('fa-solid');

            threeStar.classList.remove('fa-solid');
            threeStar.classList.add('fa-regular');

            fourStar.classList.remove('fa-solid');
            fourStar.classList.add('fa-regular');

            fiveStar.classList.remove('fa-solid');
            fiveStar.classList.add('fa-regular');
        } else if (event.target === oneStar){
            oneStar.classList.remove('fa-regular');
            oneStar.classList.add('fa-solid');

            twoStar.classList.remove('fa-solid');
            twoStar.classList.add('fa-regular');

            threeStar.classList.remove('fa-solid');
            threeStar.classList.add('fa-regular');

            fourStar.classList.remove('fa-solid');
            fourStar.classList.add('fa-regular');

            fiveStar.classList.remove('fa-solid');
            fiveStar.classList.add('fa-regular');
        }

        function totalStarsCounted(){
            if (event.target === fiveStar){
                return 5;
            } else if (event.target === fourStar){
                return 4;
            } else if (event.target === threeStar){
                return 3;
            } else if (event.target === twoStar){
                return 2;
            } else if (event.target === oneStar){
                return 1;
            }
        }
    })
}

/**REFRESH PAGE TO START NEW ORDER */
newOrderBtn.addEventListener('click', function(){
    window.location.reload();
})