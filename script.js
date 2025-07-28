document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Element Selections ---
    const menuGrid = document.querySelector('.menu-grid');
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const submitOrderBtn = document.getElementById('submit-order-btn');
    const printBtn = document.getElementById('print-btn');
    const loadingOverlay = document.getElementById('loading-overlay');

    // --- State Management ---
    let cart = [];

    // --- Functions ---
    const loadCartFromStorage = () => {
        const storedCart = localStorage.getItem('foodCart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
            renderCart();
            updateTotal();
        }
    };
    
    const saveCartToStorage = () => {
        localStorage.setItem('foodCart', JSON.stringify(cart));
    };

    const addToCart = (id, name, price, quantity) => {
        const existingItemIndex = cart.findIndex(item => item.id === id);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({ id, name, price, quantity });
        }
        
        renderCart();
        updateTotal();
        saveCartToStorage();
    };

    const renderCart = () => {
        cartItemsContainer.innerHTML = ''; 

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your plate is empty.</p>';
            return;
        }

        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.dataset.id = item.id;
            
            
            cartItemElement.innerHTML = `
                <div class="cart-item-details">
                    <p class="cart-item-name">${item.quantity} x ${item.name}</p>
                    <p class="cart-item-price">₦${(item.price * item.quantity).toLocaleString()}</p>
                </div>
                <button class="remove-item-btn">&times;</button>
            `;
            cartItemsContainer.appendChild(cartItemElement);
        });
    };
    
    const updateTotal = () => {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalPriceElement.textContent = `₦${total.toLocaleString()}`;
    };

    const removeFromCart = (id) => {
        cart = cart.filter(item => item.id !== id);
        renderCart();
        updateTotal();
        saveCartToStorage();
    };
    
    // --- Event Listeners ---
    menuGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-plate-btn')) {
            const card = e.target.closest('.food-card');
            const id = card.dataset.id;
            const name = card.dataset.name;
            const price = parseFloat(card.dataset.price);
            const quantity = parseInt(card.querySelector('.quantity').value);

            if (quantity > 0) {
                addToCart(id, name, price, quantity);
            }
        }
    });

    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item-btn')) {
            const cartItem = e.target.closest('.cart-item');
            const id = cartItem.dataset.id;
            removeFromCart(id);
        }
    });

    submitOrderBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your plate is empty! Please add at least one item.');
            return;
        }
        
        loadingOverlay.classList.remove('hidden');
        
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
            alert('Success! Your order has been submitted.');
            
            cart = [];
            renderCart();
            updateTotal();
            saveCartToStorage();
        }, 2000);
    });

    printBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your plate is empty! Nothing to print.');
            return;
        }
        window.print();
    });

    // --- Initial Load ---
    loadCartFromStorage();
});