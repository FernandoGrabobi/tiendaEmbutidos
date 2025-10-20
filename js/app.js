document.addEventListener('DOMContentLoaded', () => {

     const products = [
        // Jamones
        { id: 1, name: 'Jamón Ibérico', price: 150.00, image: './assets/jamon.jpg', sales: 50, category: 'jamon' },
        { id: 6, name: 'Paleta Ibérica', price: 75.00, image: './assets/paletaiberica.jpg', sales: 90, category: 'jamon' },
        
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

    const productList = document.getElementById('product-list');
    const filterSelect = document.getElementById('filter');
    const cartCount = document.getElementById('cart-count');
    const navLinks = document.querySelectorAll('nav a[data-category]');
    
    let cart = [];
    let currentProducts = [...products];

    // --- FUNCIONES ---
    function renderProducts(productsToRender) {
        productList.innerHTML = '';
        productsToRender.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart-btn" data-id="${product.id}">Añadir al carrito</button>
            `;
            productList.appendChild(productCard);
        });
    }

    function updateCartCount() {
        cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
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
    }
    
    function applySorting() {
        let sortedProducts = [...currentProducts];
        const filterValue = filterSelect.value;

        switch (filterValue) {
            case 'mas-vendidos': sortedProducts.sort((a, b) => b.sales - a.sales); break;
            case 'alpha-asc': sortedProducts.sort((a, b) => a.name.localeCompare(b.name)); break;
            case 'alpha-desc': sortedProducts.sort((a, b) => b.name.localeCompare(a.name)); break;
            case 'price-asc': sortedProducts.sort((a, b) => a.price - b.price); break;
            case 'price-desc': sortedProducts.sort((a, b) => b.price - a.price); break;
        }
        renderProducts(sortedProducts);
    }
    
    function filterByCategory(category) {
        if (category === 'all') {
            currentProducts = [...products];
        } else {
            currentProducts = products.filter(product => product.category === category);
        }
        applySorting();
    }


    // --- EVENT LISTENERS ---
    productList.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        }
    });

    filterSelect.addEventListener('change', applySorting);

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = e.target.dataset.category;
            if(category) { // Asegura que solo los links con categoría filtren
                 filterByCategory(category);
            }
        });
    });

    // --- LÓGICA DEL MENÚ MÓVIL ---
    const mainNav = document.getElementById('main-nav');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const closeNavBtn = document.querySelector('.close-nav-btn');
    const overlay = document.getElementById('overlay');
    const dropBtn = document.querySelector('.drop-btn');
    
    function openNav() {
        mainNav.classList.add('nav-active');
        overlay.classList.add('active');
    }

    function closeNav() {
        mainNav.classList.remove('nav-active');
        overlay.classList.remove('active');
    }

    hamburgerMenu.addEventListener('click', openNav);
    closeNavBtn.addEventListener('click', closeNav);
    overlay.addEventListener('click', closeNav);

    dropBtn.addEventListener('click', function(e) {
        e.preventDefault();
        this.parentElement.classList.toggle('submenu-active');
    });

    mainNav.querySelectorAll('a').forEach(link => {
        if (!link.classList.contains('drop-btn')) {
            link.addEventListener('click', closeNav);
        }
    });
    
    
    // --- LÓGICA DEL MODAL ---
    const cartModal = document.getElementById('cart-modal');
    const loginModal = document.getElementById('login-modal');
    const cartIcon = document.querySelector('.cart-icon');
    const closeButton = document.querySelector('.close-button');
    const desktopLoginBtn = document.getElementById('desktop-login-btn');
    const mobileLoginBtn = document.getElementById('mobile-login-btn');
    const closeLoginButton = document.querySelector('.close-login-button');
    
    cartIcon.onclick = () => cartModal.style.display = 'block';
    closeButton.onclick = () => cartModal.style.display = 'none';

    function openLoginModal(e) {
        e.preventDefault();
        loginModal.style.display = 'block';
    }

    desktopLoginBtn.onclick = openLoginModal;
    mobileLoginBtn.onclick = openLoginModal;
    closeLoginButton.onclick = () => loginModal.style.display = 'none';
    
    window.onclick = (event) => {
        if (event.target == cartModal) cartModal.style.display = "none";
        if (event.target == loginModal) loginModal.style.display = "none";
    }

    // Carga inicial de productos
    filterByCategory('all');
});