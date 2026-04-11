// collections.js
document.addEventListener('componentsLoaded', function() {
    initCollections();
});

if (document.querySelector('.header')) {
    initCollections();
}

function initCollections() {
    const buttons = document.querySelectorAll('.collections-nav__btn');
    const grid = document.getElementById('collections-grid');
    
    if (buttons.length === 0) {
        setTimeout(initCollections, 500);
        return;
    }
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            buttons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const collection = this.dataset.collection;
            grid.innerHTML = `<div class="collections-empty">Коллекция "${collection}" - здесь будут товары</div>`;
        });
    });
    
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }
}