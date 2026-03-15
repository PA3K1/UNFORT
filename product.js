/* ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ========== */
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Элементы
const favoriteCount = document.querySelector('.header__favorite-count');
const favoriteOverlay = document.getElementById('favoriteOverlay');
const favoriteModal = document.getElementById('favoriteModal');
const favoriteClose = document.querySelector('.favorite-modal__close');
const favoriteItemsContainer = document.querySelector('.favorite-modal__items');
const productContainer = document.querySelector('.product-page__container');
const fullscreenModal = document.getElementById('fullscreenModal');
const fullscreenImage = document.getElementById('fullscreenImage');
const fullscreenClose = document.querySelector('.fullscreen-modal__close');
const fullscreenPrev = document.querySelector('.fullscreen-modal__arrow--prev');
const fullscreenNext = document.querySelector('.fullscreen-modal__arrow--next');

// Объект для быстрого доступа к товарам по id
const productsMap = {};
products.forEach(p => { productsMap[p.id] = p; });

/* ========== ПОЛУЧЕНИЕ ID ТОВАРА ИЗ URL ========== */
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');
const product = productsMap[productId];

// Массив изображений для галереи (формируем минимум 9)
let productImages = [];
if (product) {
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        productImages = product.images;
    } else {
        // Если нет массива, создаём на основе двух изображений, повторяя до 9
        const baseImages = [product.imgPrimary, product.imgSecondary].filter(Boolean);
        for (let i = 0; i < 9; i++) {
            productImages.push(baseImages[i % baseImages.length]);
        }
    }
}

let currentImageIndex = 0;

/* ========== РЕНДЕР СТРАНИЦЫ ТОВАРА ========== */
function renderProductPage() {
    if (!product) {
        productContainer.innerHTML = '<p style="text-align: center; padding: 50px;">Товар не найден</p>';
        return;
    }

    const isFavorite = favorites.includes(product.id);
    
    // Формируем описание: если есть product.description, используем его, иначе заглушку
    const descriptionHTML = product.description 
        ? product.description.split('\n').map(p => `<p>${p}</p>`).join('')
        : `<p>Описание товара временно отсутствует.</p>`;

    productContainer.innerHTML = `
        <div class="product-detail">
            <div class="product-detail__gallery">
                <div class="product-detail__main-image-container">
                    <button class="product-detail__arrow product-detail__arrow--prev">&lt;</button>
                    <div class="product-detail__main-image">
                        <img src="${productImages[0]}" alt="${product.title}" id="mainProductImage">
                    </div>
                    <button class="product-detail__arrow product-detail__arrow--next">&gt;</button>
                </div>
                <div class="product-detail__thumbnails">
                    ${productImages.map((img, index) => `
                        <img src="${img}" alt="${product.title}" class="product-detail__thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">
                    `).join('')}
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
                    ${descriptionHTML}
                </div>
            </div>
        </div>

        <!-- АККОРДЕОН (отдельно, на всю ширину) -->
        <div class="product-detail__accordion">
            <div class="accordion-item">
                <button class="accordion-header" data-target="characteristics">
                    ХАРАКТЕРИСТИКИ
                    <span class="accordion-icon">+</span>
                </button>
                <div class="accordion-content" id="characteristics">
                    ${renderCharacteristics(product.characteristics)}
                </div>
            </div>
            <div class="accordion-item">
                <button class="accordion-header" data-target="sizes">
                    РАЗМЕРЫ
                    <span class="accordion-icon">+</span>
                </button>
                <div class="accordion-content" id="sizes">
                    <p>${product.sizeInfo || 'Парень - 182см, 70кг - на нем М размер'}</p>
                </div>
            </div>
            <div class="accordion-item">
                <button class="accordion-header" data-target="care">
                    УХОД
                    <span class="accordion-icon">+</span>
                </button>
                <div class="accordion-content" id="care">
                    ${product.care ? product.care.replace(/\n/g, '<br>') : '<p>Рекомендации по уходу отсутствуют</p>'}
                </div>
            </div>
        </div>

        <!-- СМОТРИТЕ ТАКЖЕ -->
        <div class="product-detail__related">
            <h2>СМОТРИТЕ ТАКЖЕ</h2>
            <div class="related-grid" id="relatedGrid"></div>
        </div>
    `;

    // Инициализация галереи
    initGallery();

    // Инициализация аккордеона
    initAccordion();

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

    // Загружаем "Смотрите также"
    renderRelatedProducts();
}

/* ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ========== */
function renderCharacteristics(charArray) {
    if (!charArray || charArray.length === 0) {
        return '<p>Характеристики не указаны</p>';
    }
    let html = '<ul>';
    charArray.forEach(item => {
        html += `<li>${item}</li>`;
    });
    html += '</ul>';
    return html;
}

function initAccordion() {
    const headers = document.querySelectorAll('.accordion-header');
    
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const targetId = header.dataset.target;
            const content = document.getElementById(targetId);
            const isActive = header.classList.contains('active');

            // Закрываем все
            document.querySelectorAll('.accordion-header').forEach(h => {
                h.classList.remove('active');
            });
            document.querySelectorAll('.accordion-content').forEach(c => {
                c.classList.remove('show');
            });

            // Если кликнутый не был активен, открываем его
            if (!isActive) {
                header.classList.add('active');
                content.classList.add('show');
            }
        });
    });
}

function renderRelatedProducts() {
    const relatedGrid = document.getElementById('relatedGrid');
    if (!relatedGrid) return;

    // Получаем все товары, кроме текущего
    const otherProducts = products.filter(p => p.id !== product.id);
    
    // Перемешиваем и берём первые 4
    const shuffled = otherProducts.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);

    relatedGrid.innerHTML = selected.map(p => {
        const isFav = favorites.includes(p.id);
        return `
            <article class="product-card" data-product-id="${p.id}">
                <a href="product.html?id=${p.id}" class="product-card__link">
                    <div class="product-card__image-wrapper">
                        <img src="${p.imgPrimary}" alt="${p.title}" class="product-card__image product-card__image--primary">
                        <img src="${p.imgSecondary}" alt="${p.title} hover" class="product-card__image product-card__image--secondary">
                        <button class="product-card__favorite" aria-label="Добавить в избранное">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                        </button>
                        ${p.badge ? `<span class="product-card__badge">${p.badge}</span>` : ''}
                    </div>
                    <h3 class="product-card__title">${p.title}</h3>
                    <div class="product-card__prices">
                        <span class="product-card__price product-card__price--new">${p.priceNew}</span>
                        ${p.priceOld ? `<span class="product-card__price product-card__price--old">${p.priceOld}</span>` : ''}
                    </div>
                    <div class="product-card__installment">Долями по ${p.installment}</div>
                </a>
            </article>
        `;
    }).join('');

    // Инициализируем кнопки избранного для новых карточек
    document.querySelectorAll('#relatedGrid .product-card__favorite').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const card = btn.closest('.product-card');
            const relatedProductId = card.dataset.productId;
            if (!relatedProductId) return;
            toggleFavorite(relatedProductId, btn);
        });
    });
}

/* ========== ГАЛЕРЕЯ (без изменений) ========== */
function initGallery() {
    const mainImage = document.getElementById('mainProductImage');
    const prevBtn = document.querySelector('.product-detail__arrow--prev');
    const nextBtn = document.querySelector('.product-detail__arrow--next');
    const thumbnails = document.querySelectorAll('.product-detail__thumbnail');

    function setMainImage(index) {
        if (index < 0) index = productImages.length - 1;
        if (index >= productImages.length) index = 0;
        mainImage.src = productImages[index];
        currentImageIndex = index;
        thumbnails.forEach((thumb, i) => {
            if (i === index) thumb.classList.add('active');
            else thumb.classList.remove('active');
        });
    }

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setMainImage(currentImageIndex - 1);
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setMainImage(currentImageIndex + 1);
    });

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            const index = parseInt(thumb.dataset.index);
            setMainImage(index);
        });
    });

    mainImage.addEventListener('click', () => {
        openFullscreen(currentImageIndex);
    });
}

/* ========== ПОЛНОЭКРАННЫЙ РЕЖИМ (без изменений) ========== */
function openFullscreen(startIndex) {
    currentImageIndex = startIndex;
    fullscreenImage.src = productImages[currentImageIndex];
    fullscreenModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeFullscreen() {
    fullscreenModal.classList.remove('active');
    document.body.style.overflow = '';
}

function changeFullscreenImage(delta) {
    let newIndex = currentImageIndex + delta;
    if (newIndex < 0) newIndex = productImages.length - 1;
    if (newIndex >= productImages.length) newIndex = 0;
    currentImageIndex = newIndex;
    fullscreenImage.src = productImages[currentImageIndex];
}

if (fullscreenClose) {
    fullscreenClose.addEventListener('click', closeFullscreen);
}
if (fullscreenPrev) {
    fullscreenPrev.addEventListener('click', () => changeFullscreenImage(-1));
}
if (fullscreenNext) {
    fullscreenNext.addEventListener('click', () => changeFullscreenImage(1));
}
fullscreenModal.addEventListener('click', (e) => {
    if (e.target === fullscreenModal) closeFullscreen();
});
document.addEventListener('keydown', (e) => {
    if (!fullscreenModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeFullscreen();
    else if (e.key === 'ArrowLeft') changeFullscreenImage(-1);
    else if (e.key === 'ArrowRight') changeFullscreenImage(1);
});

/* ========== ИЗБРАННОЕ ========== */
function updateFavoriteCount() {
    if (favoriteCount) favoriteCount.textContent = favorites.length;
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
    setTimeout(() => heartIcon.classList.remove('heart-pop'), 500);
}

function showToast(message) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
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
            const productFavBtn = document.querySelector(`.product-detail__favorite-btn[data-product-id="${productId}"]`);
            if (productFavBtn && !favorites.includes(productId)) {
                productFavBtn.classList.remove('active');
                const svg = productFavBtn.querySelector('svg');
                if (svg) svg.setAttribute('fill', 'none');
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

const favoriteIcon = document.querySelector('.header__icon--favorite');
if (favoriteIcon) favoriteIcon.addEventListener('click', (e) => { e.preventDefault(); openFavorites(); });
if (favoriteClose) favoriteClose.addEventListener('click', closeFavorites);
if (favoriteOverlay) favoriteOverlay.addEventListener('click', closeFavorites);
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

if (burger) burger.addEventListener('click', () => { menu.classList.add('header__menu--open'); overlay.classList.add('active'); });
if (closeBtn) closeBtn.addEventListener('click', closeMenu);
document.querySelectorAll('.header__menu-link').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('header__menu--open')) closeMenu();
    if (e.key === 'Escape' && favoriteModal && favoriteModal.classList.contains('active')) closeFavorites();
});

/* ========== ЗАПУСК ========== */
renderProductPage();