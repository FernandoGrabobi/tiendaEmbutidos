document.addEventListener('DOMContentLoaded', () => {

    // --- DATOS DE EJEMPLO ---
    // En una aplicación real, esto vendría de una base de datos.
    const products = [
        { id: 1, name: 'Jamón Ibérico', price: 150.00, image: './assets/jamon.jpg', sales: 50 },
        { id: 2, name: 'Chorizo Riojano', price: 25.50, image: './assets/chorizo.jpg', sales: 80 },
        { id: 3, name: 'Salchichón de Vic', price: 30.00, image: './assets/salchichon.jpg', sales: 65 },
        { id: 4, name: 'Lomo Embuchado', price: 55.75, image: './assets/lomo.jpg', sales: 40 }
    ];

    const productList = document.getElementById('product-list');
    const filter = document.getElementById('filter');
    const cartCount = document.getElementById('cart-count');
    
    let cart = [];

    // --- FUNCIONES ---

    // Función para mostrar los productos en la página
    function renderProducts(productsToRender) {
        productList.innerHTML = ''; // Limpiar la lista de productos
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

    // Función para actualizar el contador del carrito
    function updateCartCount() {
        cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
    }
    
    // Función para añadir productos al carrito. [4]
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
    
    // Función para filtrar y ordenar los productos
    function filterAndSortProducts() {
        let sortedProducts = [...products];
        const filterValue = filter.value;

        switch (filterValue) {
            case 'mas-vendidos':
                sortedProducts.sort((a, b) => b.sales - a.sales);
                break;
            case 'alpha-asc':
                sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'alpha-desc':
                sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'price-asc':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
        }
        renderProducts(sortedProducts);
    }

    // --- EVENT LISTENERS ---
    
    // Añadir al carrito
    productList.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        }
    });

    // Cambiar filtro
    filter.addEventListener('change', filterAndSortProducts);

    // Carga inicial de productos
    filterAndSortProducts();
    
    // --- LÓGICA DEL MODAL (VENTANAS EMERGENTES) ---
    
    // Carrito
    const cartModal = document.getElementById('cart-modal');
    const cartIcon = document.querySelector('.cart-icon');
    const closeButton = document.querySelector('.close-button');
    
    cartIcon.onclick = () => cartModal.style.display = 'block';
    closeButton.onclick = () => cartModal.style.display = 'none';

    // Login
    const loginModal = document.getElementById('login-modal');
    const loginBtn = document.getElementById('login-btn');
    const closeLoginButton = document.querySelector('.close-login-button');

    loginBtn.onclick = () => loginModal.style.display = 'block';
    closeLoginButton.onclick = () => loginModal.style.display = 'none';
    
    window.onclick = (event) => {
        if (event.target == cartModal) {
            cartModal.style.display = 'none';
        }
        if (event.target == loginModal) {
            loginModal.style.display = 'none';
        }
    }
});