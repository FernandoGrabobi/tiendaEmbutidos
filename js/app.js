document.addEventListener('DOMContentLoaded', () => {

    // --- CARGA INICIAL DE DATOS ---
    let users = JSON.parse(localStorage.getItem('users')) || [
        { email: 'cliente@correo.com', password: '123' }
    ];
   
    const products = [
        // Jamones
        { id: 1, name: 'Jamón Ibérico', price: 150.00, image: './assets/jamon.jpg', sales: 50, category: 'jamon' },
        { id: 6, name: 'Paleta Ibérica', price: 75.00, image: './assets/paletaIberica.jpg', sales: 90, category: 'jamon' },
        
        // Chorizos
        { id: 2, name: 'Chorizo Riojano', price: 25.50, image: './assets/chorizo.jpg', sales: 80, category: 'chorizo' },
        { id: 7, name: 'Chorizo de Cantimpalo', price: 28.00, image: './assets/Chorizos_cantimpalos.jpg', sales: 70, category: 'chorizo' },

        // Salchichones (caen en categoría chorizo para el ejemplo)
        { id: 3, name: 'Salchichón de Vic', price: 30.00, image: './assets/salchichon.jpg', sales: 65, category: 'chorizo' },

        // Lomos (caen en categoría otros para el ejemplo)
        { id: 4, name: 'Lomo Embuchado', price: 55.75, image: './assets/lomo.jpg', sales: 40, category: 'otros' },
        
        // Quesos
        { id: 5, name: 'Queso Manchego', price: 45.00, image: './assets/queso_manchego.jpg', sales: 110, category: 'queso' },
    ];


    // --- VARIABLES GLOBALES ---
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let currentProducts = [...products];

    // --- SELECTORES ---
    const productList = document.getElementById('product-list');
    const filterSelect = document.getElementById('filter');
    const cartCount = document.getElementById('cart-count');
    const navLinks = document.querySelectorAll('nav a[data-category]');
    
    // Selectores de Login/Registro
    const welcomeMessage = document.getElementById('welcome-message');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const closeRegisterButton = document.querySelector('.close-register-button');
    const showLoginLink = document.getElementById('show-login-link');
    const showRegisterLink = document.getElementById('show-register-link');
    const desktopLoginBtn = document.getElementById('desktop-login-btn');
    const mobileLoginBtn = document.getElementById('mobile-login-btn');
    const desktopLogoutBtn = document.getElementById('desktop-logout-btn');
    const mobileLogoutBtn = document.getElementById('mobile-logout-btn');

    // Selectores de Menú Móvil
    const mainNav = document.getElementById('main-nav');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const closeNavBtn = document.querySelector('.close-nav-btn');
    const overlay = document.getElementById('overlay');
    const dropBtn = document.querySelector('.drop-btn');

    // Selectores del Carrito
    const cartModal = document.getElementById('cart-modal');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const closeCartButton = document.querySelector('#cart-modal .close-button');
    const cartIcon = document.querySelector('.cart-icon');

    // --- LÓGICA DEL CARRITO DE COMPRAS ---
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `<p class="cart-empty-message">Tu carrito está vacío.</p>`;
            cartTotalPrice.textContent = '$0.00';
            return;
        }

        let total = 0;
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.dataset.id = item.id;
            const subtotal = item.price * item.quantity;
            total += subtotal;

            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>$${subtotal.toFixed(2)}</p>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button class="decrease-qty">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-qty">+</button>
                    </div>
                    <button class="remove-item-btn">&times;</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        cartTotalPrice.textContent = `$${total.toFixed(2)}`;
    }

    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        const cartItem = cart.find(item => item.id === productId);

        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCartCount();
        saveCart();
    }
    
    function updateCartCount() {
        cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
    }
    
    function handleCartActions(e) {
        const itemElement = e.target.closest('.cart-item');
        if (!itemElement) return;

        const productId = parseInt(itemElement.dataset.id);
        const cartItemIndex = cart.findIndex(item => item.id === productId);
        if (cartItemIndex === -1) return;

        if (e.target.matches('.increase-qty')) {
            cart[cartItemIndex].quantity++;
        } else if (e.target.matches('.decrease-qty')) {
            if (cart[cartItemIndex].quantity > 1) {
                cart[cartItemIndex].quantity--;
            } else {
                cart.splice(cartItemIndex, 1);
            }
        } else if (e.target.matches('.remove-item-btn')) {
            cart.splice(cartItemIndex, 1);
        }

        updateCartCount();
        saveCart();
        renderCart();
    }

    // --- LÓGICA DE PRODUCTOS ---
    function renderProducts(productsToRender) {
        productList.innerHTML = '';
        productsToRender.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `<img src="${product.image}" alt="${product.name}"><h3>${product.name}</h3><p class="price">$${product.price.toFixed(2)}</p><button class="add-to-cart-btn" data-id="${product.id}">Añadir al carrito</button>`;
            productList.appendChild(productCard);
        });
    }

    function applySorting() {
        let sortedProducts = [...currentProducts];
        switch (filterSelect.value) {
            case 'mas-vendidos': sortedProducts.sort((a, b) => b.sales - a.sales); break;
            case 'alpha-asc': sortedProducts.sort((a, b) => a.name.localeCompare(b.name)); break;
            case 'alpha-desc': sortedProducts.sort((a, b) => b.name.localeCompare(a.name)); break;
            case 'price-asc': sortedProducts.sort((a, b) => a.price - b.price); break;
            case 'price-desc': sortedProducts.sort((a, b) => b.price - a.price); break;
        }
        renderProducts(sortedProducts);
    }
    
    function filterByCategory(category) {
        currentProducts = category === 'all' ? [...products] : products.filter(product => product.category === category);
        applySorting();
    }

    // --- LÓGICA DE AUTENTICACIÓN ---
    function updateUIForLoggedInUser(user) {
        welcomeMessage.textContent = `Bienvenido, ${user.email}`;
        welcomeMessage.classList.remove('hidden');
        desktopLoginBtn.classList.add('hidden');
        mobileLoginBtn.classList.add('hidden');
        desktopLogoutBtn.classList.remove('hidden');
        mobileLogoutBtn.classList.remove('hidden');
        loginModal.style.display = 'none';
        registerModal.style.display = 'none';
    }

    function updateUIForLoggedOutUser() {
        welcomeMessage.classList.add('hidden');
        desktopLoginBtn.classList.remove('hidden');
        mobileLoginBtn.classList.remove('hidden');
        desktopLogoutBtn.classList.add('hidden');
        mobileLogoutBtn.classList.add('hidden');
    }

    function handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('email-input').value;
        const password = document.getElementById('password-input').value;
        const foundUser = users.find(user => user.email === email && user.password === password);
        if (foundUser) {
            localStorage.setItem('loggedInUser', JSON.stringify(foundUser));
            updateUIForLoggedInUser(foundUser);
            alert('¡Inicio de sesión exitoso!');
        } else {
            alert('Correo electrónico o contraseña incorrectos.');
        }
        loginForm.reset();
    }

    function handleLogout(e) {
        e.preventDefault();
        localStorage.removeItem('loggedInUser');
        updateUIForLoggedOutUser();
        alert('Has cerrado sesión.');
    }

    function handleRegister(e) {
        e.preventDefault();
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        if (users.some(user => user.email === email)) {
            alert('Este correo electrónico ya está registrado.');
            return;
        }
        const newUser = { email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
        registerModal.style.display = 'none';
        loginModal.style.display = 'block';
        registerForm.reset();
    }

    function checkLoginStatus() {
        const loggedInUserJSON = localStorage.getItem('loggedInUser');
        if (loggedInUserJSON) {
            updateUIForLoggedInUser(JSON.parse(loggedInUserJSON));
        } else {
            updateUIForLoggedOutUser();
        }
    }

    // --- LÓGICA DEL MENÚ MÓVIL Y MODALES ---
    function openNav() { mainNav.classList.add('nav-active'); overlay.classList.add('active'); }
    function closeNav() { mainNav.classList.remove('nav-active'); overlay.classList.remove('active'); }
    function openLoginModal(e) { e.preventDefault(); registerModal.style.display = 'none'; loginModal.style.display = 'block'; }
    function openRegisterModal(e) { e.preventDefault(); loginModal.style.display = 'none'; registerModal.style.display = 'block'; }

    // --- EVENT LISTENERS ---
    // Este es el único listener para añadir productos.
    productList.addEventListener('click', e => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        }
    });
    
    cartItemsContainer.addEventListener('click', handleCartActions);
    filterSelect.addEventListener('change', applySorting);
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    desktopLogoutBtn.addEventListener('click', handleLogout);
    mobileLogoutBtn.addEventListener('click', handleLogout);
    hamburgerMenu.addEventListener('click', openNav);
    closeNavBtn.addEventListener('click', closeNav);
    overlay.addEventListener('click', closeNav);
    
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const category = e.target.dataset.category;
            if (category) { filterByCategory(category); }
        });
    });

    dropBtn.addEventListener('click', function(e) {
        e.preventDefault();
        this.parentElement.classList.toggle('submenu-active');
    });

    mainNav.querySelectorAll('a').forEach(link => {
        if (!link.classList.contains('drop-btn')) {
            link.addEventListener('click', closeNav);
        }
    });

    desktopLoginBtn.addEventListener('click', openLoginModal);
    mobileLoginBtn.addEventListener('click', openLoginModal);
    if (showRegisterLink) { showRegisterLink.addEventListener('click', openRegisterModal); }
    if (showLoginLink) { showLoginLink.addEventListener('click', openLoginModal); }
    
    cartIcon.onclick = () => { renderCart(); cartModal.style.display = 'block'; };
    closeCartButton.onclick = () => cartModal.style.display = 'none';
    closeRegisterButton.onclick = () => registerModal.style.display = 'none';
    document.querySelector('.close-login-button').onclick = () => loginModal.style.display = 'none';

    window.onclick = event => {
        if (event.target == cartModal) cartModal.style.display = "none";
        if (event.target == loginModal) loginModal.style.display = "none";
        if (event.target == registerModal) registerModal.style.display = "none";
    };
    
    // --- INICIALIZACIÓN ---
    updateCartCount();
    checkLoginStatus();
    filterByCategory('all');
});