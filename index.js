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

// ❌ Клик по оверлею больше не закрывает меню (убрали обработчик)