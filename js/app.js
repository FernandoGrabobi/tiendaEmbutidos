document.addEventListener('DOMContentLoaded', () => {

    let users = JSON.parse(localStorage.getItem('users'));
    if (!users) {
        users = [
            { email: 'cliente@correo.com', password: '123' },
            { email: 'test@test.com', password: 'password' }
        ];
        localStorage.setItem('users', JSON.stringify(users));
    }

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
    const mainNav = document.getElementById('main-nav');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const closeNavBtn = document.querySelector('.close-nav-btn');
    const overlay = document.getElementById('overlay');
    const dropBtn = document.querySelector('.drop-btn');

    let cart = [];
    let currentProducts = [...products];

    function renderProducts(productsToRender){productList.innerHTML="";productsToRender.forEach(e=>{const o=document.createElement("div");o.className="product-card",o.innerHTML=`\n                <img src="${e.image}" alt="${e.name}">\n                <h3>${e.name}</h3>\n                <p class="price">$${e.price.toFixed(2)}</p>\n                <button class="add-to-cart-btn" data-id="${e.id}">Añadir al carrito</button>\n            `,productList.appendChild(o)})}
    function updateCartCount(){cartCount.textContent=cart.reduce((e,o)=>e+o.quantity,0)}
    function addToCart(e){const o=products.find(o=>o.id===e),t=cart.find(o=>o.id===e);t?t.quantity++:cart.push({...o,quantity:1}),updateCartCount()}
    function applySorting(){let e=[...currentProducts];const o=filterSelect.value;switch(o){case"mas-vendidos":e.sort((e,o)=>o.sales-e.sales);break;case"alpha-asc":e.sort((e,o)=>e.name.localeCompare(o.name));break;case"alpha-desc":e.sort((e,o)=>o.name.localeCompare(e.name));break;case"price-asc":e.sort((e,o)=>e.price-o.price);break;case"price-desc":e.sort((e,o)=>o.price-e.price)}renderProducts(e)}
    function filterByCategory(e){currentProducts="all"===e?[...products]:products.filter(o=>o.category===e),applySorting()}
    function updateUIForLoggedInUser(e){welcomeMessage.textContent=`Bienvenido, ${e.email}`,welcomeMessage.classList.remove("hidden"),desktopLoginBtn.classList.add("hidden"),mobileLoginBtn.classList.add("hidden"),desktopLogoutBtn.classList.remove("hidden"),mobileLogoutBtn.classList.remove("hidden"),loginModal.style.display="none",registerModal.style.display="none"}
    function updateUIForLoggedOutUser(){welcomeMessage.classList.add("hidden"),desktopLoginBtn.classList.remove("hidden"),mobileLoginBtn.classList.remove("hidden"),desktopLogoutBtn.classList.add("hidden"),mobileLogoutBtn.classList.add("hidden")}
    function handleLogin(e){e.preventDefault();const o=document.getElementById("email-input").value,t=document.getElementById("password-input").value,i=users.find(e=>e.email===o&&e.password===t);i?(localStorage.setItem("loggedInUser",JSON.stringify(i)),updateUIForLoggedInUser(i),alert("¡Inicio de sesión exitoso!")):alert("Correo electrónico o contraseña incorrectos."),loginForm.reset()}
    function handleLogout(e){e.preventDefault(),localStorage.removeItem("loggedInUser"),updateUIForLoggedOutUser(),alert("Has cerrado sesión.")}
    function handleRegister(e){e.preventDefault();const o=document.getElementById("register-email").value,t=document.getElementById("register-password").value;if(users.some(e=>e.email===o))return void alert("Este correo electrónico ya está registrado.");const i={email:o,password:t};users.push(i),localStorage.setItem("users",JSON.stringify(users)),alert("¡Registro exitoso! Ahora puedes iniciar sesión."),registerModal.style.display="none",loginModal.style.display="block",registerForm.reset()}
    function checkLoginStatus(){const e=localStorage.getItem("loggedInUser");e?updateUIForLoggedInUser(JSON.parse(e)):updateUIForLoggedOutUser()}
    function openNav(){mainNav.classList.add("nav-active"),overlay.classList.add("active")}
    function closeNav(){mainNav.classList.remove("nav-active"),overlay.classList.remove("active")}
    productList.addEventListener("click",e=>{e.target.classList.contains("add-to-cart-btn")&&addToCart(parseInt(e.target.getAttribute("data-id")))}),filterSelect.addEventListener("change",applySorting),loginForm.addEventListener("submit",handleLogin),registerForm.addEventListener("submit",handleRegister),desktopLogoutBtn.addEventListener("click",handleLogout),mobileLogoutBtn.addEventListener("click",handleLogout),hamburgerMenu.addEventListener("click",openNav),closeNavBtn.addEventListener("click",closeNav),overlay.addEventListener("click",closeNav),navLinks.forEach(e=>{e.addEventListener("click",o=>{o.preventDefault();const t=e.dataset.category;t&&filterByCategory(t)})}),dropBtn.addEventListener("click",function(e){e.preventDefault(),this.parentElement.classList.toggle("submenu-active")}),mainNav.querySelectorAll("a").forEach(e=>{e.classList.contains("drop-btn")||e.addEventListener("click",closeNav)});
    const cartModal=document.getElementById("cart-modal"),closeButton=document.querySelector(".close-button"),cartIcon=document.querySelector(".cart-icon");function openLoginModal(e){e.preventDefault(),registerModal.style.display="none",loginModal.style.display="block"}function openRegisterModal(e){e.preventDefault(),loginModal.style.display="none",registerModal.style.display="block"}desktopLoginBtn.addEventListener("click",openLoginModal),mobileLoginBtn.addEventListener("click",openLoginModal),showRegisterLink&&showRegisterLink.addEventListener("click",openRegisterModal),showLoginLink&&showLoginLink.addEventListener("click",openLoginModal),cartIcon.onclick=()=>cartModal.style.display="block",closeButton.onclick=()=>cartModal.style.display="none",closeRegisterButton.onclick=()=>registerModal.style.display="none",document.querySelector(".close-login-button").onclick=()=>loginModal.style.display="none",window.onclick=e=>{e.target==cartModal&&(cartModal.style.display="none"),e.target==loginModal&&(loginModal.style.display="none"),e.target==registerModal&&(registerModal.style.display="none")},checkLoginStatus(),filterByCategory("all");
});