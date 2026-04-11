// delivery.js — аккордеон
function initDeliveryAccordion() {
    const items = document.querySelectorAll('.accordion-item');
    
    if (items.length === 0) {
        setTimeout(initDeliveryAccordion, 500);
        return;
    }
    
    items.forEach((item) => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        
        if (!header || !content) return;
        
        header.removeEventListener('click', header.clickHandler);
        
        const clickHandler = (e) => {
            e.preventDefault();
            
            items.forEach((other) => {
                if (other !== item && other.classList.contains('active')) {
                    other.classList.remove('active');
                    const otherContent = other.querySelector('.accordion-content');
                    if (otherContent) {
                        otherContent.classList.remove('show');
                        otherContent.style.maxHeight = null;
                    }
                }
            });
            
            if (item.classList.contains('active')) {
                item.classList.remove('active');
                content.classList.remove('show');
                content.style.maxHeight = null;
            } else {
                item.classList.add('active');
                content.classList.add('show');
                setTimeout(() => {
                    const height = content.scrollHeight;
                    content.style.maxHeight = height + 'px';
                }, 10);
            }
        };
        
        header.clickHandler = clickHandler;
        header.addEventListener('click', clickHandler);
    });
}

document.addEventListener('DOMContentLoaded', initDeliveryAccordion);
document.addEventListener('componentsLoaded', initDeliveryAccordion);
if (document.querySelector('.product-detail__accordion')) {
    initDeliveryAccordion();
}