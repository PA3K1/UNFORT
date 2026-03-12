/* ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ========== */
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Элементы
const favoriteCount = document.querySelector('.header__favorite-count');
const favoriteOverlay = document.getElementById('favoriteOverlay');
const favoriteModal = document.getElementById('favoriteModal');
const favoriteClose = document.querySelector('.favorite-modal__close');
const favoriteItemsContainer = document.querySelector('.favorite-modal__items');
const productContainer = document.querySelector('.product-page__container');

// Объект для быстрого доступа к товарам по id
const productsMap = {};
products.forEach(p => { productsMap[p.id] = p; });

/* ========== ПОЛУЧЕНИЕ ID ТОВАРА ИЗ URL ========== */
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');
const product = productsMap[productId];

/* ========== РЕНДЕР СТРАНИЦЫ ТОВАРА ========== */
function renderProductPage() {
    if (!product) {
        productContainer.innerHTML = '<p style="text-align: center; padding: 50px;">Товар не найден</p>';
        return;
    }

    const isFavorite = favorites.includes(product.id);
    
    productContainer.innerHTML = `
        <div class="product-detail">
            <div class="product-detail__gallery">
                <div class="product-detail__main-image">
                    <img src="${product.imgPrimary}" alt="${product.title}" id="mainProductImage">
                </div>
                <div class="product-detail__thumbnails">
                    <img src="${product.imgPrimary}" alt="${product.title}" class="product-detail__thumbnail active" onclick="document.getElementById('mainProductImage').src='${product.imgPrimary}'">
                    <img src="${product.imgSecondary}" alt="${product.title}" class="product-detail__thumbnail" onclick="document.getElementById('mainProductImage').src='${product.imgSecondary}'">
                </div>
            </div>
            
            <div class="product-detail__info">
                <h1 class="product-detail__title">${product.title}</h1>
                
                <div class="product-detail__prices">
                    <span class="product-detail__price product-detail__price--new">${product.priceNew}</span>
                    ${product.priceOld ? `<span class="product-detail__price product-detail__price--old">${product.priceOld}</span>` : ''}
                </div>
                
                <div class="product-detail__installment">4 платежа по ${product.installment}</div>
                
                <div class="product-detail__sizes">
                    <h3>Размеры:</h3>
                    <div class="product-detail__size-buttons">
                        <button class="product-detail__size-btn">XS</button>
                        <button class="product-detail__size-btn">S</button>
                        <button class="product-detail__size-btn">M</button>
                        <button class="product-detail__size-btn">L</button>
                        <button class="product-detail__size-btn">XL</button>
                    </div>
                </div>
                
                <div class="product-detail__actions">
                    <button class="product-detail__favorite-btn ${isFavorite ? 'active' : ''}" data-product-id="${product.id}">
                        <svg width="25" height="22" viewBox="0 0 24 24" fill="${isFavorite ? '#ff4d4f' : 'none'}" stroke="currentColor" stroke-width="2">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                    </button>
                    
                    <a href="#" class="product-detail__cart-btn">Добавить в корзину</a>
                </div>
                
                <div class="product-detail__description">
                    <p>“Ex Sample Classic” Zip-Hoodie Black — Обновленная, базовая зип-худи с минималистичным дизайном, безупречным силуэтом, в новых, уникальных цветах. Полностью новые, доработанные лекала - изменили посадку, сделали акцент на качестве, улучшили материалы и детали! Легко комбинируется с любыми вещами и подходит для всех.</p>
                    <p>Ручная работа, ограниченный тираж!</p>
                    <p>Самовыражайся в одежде Unfort!</p>
                </div>
            </div>
        </div>
    `;

    // Инициализация кнопки избранного
    const favBtn = document.querySelector('.product-detail__favorite-btn');
    if (favBtn) {
        favBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleFavorite(product.id, favBtn);
        });
    }

    // Инициализация кнопок размеров
    document.querySelectorAll('.product-detail__size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.product-detail__size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

/* ========== ИЗБРАННОЕ ========== */
function updateFavoriteCount() {
    if (favoriteCount) {
        favoriteCount.textContent = favorites.length;
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function toggleFavorite(productId, btn) {
    const wasFavorite = favorites.includes(productId);

    if (wasFavorite) {
        favorites = favorites.filter(id => id !== productId);
        if (btn) {
            btn.classList.remove('active');
            const svg = btn.querySelector('svg');
            if (svg) svg.setAttribute('fill', 'none');
        }
    } else {
        favorites.push(productId);
        if (btn) {
            btn.classList.add('active');
            const svg = btn.querySelector('svg');
            if (svg) svg.setAttribute('fill', '#ff4d4f');
        }
        showToast(`${product.title} добавлено в избранное`);
    }
    updateFavoriteCount();
    animateHeart();
    if (favoriteModal && favoriteModal.classList.contains('active')) {
        renderFavoritesModal();
    }
}

function animateHeart() {
    const heartIcon = document.querySelector('.header__icon--favorite');
    if (!heartIcon) return;
    heartIcon.classList.add('heart-pop');
    setTimeout(() => {
        heartIcon.classList.remove('heart-pop');
    }, 500);
}

/* ========== ТОСТ-УВЕДОМЛЕНИЕ ========== */
function showToast(message) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

/* ========== МОДАЛЬНОЕ ОКНО ИЗБРАННОГО ========== */
function renderFavoritesModal() {
    if (!favoriteItemsContainer) return;
    
    favoriteItemsContainer.innerHTML = '';
    if (favorites.length === 0) {
        favoriteItemsContainer.innerHTML = '<p>В избранном пока нет товаров</p>';
        return;
    }
    
    favorites.forEach(id => {
        const item = productsMap[id];
        if (!item) return;
        const itemEl = document.createElement('div');
        itemEl.className = 'favorite-item';
        itemEl.innerHTML = `
            <img src="${item.imgPrimary}" alt="${item.title}" class="favorite-item__image">
            <div class="favorite-item__info">
                <h4 class="favorite-item__title">${item.title}</h4>
                <span class="favorite-item__size">One size</span>
                <span class="favorite-item__price">${item.priceNew}</span>
            </div>
            <button class="favorite-item__remove" data-product-id="${id}">&times;</button>
        `;
        favoriteItemsContainer.appendChild(itemEl);
    });

    document.querySelectorAll('.favorite-item__remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = btn.dataset.productId;
            toggleFavorite(productId);
            
            // Обновляем кнопку на странице товара, если она есть
            const productFavBtn = document.querySelector(`.product-detail__favorite-btn[data-product-id="${productId}"]`);
            if (productFavBtn) {
                if (!favorites.includes(productId)) {
                    productFavBtn.classList.remove('active');
                    const svg = productFavBtn.querySelector('svg');
                    if (svg) svg.setAttribute('fill', 'none');
                }
            }
        });
    });
}

function openFavorites() {
    renderFavoritesModal();
    favoriteOverlay.classList.add('active');
    favoriteModal.classList.add('active');
    const sticked = document.querySelector('.sticked-low');
    if (sticked) sticked.style.display = 'none';
}

function closeFavorites() {
    favoriteOverlay.classList.remove('active');
    favoriteModal.classList.remove('active');
    const sticked = document.querySelector('.sticked-low');
    if (sticked) sticked.style.display = '';
}

// Обработчики для избранного
const favoriteIcon = document.querySelector('.header__icon--favorite');
if (favoriteIcon) {
    favoriteIcon.addEventListener('click', (e) => {
        e.preventDefault();
        openFavorites();
    });
}

if (favoriteClose) {
    favoriteClose.addEventListener('click', closeFavorites);
}

// Закрытие по клику на оверлей
if (favoriteOverlay) {
    favoriteOverlay.addEventListener('click', closeFavorites);
}

updateFavoriteCount();

/* ========== КОД ДЛЯ БУРГЕРА ========== */
const burger = document.querySelector('.header__burger');
const menu = document.querySelector('.header__menu');
const closeBtn = document.querySelector('.header__menu-close');
const overlay = document.querySelector('.overlay');

function closeMenu() {
    menu.classList.remove('header__menu--open');
    overlay.classList.remove('active');
}

if (burger) {
    burger.addEventListener('click', () => {
        menu.classList.add('header__menu--open');
        overlay.classList.add('active');
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
}

document.querySelectorAll('.header__menu-link').forEach(link => {
    link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('header__menu--open')) {
        closeMenu();
    }
    if (e.key === 'Escape' && favoriteModal && favoriteModal.classList.contains('active')) {
        closeFavorites();
    }
});

/* ========== ЗАПУСК ========== */
renderProductPage();