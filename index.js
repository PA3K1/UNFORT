/* ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ========== */
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Элементы
const favoriteCount = document.querySelector('.header__favorite-count');
const favoriteOverlay = document.getElementById('favoriteOverlay');
const favoriteModal = document.getElementById('favoriteModal');
const favoriteClose = document.querySelector('.favorite-modal__close');
const favoriteItemsContainer = document.querySelector('.favorite-modal__items');
const categoryTabs = document.querySelectorAll('.category-tab');
const productsGrid = document.getElementById('products-grid');
const pagination = document.getElementById('pagination');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageButtons = document.querySelectorAll('.pagination__page');

// Объект для быстрого доступа к товарам по id
const productsMap = {};
products.forEach(p => { productsMap[p.id] = p; });

// Переменные для пагинации
const ITEMS_PER_PAGE = 36; // 9 рядов по 4 товара
let currentPage = 1;
let totalPages = Math.ceil(products.length / ITEMS_PER_PAGE); // для ALL

/* ========== ФУНКЦИИ РЕНДЕРА ========== */
function renderProducts(productsArray) {
    productsGrid.innerHTML = '';
    productsArray.forEach(product => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.dataset.productId = product.id;
        card.dataset.category = product.category;

        card.innerHTML = `
            <a href="#" class="product-card__link">
                <div class="product-card__image-wrapper">
                    <img src="${product.imgPrimary}" alt="${product.title}" class="product-card__image product-card__image--primary">
                    <img src="${product.imgSecondary}" alt="${product.title} hover" class="product-card__image product-card__image--secondary">
                    <button class="product-card__favorite" aria-label="Добавить в избранное">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                    </button>
                    ${product.badge ? `<span class="product-card__badge">${product.badge}</span>` : ''}
                </div>
                <h3 class="product-card__title">${product.title}</h3>
                <div class="product-card__prices">
                    <span class="product-card__price product-card__price--new">${product.priceNew}</span>
                    ${product.priceOld ? `<span class="product-card__price product-card__price--old">${product.priceOld}</span>` : ''}
                </div>
                <div class="product-card__installment">Долями по ${product.installment}</div>
            </a>
        `;

        if (favorites.includes(product.id)) {
            const favBtn = card.querySelector('.product-card__favorite');
            favBtn.classList.add('active');
        }

        productsGrid.appendChild(card);
    });

    initFavoriteButtons();
}

// Рендер для ALL с пагинацией
function renderAllPage(page) {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageProducts = products.slice(start, end);
    renderProducts(pageProducts);

    currentPage = page;
    updatePagination();
    pagination.classList.remove('hidden');

    // Прокрутка к началу списка товаров
    productsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Рендер для остальных категорий (без пагинации)
function renderCategory(category) {
    const filtered = products.filter(p => p.category === category);
    renderProducts(filtered);
    pagination.classList.add('hidden');
    productsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ========== ФИЛЬТРАЦИЯ ПО КАТЕГОРИЯМ ========== */
function filterProducts(category) {
    if (category === 'all') {
        renderAllPage(1); // всегда начинаем с первой страницы
    } else {
        renderCategory(category);
    }
}

// Обработчики вкладок
categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        categoryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const category = tab.dataset.category;
        filterProducts(category);
    });
});

// Инициализация: показываем ALL
filterProducts('all');

/* ========== ПАГИНАЦИЯ ========== */
function updatePagination() {
    // Обновляем активную страницу
    pageButtons.forEach(btn => {
        const page = parseInt(btn.dataset.page);
        if (page === currentPage) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Блокируем/разблокируем стрелки
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
}

// Обработчики кнопок страниц
pageButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const page = parseInt(btn.dataset.page);
        if (page !== currentPage) {
            renderAllPage(page);
        }
    });
});

// Обработчики стрелок
prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        renderAllPage(currentPage - 1);
    }
});

nextPageBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
        renderAllPage(currentPage + 1);
    }
});

/* ========== ИЗБРАННОЕ ========== */
function updateFavoriteCount() {
    favoriteCount.textContent = favorites.length;
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function toggleFavorite(productId, btn) {
    if (favorites.includes(productId)) {
        favorites = favorites.filter(id => id !== productId);
        btn.classList.remove('active');
    } else {
        favorites.push(productId);
        btn.classList.add('active');
    }
    updateFavoriteCount();
    animateHeart();
    if (favoriteModal.classList.contains('active')) {
        renderFavoritesModal();
    }
}

function initFavoriteButtons() {
    document.querySelectorAll('.product-card__favorite').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const card = btn.closest('.product-card');
            const productId = card.dataset.productId;
            if (!productId) return;
            toggleFavorite(productId, btn);
        });
    });
}

function animateHeart() {
    const heartIcon = document.querySelector('.header__icon--favorite');
    if (!heartIcon) return;
    heartIcon.classList.add('heart-pop');
    setTimeout(() => {
        heartIcon.classList.remove('heart-pop');
    }, 500);
}

/* ========== МОДАЛЬНОЕ ОКНО ИЗБРАННОГО ========== */
function renderFavoritesModal() {
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
            const cardBtn = document.querySelector(`.product-card[data-product-id="${productId}"] .product-card__favorite`);
            toggleFavorite(productId, cardBtn);
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

document.querySelector('.header__icon--favorite').addEventListener('click', (e) => {
    e.preventDefault();
    openFavorites();
});

favoriteClose.addEventListener('click', closeFavorites);

updateFavoriteCount();

/* ========== КОД ДЛЯ БУРГЕРА И МОДАЛОК (без изменений) ========== */
const burger = document.querySelector('.header__burger');
const menu = document.querySelector('.header__menu');
const closeBtn = document.querySelector('.header__menu-close');
const overlay = document.querySelector('.overlay');

function closeMenu() {
    menu.classList.remove('header__menu--open');
    overlay.classList.remove('active');
}

burger.addEventListener('click', () => {
    menu.classList.add('header__menu--open');
    overlay.classList.add('active');
});

closeBtn.addEventListener('click', closeMenu);

document.querySelectorAll('.header__menu-link').forEach(link => {
    link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('header__menu--open')) {
        closeMenu();
    }
});