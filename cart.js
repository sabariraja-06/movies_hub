// Store cart data in localStorage
let cart = JSON.parse(localStorage.getItem('ottCart')) || [];

// DOM Elements
const cartItemsElement = document.getElementById('cart-items');
const cartEmptyElement = document.getElementById('cart-empty');
const cartTotalElement = document.getElementById('cart-total');
const totalAmountElement = document.getElementById('total-amount');
const cartCountElement = document.querySelector('.cart-count'); // Updated to use querySelector
const checkoutSection = document.getElementById('checkout-section');
const checkoutForm = document.getElementById('checkout-form');
const qrContainer = document.getElementById('qr-container');
const submitDetailsBtn = document.getElementById('submit-details');
const paymentConfirmation = document.getElementById('payment-confirmation');
const wishlistCount = document.querySelector('.wishlist-count');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize wishlist count
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
    }
    
    updateCartDisplay();
});

// Update cart display
function updateCartDisplay() {
    updateCartCount();
    
    if (cart.length === 0) {
        cartEmptyElement.style.display = 'block';
        cartItemsElement.style.display = 'none';
        cartTotalElement.style.display = 'none';
        checkoutSection.style.display = 'none';
    } else {
        cartEmptyElement.style.display = 'none';
        cartItemsElement.style.display = 'block';
        cartTotalElement.style.display = 'block';
        checkoutSection.style.display = 'block';
        
        // Clear previous cart items
        cartItemsElement.innerHTML = '';
        
        // Calculate total
        let total = 0;
        
        // Add each item to the cart display
        cart.forEach((item, index) => {
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image || '/api/placeholder/80/80'}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.name}</h3>
                    <p class="cart-item-duration">${item.duration || '1 Month'} Subscription</p>
                    <p class="cart-item-price">₹${item.price}</p>
                </div>
                <div class="cart-item-action">
                    <i class="fas fa-trash cart-item-remove" data-index="${index}"></i>
                </div>
            `;
            cartItemsElement.appendChild(cartItemElement);
            
            // Add to total - make sure we're parsing the price as a number
            total += parseFloat(item.price);
        });
        
        // Update total display
        totalAmountElement.textContent = total.toFixed(2);
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeFromCart(index);
            });
        });
    }
}

// Update cart count
function updateCartCount() {
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartDisplay();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('ottCart', JSON.stringify(cart));
}

// Handle form submission
if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        
        // Create order data
        const orderData = {
            customer: {
                name,
                email,
                phone
            },
            items: cart,
            total: calculateTotal(cart),
            orderDate: new Date().toISOString()
        };
        
        // Send order details (simulated)
        console.log('Order data:', orderData);
        
        // Unblur QR code
        qrContainer.classList.remove('blurred');
        
        // Change button text
        submitDetailsBtn.textContent = 'Details Submitted';
        submitDetailsBtn.disabled = true;
        
        // Show payment confirmation section
        paymentConfirmation.classList.remove('hidden');
        
        // Scroll to payment confirmation section
        paymentConfirmation.scrollIntoView({ behavior: 'smooth' });
    });
}

// Calculate total
function calculateTotal(cartItems) {
    return cartItems.reduce((total, item) => total + parseFloat(item.price), 0).toFixed(2);
}