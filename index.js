
/*js для header и модалки */
const burger = document.querySelector('.header__burger');
const menu = document.querySelector('.header__menu');
const closeBtn = document.querySelector('.header__menu-close');
const overlay = document.querySelector('.overlay');

function closeMenu() {
    menu.classList.remove('header__menu--open');
    overlay.classList.remove('active');
}

// Открытие меню
burger.addEventListener('click', () => {
    menu.classList.add('header__menu--open');
    overlay.classList.add('active');
});

// Закрытие по крестику
closeBtn.addEventListener('click', closeMenu);

// Закрытие при клике на ссылки внутри меню
document.querySelectorAll('.header__menu-link').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Закрытие по Esc
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('header__menu--open')) {
        closeMenu();
    }
});
/*----------------------КОНЕЦ----------------*/

/*JS ДЛЯ ОСНОВНОЙ СЕКЦИИ С КАРТОЧКАМИ*/
// Переключение категорий и фильтрация товаров
const categoryTabs = document.querySelectorAll('.category-tab');
const productCards = document.querySelectorAll('.product-card'); // все карточки

// Функция фильтрации
function filterProducts(category) {
    productCards.forEach(card => {
        const cardCategory = card.dataset.category;
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block'; // или flex, если нужно
        } else {
            card.style.display = 'none';
        }
    });
}

// Обработчик клика на вкладки
categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Убираем класс active у всех вкладок
        categoryTabs.forEach(t => t.classList.remove('active'));
        // Добавляем класс active текущей вкладке
        tab.classList.add('active');

        // Получаем выбранную категорию
        const category = tab.dataset.category;
        // Фильтруем товары
        filterProducts(category);
    });
});

// Инициализация: показываем все товары (категория 'all')
filterProducts('all');






/*js для картчек добавлениее в избранное */
let favorites = [];

const favoriteCount = document.querySelector('.header__favorite-count');


function updateFavoriteCount() {
    favoriteCount.textContent = favorites.length;
}

// Обработчик клика на сердечки
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

// Инициализация счетчика (может быть 0)
updateFavoriteCount();



// ---------- JS ДЛЯ РАБОТЫ ИЗБРОННОГО  ----------
const productsData = {};
document.querySelectorAll('.product-card').forEach(card => {
    const id = card.dataset.productId;
    if (id) {
        const title = card.querySelector('.product-card__title').textContent;
        const priceNew = card.querySelector('.product-card__price--new').textContent;
        const imgSrc = card.querySelector('.product-card__image--primary').src;
        productsData[id] = {
            title,
            price: priceNew,
            img: imgSrc,
        };
    }
});

// ---------- ОБЩАЯ ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ ИЗБРАННОГО ----------
function toggleFavorite(productId, btn) {
    if (favorites.includes(productId)) {
        favorites = favorites.filter(id => id !== productId);
        if (btn) btn.classList.remove('active');
    } else {
        favorites.push(productId);
        if (btn) btn.classList.add('active');
    }
    updateFavoriteCount();
    animateHeart();
    // Если модалка открыта – обновляем её содержимое
    if (favoriteModal.classList.contains('active')) {
        renderFavoritesModal();
    }
}

// ---------- МОДАЛЬНОЕ ОКНО ----------
const favoriteOverlay = document.getElementById('favoriteOverlay');
const favoriteModal = document.getElementById('favoriteModal');
const favoriteClose = document.querySelector('.favorite-modal__close');
const favoriteItemsContainer = document.querySelector('.favorite-modal__items');

function openFavorites() {
    renderFavoritesModal();
    favoriteOverlay.classList.add('active');
    favoriteModal.classList.add('active');
    // Скрываем стики-кнопку
    const sticked = document.querySelector('.sticked-low');
    if (sticked) sticked.style.display = 'none';
}

function closeFavorites() {
    favoriteOverlay.classList.remove('active');
    favoriteModal.classList.remove('active');
    // Показываем стики-кнопку обратно
    const sticked = document.querySelector('.sticked-low');
    if (sticked) sticked.style.display = '';
}

function animateHeart() {
    const heartIcon = document.querySelector('.header__icon--favorite');
    if (!heartIcon) return;
    heartIcon.classList.add('heart-pop');
    setTimeout(() => {
        heartIcon.classList.remove('heart-pop');
    }, 500); // длительность анимации 0.5 с
}

function renderFavoritesModal() {
    favoriteItemsContainer.innerHTML = '';
    if (favorites.length === 0) {
        favoriteItemsContainer.innerHTML = '<p>В избранном пока нет товаров</p>';
        return;
    }
    favorites.forEach(id => {
        const item = productsData[id];
        if (!item) return;
        const itemEl = document.createElement('div');
        itemEl.className = 'favorite-item';
        itemEl.innerHTML = `
            <img src="${item.img}" alt="${item.title}" class="favorite-item__image">
            <div class="favorite-item__info">
                <h4 class="favorite-item__title">${item.title}</h4>
                <span class="favorite-item__size">One size</span> <!-- заглушка, можно заменить -->
                <span class="favorite-item__price">${item.price}</span>
            </div>
            <button class="favorite-item__remove" data-product-id="${id}">&times;</button>
        `;
        favoriteItemsContainer.appendChild(itemEl);
    });

    // Обработчики удаления внутри модалки
    document.querySelectorAll('.favorite-item__remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = btn.dataset.productId;
            const cardBtn = document.querySelector(`.product-card[data-product-id="${productId}"] .product-card__favorite`);
            toggleFavorite(productId, cardBtn);
        });
    });
}

// ---------- ОТКРЫТИЕ ПО КЛИКУ НА СЕРДЦЕ В ШАПКЕ ----------
document.querySelector('.header__icon--favorite').addEventListener('click', (e) => {
    e.preventDefault();
    openFavorites();
});

// ---------- ЗАКРЫТИЕ ПО КРЕСТИКУ ----------
favoriteClose.addEventListener('click', closeFavorites);