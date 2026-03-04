
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