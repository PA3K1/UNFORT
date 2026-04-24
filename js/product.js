// product.js — логика страницы товара

let mapInitialized = false;
let currentMap = null;
let currentPlacemark = null;

/* ========== ПЕРЕМЕННЫЕ ========== */
let productContainer;
let fullscreenModal, fullscreenImage, fullscreenClose, fullscreenPrev, fullscreenNext;
let cartModal, cartOverlay, cartClose, cartContent;

let currentZoomGlobal = 1;
let translateXGlobal = 0, translateYGlobal = 0;

const productsMap = {};
if (typeof products !== 'undefined') {
    products.forEach(p => { productsMap[p.id] = p; });
}

/* ========== ПОЛУЧЕНИЕ ID ТОВАРА ИЗ URL ========== */
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');
const product = productsMap[productId];

let productImages = [];
if (product) {
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        productImages = product.images;
    } else {
        const baseImages = [product.imgPrimary, product.imgSecondary].filter(Boolean);
        for (let i = 0; i < 9; i++) {
            productImages.push(baseImages[i % baseImages.length]);
        }
    }
}

let currentImageIndex = 0;

const formState = {
    city: { value: '', valid: false },
    pickup: { value: '', valid: false },
    fullName: { value: '', valid: false },
    phone: { value: '', valid: false },
    email: { value: '', valid: false },
    postalCode: { value: '', valid: false },
    address: { value: '', valid: false }
};

/* ========== ФУНКЦИИ ВАЛИДАЦИИ ========== */
function validateFullName(name) {
    if (!name.trim()) return false;
    const regex = /^[А-ЯЁ][а-яё]+ [А-ЯЁ][а-яё]+( [А-ЯЁ][а-яё]+)?$/;
    return regex.test(name.trim());
}

function validatePhone(phone) {
    if (!phone || phone.trim() === '') return false;
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 11 && (digits[0] === '7' || digits[0] === '8')) {
        return true;
    }
    if (digits.length === 10 && digits[0] === '9') {
        return true;
    }
    return false;
}

function validateEmail(email) {
    if (!email.trim()) return false;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validatePostalCode(code) {
    if (!code.trim()) return false;
    const digits = code.replace(/\D/g, '');
    return digits.length === 6;
}

function validateAddress(address) {
    return address.trim().length > 5;
}

function validateCity(city) {
    return city.trim().length > 2;
}

function validateAllFields() {
    const pickupContainer = document.getElementById('pickupPointContainer');
    const pickupValid = (pickupContainer && pickupContainer.style.display !== 'none') ? formState.pickup.valid : true;
    return formState.city.valid &&
        formState.fullName.valid &&
        formState.phone.valid &&
        formState.email.valid &&
        formState.postalCode.valid &&
        formState.address.valid &&
        pickupValid;
}

function showFieldError(fieldId, isValid) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(fieldId + 'Error');
    if (!field || !errorDiv) return;
    if (!isValid) {
        field.classList.add('error');
        field.classList.remove('valid');
        errorDiv.classList.add('show');
    } else {
        field.classList.remove('error');
        field.classList.add('valid');
        errorDiv.classList.remove('show');
        if (validateAllFields()) {
            const errorMsg = document.querySelector('.cart-error-message');
            if (errorMsg) errorMsg.classList.remove('show');
        }
    }
}

function validateForm() {
    let isValid = true;
    const cityValid = formState.city.valid;
    showFieldError('cityInput', cityValid);
    if (!cityValid) isValid = false;

    const pickupContainer = document.getElementById('pickupPointContainer');
    if (pickupContainer && pickupContainer.style.display !== 'none') {
        const pickupValid = formState.pickup.valid;
        showFieldError('pickupPoint', pickupValid);
        if (!pickupValid) isValid = false;
    }

    const nameValid = formState.fullName.valid;
    showFieldError('fullName', nameValid);
    if (!nameValid) isValid = false;

    const phoneValid = formState.phone.valid;
    showFieldError('phone', phoneValid);
    if (!phoneValid) isValid = false;

    const emailValid = formState.email.valid;
    showFieldError('email', emailValid);
    if (!emailValid) isValid = false;

    const postalValid = formState.postalCode.valid;
    showFieldError('postalCode', postalValid);
    if (!postalValid) isValid = false;

    const addressValid = formState.address.valid;
    showFieldError('address', addressValid);
    if (!addressValid) isValid = false;

    return isValid;
}

function showSuccessScreen() {
    const totalElement = document.getElementById('cartTotal');
    let totalAmount = 100;
    
    if (totalElement) {
        let totalText = totalElement.textContent
        totalAmount = totalText
            .replace('Итоговая сумма:', '')
            .replace('₽', '')
            .replace(/\s/g, '')
            .trim();
        
        if (isNaN(parseFloat(totalAmount))) {
            totalAmount = 100;
        }
    }

    const email = document.getElementById('email')?.value || '';
    let phone = document.getElementById('phone')?.value || '';
    const fullName = document.getElementById('fullName')?.value || 'Клиент UNFORT';
    
    let normalizedPhone = '';
    if (phone) {
        let digits = phone.replace(/\D/g, '');
        if (digits.length === 11 && (digits[0] === '7' || digits[0] === '8')) {
            if (digits[0] === '8') {
                digits = '7' + digits.substring(1);
            }
            normalizedPhone = '+' + digits;
        } else if (digits.length === 10 && digits[0] === '9') {
            normalizedPhone = '+7' + digits;
        }
    }

    const productTitle = product?.title || 'Товар UNFORT';
    const selectedSize = document.querySelector('.product-detail__size-btn.active')?.textContent || 'M';
    const quantity = document.getElementById('cartQuantity')?.textContent || '1';
    
    const orderDescription = `UNFORT: ${productTitle} (${selectedSize}) x${quantity} | Сумма: ${totalAmount} ₽`;
    
    const cartContentElement = document.getElementById('cartContent');
    if (cartContentElement) {
        cartContentElement.innerHTML = `
            <div class="cart-success">
                <div class="cart-success__free-shipping">
                    Бесплатная доставка от 14 990 руб.
                </div>
                <div class="cart-success__message">
                    🔄 Перенаправление на страницу оплаты...<br>
                    Сумма к оплате: ${totalAmount} ₽<br>
                    Пожалуйста, подождите.
                </div>
            </div>
        `;
    }

    const submitBtn = document.querySelector('.cart-submit');
    if (submitBtn) {
        submitBtn.classList.add('processing');
        submitBtn.disabled = true;
    }

    if (window.UnfortPayment) {
        window.UnfortPayment.createPayment(
            totalAmount,
            orderDescription,
            email,
            normalizedPhone
        );
    } else {
        console.error('Payment module not loaded - проверьте подключение payment.js');
        if (cartContentElement) {
            cartContentElement.innerHTML = `
                <div class="cart-success">
                    <div class="cart-success__message" style="background: #ff4444;">
                        ❌ Ошибка: платежный модуль не загружен<br>
                        Пожалуйста, обновите страницу и попробуйте снова.
                    </div>
                </div>
            `;
        }
        if (submitBtn) {
            submitBtn.classList.remove('processing');
            submitBtn.disabled = false;
        }
    }
}

/* ========== РЕНДЕР СТРАНИЦЫ ТОВАРА ========== */
function renderProductPage() {
    if (!product) {
        productContainer.innerHTML = '<p style="text-align: center; padding: 50px;">Товар не найден</p>';
        return;
    }

    const isFavorite = favorites.includes(product.id);
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

        <div class="product-detail__related">
            <h2>СМОТРИТЕ ТАКЖЕ</h2>
            <div class="related-grid" id="relatedGrid"></div>
        </div>
    `;

    initGallery();
    initAccordion();

    const favBtn = document.querySelector('.product-detail__favorite-btn');
    if (favBtn) {
        favBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleFavorite(product.id, favBtn);
        });
    }

    const cartBtn = document.querySelector('.product-detail__cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openCartModal();
        });
    }

    document.querySelectorAll('.product-detail__size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.product-detail__size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    renderRelatedProducts();
}

/* ========== ФУНКЦИИ КОРЗИНЫ ========== */
function openCartModal() {
    renderCartContent();
    cartModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartModal() {
    cartModal.classList.remove('active');
    document.body.style.overflow = '';
}

function renderCartContent() {
    if (!cartContent) return;

    const activeSizeBtn = document.querySelector('.product-detail__size-btn.active');
    const selectedSize = activeSizeBtn ? activeSizeBtn.textContent : 'M';

    const priceStr = product.priceNew.replace(/[^\d]/g, '');
    const priceNum = parseInt(priceStr, 10);
    let quantity = 1;
    const totalPrice = priceNum * quantity;

    cartContent.innerHTML = `
        <div class="cart-section">
            <div class="cart-item">
                <img src="${product.imgPrimary}" alt="${product.title}" class="cart-item__image">
                <div class="cart-item__info">
                    <h4 class="cart-item__title">${product.title}</h4>
                    <div class="cart-item__size">Размер: ${selectedSize}</div>
                    <div class="cart-item__quantity">
                        <button class="cart-item__quantity-btn" data-action="decr">-</button>
                        <span class="cart-item__quantity-value" id="cartQuantity">${quantity}</span>
                        <button class="cart-item__quantity-btn" data-action="incr">+</button>
                    </div>
                </div>
                <div class="cart-item__price" id="cartItemPrice">${product.priceNew}</div>
            </div>
        </div>

        <div class="cart-section">
            <h3>Доставка</h3>
            
            <div class="cart-field">
                <label>Город <span class="required">*</span></label>
                <input type="text" class="city-input" id="cityInput" placeholder="Введите город" autocomplete="off">
                <div class="field-error" id="cityError">Обязательное поле</div>
            </div>
            
            <div class="cart-delivery-options" id="deliveryOptions" style="display: none;">
                <label class="cart-delivery-option">
                    <input type="radio" name="delivery" value="cdek" disabled>
                    <div class="cart-delivery-option__info">
                        <div class="cart-delivery-option__title">СДЭК</div>
                        <div class="cart-delivery-option__details">от 7 дней</div>
                    </div>
                    <div class="cart-delivery-option__price">от 385 ₽</div>
                </label>
                <label class="cart-delivery-option">
                    <input type="radio" name="delivery" value="pochta" disabled>
                    <div class="cart-delivery-option__info">
                        <div class="cart-delivery-option__title">Почта России</div>
                        <div class="cart-delivery-option__details">от 7 дней</div>
                    </div>
                    <div class="cart-delivery-option__price">550 ₽</div>
                </label>
            </div>
            
            <div class="cart-pickup-point" id="pickupPointContainer" style="display: none;">
                <label>Пункт получения <span class="required">*</span></label>
                <select id="pickupPoint" class="pickup-select">
                    <option value="">Выберите пункт получения</option>
                </select>
                <div class="field-error" id="pickupError">Пожалуйста, выберите адрес из предложенных вариантов</div>
                <div id="cartMap" style="width: 100%; height: 200px; margin-top: 10px;"></div>
                <div class="map-footer">© Яндекс Условия использования</div>
            </div>
        </div>

        <div class="cart-section">
            <h3>Личные данные</h3>
            
            <div class="cart-field">
                <label>ФИО <span class="required">*</span></label>
                <input type="text" id="fullName" placeholder="Иванов Иван Иванович" class="required-field">
                <div class="field-error" id="fullNameError">Обязательное поле</div>
            </div>
            
            <div class="cart-field">
                <label>Номер телефона <span class="required">*</span></label>
                <input type="tel" id="phone" placeholder="+7 (000) 000-00-00" class="required-field phone-mask">
                <div class="field-error" id="phoneError">Обязательное поле</div>
            </div>
            
            <div class="cart-field">
                <label>Почта <span class="required">*</span></label>
                <input type="email" id="email" placeholder="Email" class="required-field">
                <div class="field-error" id="emailError">Обязательное поле</div>
            </div>
            
            <div class="cart-field">
                <label>Индекс <span class="required">*</span></label>
                <input type="text" id="postalCode" placeholder="Почтовый индекс" class="required-field postal-mask">
                <div class="field-error" id="postalCodeError">Обязательное поле</div>
            </div>
            
            <div class="cart-field">
                <label>Адрес <span class="required">*</span></label>
                <input type="text" id="address" placeholder="Адрес проживания" class="required-field">
                <div class="field-error" id="addressError">Обязательное поле</div>
            </div>
            
            <div class="cart-field">
                <label>Соц. сети для связи</label>
                <input type="text" placeholder="Вставьте ссылку">
            </div>
            
            <div class="cart-field">
                <label>Промокод</label>
                <input type="text" placeholder="Введите промокод">
            </div>
            
            <div class="cart-field">
                <label>Откуда о нас узнали?</label>
                <input type="text" placeholder="Соц. сети, реклама, от друзей и т.д.">
            </div>
        </div>

        <div class="cart-section">
            <h3>Способ оплаты</h3>
            <div class="cart-payment-options">
                <label class="cart-payment-option">
                    <input type="radio" name="payment" value="card" checked>
                    Банковской картой (Visa, Mastercard, МИР) через Тинькофф
                </label>
                <label class="cart-payment-option">
                    <input type="radio" name="payment" value="split">
                    Долями от Тинькофф (4 платежа без переплат)
                </label>
                <label class="cart-payment-option">
                    <input type="radio" name="payment" value="sbp">
                    СБП (Система быстрых платежей)
                </label>
            </div>
        </div>

        <div class="cart-total" id="cartTotal">Итоговая сумма: ${formatPrice(totalPrice)}</div>

        <button class="cart-submit">Оформить заказ</button>
    `;

    const quantitySpan = document.getElementById('cartQuantity');
    const itemPriceSpan = document.getElementById('cartItemPrice');
    const totalSpan = document.getElementById('cartTotal');

    let currentQuantity = quantity;
    let currentPrice = priceNum;

    function updateQuantity(delta) {
        const newQ = currentQuantity + delta;
        if (newQ < 1) return;
        currentQuantity = newQ;
        quantitySpan.textContent = currentQuantity;
        itemPriceSpan.textContent = formatPrice(currentPrice * currentQuantity);
        totalSpan.textContent = `Итоговая сумма: ${formatPrice(currentPrice * currentQuantity)}`;
    }

    document.querySelectorAll('.cart-item__quantity-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = btn.dataset.action;
            if (action === 'incr') updateQuantity(1);
            else if (action === 'decr') updateQuantity(-1);
        });
    });

    if (typeof $.fn.mask !== 'undefined') {
        $('#phone').mask('+7 (999) 999-99-99');
        $('#phone').on('blur', function() {
            let val = $(this).val();
            let digits = val.replace(/\D/g, '');
            
            if (digits.length === 11 && (digits[0] === '7' || digits[0] === '8')) {
                formState.phone.valid = true;
                showFieldError('phone', true);
                $(this).css('border-color', '#00aa00');
            } else if (digits.length === 10 && digits[0] === '9') {
                let corrected = '7' + digits;
                let formatted = corrected.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4-$5');
                $(this).val(formatted);
                formState.phone.valid = true;
                showFieldError('phone', true);
                $(this).css('border-color', '#00aa00');
            } else if (digits.length > 0) {
                formState.phone.valid = false;
                showFieldError('phone', false);
                $(this).css('border-color', '#ff0000');
            } else {
                formState.phone.valid = false;
                showFieldError('phone', false);
                $(this).css('border-color', '#000000');
            }
            formState.phone.value = $(this).val();
        });
    }

    const cityCoordinates = {
        'москва': [55.7558, 37.6176],
        'санкт-петербург': [59.9343, 30.3351],
        'казань': [55.7887, 49.1221],
        'новосибирск': [55.0302, 82.9204],
        'екатеринбург': [56.8389, 60.6057],
        'нижний новгород': [56.3269, 44.0075],
        'самара': [53.1955, 50.1068],
        'омск': [54.9924, 73.3686],
        'ростов-на-дону': [47.2357, 39.7015],
        'уфа': [54.7348, 55.9579]
    };

    if (typeof $.fn.suggestions !== 'undefined') {
        $('#cityInput').suggestions({
            token: '0968f1751ac58bd038b590b9842328916bfc7165',
            type: 'ADDRESS',
            bounds: 'city',
            onSelect: function(suggestion) {
                const city = suggestion.value;
                formState.city.value = city;
                formState.city.valid = true;
                showFieldError('cityInput', true);
                
                document.getElementById('deliveryOptions').style.display = 'flex';
                document.querySelectorAll('input[name="delivery"]').forEach(radio => {
                    radio.disabled = false;
                });

                setTimeout(() => {
                    initMapForCity(city);
                }, 500);
            }
        });

        $('#address').suggestions({
            token: '0968f1751ac58bd038b590b9842328916bfc7165',
            type: 'ADDRESS',
            onSelect: function(suggestion) {
                const address = suggestion.value;
                formState.address.value = address;
                formState.address.valid = true;
                showFieldError('address', true);
                if (suggestion.data.postal_code) {
                    $('#postalCode').val(suggestion.data.postal_code);
                    formState.postalCode.value = suggestion.data.postal_code;
                    formState.postalCode.valid = true;
                    showFieldError('postalCode', true);
                }
            }
        });
    }

    function initMapForCity(cityName) {
        if (typeof ymaps === 'undefined') {
            console.error('Яндекс Карты не загружены');
            return;
        }
        if (currentMap) {
            currentMap.destroy();
            currentMap = null;
            currentPlacemark = null;
        }
        const cityLower = cityName.toLowerCase();
        let coords = cityCoordinates[cityLower] || [55.7558, 37.6176];
        ymaps.ready(() => {
            currentMap = new ymaps.Map('cartMap', {
                center: coords,
                zoom: 10
            });
            currentPlacemark = new ymaps.Placemark(coords, {
                hintContent: cityName,
                balloonContent: cityName
            }, {
                preset: 'islands#dotIcon',
                iconColor: '#000000'
            });
            currentMap.geoObjects.add(currentPlacemark);
        });
    }

    $('#fullName').on('input', function() {
        const val = $(this).val();
        const isValid = validateFullName(val);
        formState.fullName = { value: val, valid: isValid };
        showFieldError('fullName', isValid);
    });

    $('#phone').on('input', function() {
        const val = $(this).val();
        const isValid = validatePhone(val);
        formState.phone = { value: val, valid: isValid };
        showFieldError('phone', isValid);
        
        if (val.length > 0 && !isValid) {
            $(this).css('border-color', '#ff0000');
        } else if (val.length > 0 && isValid) {
            $(this).css('border-color', '#00aa00');
        } else {
            $(this).css('border-color', '#000000');
        }
    });

    $('#email').on('input', function() {
        const val = $(this).val();
        const isValid = validateEmail(val);
        formState.email = { value: val, valid: isValid };
        showFieldError('email', isValid);
    });

    $('#postalCode').on('input', function() {
        const val = $(this).val();
        const isValid = validatePostalCode(val);
        formState.postalCode = { value: val, valid: isValid };
        showFieldError('postalCode', isValid);
    });

    $('#address').on('input', function() {
        const val = $(this).val();
        const isValid = validateAddress(val);
        formState.address = { value: val, valid: isValid };
        showFieldError('address', isValid);
    });

    const pickupPoints = {
        'msk1': { name: 'г. Москва, ул. Тверская, 1', coords: [55.7575, 37.6156] },
        'msk2': { name: 'г. Москва, ул. Новый Арбат, 15', coords: [55.7523, 37.5971] },
        'msk3': { name: 'г. Москва, Ленинградский пр-т, 36', coords: [55.7855, 37.5597] },
        'spb1': { name: 'г. Санкт-Петербург, Невский пр-т, 28', coords: [59.9343, 30.3351] },
        'spb2': { name: 'г. Санкт-Петербург, ул. Рубинштейна, 23', coords: [59.9288, 30.3475] },
        'kzn1': { name: 'г. Казань, ул. Баумана, 15', coords: [55.7901, 49.1169] },
        'nsk1': { name: 'г. Новосибирск, Красный пр-т, 82', coords: [55.0415, 82.9346] },
        'ekb1': { name: 'г. Екатеринбург, пр. Ленина, 25', coords: [56.8389, 60.6057] }
    };

    $('#pickupPoint').on('change', function() {
        const val = $(this).val();
        const isValid = val !== '';
        formState.pickup = { value: val, valid: isValid };
        showFieldError('pickupPoint', isValid);
        if (currentMap && val && pickupPoints[val]) {
            const point = pickupPoints[val];
            currentMap.setCenter(point.coords, 15);
            if (currentPlacemark) {
                currentPlacemark.geometry.setCoordinates(point.coords);
                currentPlacemark.properties.set({
                    hintContent: point.name,
                    balloonContent: point.name
                });
            } else {
                currentPlacemark = new ymaps.Placemark(point.coords, {
                    hintContent: point.name,
                    balloonContent: point.name
                }, {
                    preset: 'islands#redDotIcon'
                });
                currentMap.geoObjects.add(currentPlacemark);
            }
        }
    });

    $('input[name="delivery"]').on('change', function() {
        const deliveryType = $(this).val();
        if (deliveryType === 'cdek') {
            loadPickupPoints();
        } else {
            document.getElementById('pickupPointContainer').style.display = 'none';
        }
    });

    function loadPickupPoints() {
        const select = $('#pickupPoint');
        select.empty();
        select.append('<option value="">Выберите пункт получения</option>');
        const cityInput = $('#cityInput').val().toLowerCase();
        setTimeout(() => {
            if (cityInput.includes('москва') || cityInput.includes('moscow')) {
                select.append('<option value="msk1">г. Москва, ул. Тверская, 1</option>');
                select.append('<option value="msk2">г. Москва, ул. Новый Арбат, 15</option>');
                select.append('<option value="msk3">г. Москва, Ленинградский пр-т, 36</option>');
            } else if (cityInput.includes('петербург') || cityInput.includes('peter')) {
                select.append('<option value="spb1">г. Санкт-Петербург, Невский пр-т, 28</option>');
                select.append('<option value="spb2">г. Санкт-Петербург, ул. Рубинштейна, 23</option>');
            } else if (cityInput.includes('казань')) {
                select.append('<option value="kzn1">г. Казань, ул. Баумана, 15</option>');
            } else if (cityInput.includes('новосибирск')) {
                select.append('<option value="nsk1">г. Новосибирск, Красный пр-т, 82</option>');
            } else if (cityInput.includes('екатеринбург')) {
                select.append('<option value="ekb1">г. Екатеринбург, пр. Ленина, 25</option>');
            } else {
                select.append('<option value="msk1">г. Москва, ул. Тверская, 1</option>');
                select.append('<option value="msk2">г. Москва, ул. Новый Арбат, 15</option>');
                select.append('<option value="msk3">г. Москва, Ленинградский пр-т, 36</option>');
                select.append('<option value="spb1">г. Санкт-Петербург, Невский пр-т, 28</option>');
                select.append('<option value="spb2">г. Санкт-Петербург, ул. Рубинштейна, 23</option>');
            }
            document.getElementById('pickupPointContainer').style.display = 'block';
        }, 300);
    }

    $('.cart-submit').off('click').on('click', function(e) {
        e.preventDefault();
        if ($(this).hasClass('processing')) return;

        const phoneField = document.getElementById('phone');
        if (phoneField) {
            const phoneDigits = phoneField.value.replace(/\D/g, '');
            if (phoneDigits.length === 0) {
                showFieldError('phone', false);
                formState.phone.valid = false;
                phoneField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
            if (phoneDigits.length === 10 && phoneDigits[0] === '9') {
                const corrected = '7' + phoneDigits;
                const formatted = corrected.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4-$5');
                phoneField.value = formatted;
                formState.phone.valid = true;
                showFieldError('phone', true);
            } else if (phoneDigits.length !== 11 || (phoneDigits[0] !== '7' && phoneDigits[0] !== '8')) {
                showFieldError('phone', false);
                formState.phone.valid = false;
                phoneField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            } else {
                formState.phone.valid = true;
                showFieldError('phone', true);
            }
        }
        
        if (validateForm()) {
            showSuccessScreen();
        } else {
            let errorMsg = document.querySelector('.cart-error-message');
            if (!errorMsg) {
                errorMsg = document.createElement('div');
                errorMsg.className = 'cart-error-message show';
                errorMsg.textContent = 'Пожалуйста, заполните все обязательные поля';
                const submitBtn = document.querySelector('.cart-submit');
                if (submitBtn) submitBtn.parentNode.insertBefore(errorMsg, submitBtn);
            } else {
                errorMsg.classList.add('show');
            }
            const firstError = document.querySelector('.error');
            if (firstError) {
                const container = document.querySelector('.cart-modal__container');
                container.scrollTo({
                    top: firstError.offsetTop - container.offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });

    const closeBtn = document.querySelector('.cart-modal__close');
    if (closeBtn) closeBtn.addEventListener('click', closeCartModal);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCartModal);
}

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + '₽';
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
            document.querySelectorAll('.accordion-header').forEach(h => h.classList.remove('active'));
            document.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('show'));
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

    const otherProducts = products.filter(p => p.id !== product.id);
    const shuffled = otherProducts.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);

    relatedGrid.innerHTML = selected.map(p => {
        return `
            <article class="product-card" data-product-id="${p.id}">
                <a href="product.html?id=${p.id}" class="product-card__link">
                    <div class="product-card__image-wrapper">
                        <img src="${p.imgPrimary}" alt="${p.title}" loading="lazy" class="product-card__image product-card__image--primary">
                        <img src="${p.imgSecondary}" alt="${p.title} loading="lazy" hover" class="product-card__image product-card__image--secondary">
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

/* ========== ГАЛЕРЕЯ ========== */
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

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            setMainImage(currentImageIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            setMainImage(currentImageIndex + 1);
        });
    }

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            const index = parseInt(thumb.dataset.index);
            setMainImage(index);
        });
    });

    if (mainImage) {
        mainImage.addEventListener('click', () => {
            openFullscreen(currentImageIndex);
        });
    }
}

/* ========== ПОЛНОЭКРАННЫЙ РЕЖИМ С ЗУМОМ (ОДНА ВЕРСИЯ) ========== */
let currentZoom = 1;
let translateX = 0, translateY = 0;
const ZOOM_LEVEL = 2.5;

function openFullscreen(startIndex) {
    currentImageIndex = startIndex;
    currentZoom = 1;
    translateX = 0;
    translateY = 0;
    
    const content = fullscreenModal.querySelector('.fullscreen-modal__content');
    if (!content) return;
    
    content.innerHTML = `
        <div class="fullscreen-modal__zoom-container" style="position: relative; width: 100%; height: 100%; overflow: hidden; display: flex; align-items: center; justify-content: center;">
            <img src="${productImages[currentImageIndex]}" alt="" loading="lazy" class="fullscreen-modal__image" id="fullscreenImage" style="max-width: 100%; max-height: 100%; object-fit: contain; transition: opacity 0.3s ease, transform 0.05s linear; cursor: zoom-in;">
        </div>
        <button class="fullscreen-modal__close">&times;</button>
        <button class="fullscreen-modal__arrow fullscreen-modal__arrow--prev">←</button>
        <button class="fullscreen-modal__arrow fullscreen-modal__arrow--next">→</button>
        <div class="fullscreen-modal__counter" id="fullscreenCounter">${currentImageIndex + 1} / ${productImages.length}</div>
    `;
    
    fullscreenImage = document.getElementById('fullscreenImage');
    fullscreenClose = document.querySelector('.fullscreen-modal__close');
    fullscreenPrev = document.querySelector('.fullscreen-modal__arrow--prev');
    fullscreenNext = document.querySelector('.fullscreen-modal__arrow--next');
    
    if (fullscreenClose) fullscreenClose.addEventListener('click', closeFullscreen);
    if (fullscreenPrev) fullscreenPrev.addEventListener('click', () => changeFullscreenImage(-1));
    if (fullscreenNext) fullscreenNext.addEventListener('click', () => changeFullscreenImage(1));
    
    initZoomFeature();
    
    fullscreenModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function initZoomFeature() {
    if (!fullscreenImage) return;
    
    const isMobile = window.innerWidth <= 768;
    const sensitivity = isMobile ? 2.5 : 1.8;
    
    function applyTransform() {
        if (currentZoom === 1) {
            fullscreenImage.style.transform = 'none';
            fullscreenImage.style.cursor = 'zoom-in';
        } else {
            fullscreenImage.style.transform = `scale(${currentZoom}) translate(${translateX}px, ${translateY}px)`;
            fullscreenImage.style.cursor = 'move';
        }
    }
    
    function updatePositionFromCoords(x, y) {
        let normX = Math.max(0, Math.min(1, x));
        let normY = Math.max(0, Math.min(1, y));
        
        const moveFactor = sensitivity * 1.5;
        translateX = -(normX - 0.5) * 120 * (currentZoom - 1) / currentZoom * moveFactor;
        translateY = -(normY - 0.5) * 120 * (currentZoom - 1) / currentZoom * moveFactor;
        
        const maxTranslate = isMobile ? 120 : 80;
        translateX = Math.max(-maxTranslate, Math.min(maxTranslate, translateX));
        translateY = Math.max(-maxTranslate, Math.min(maxTranslate, translateY));
        
        applyTransform();
    }
    
    fullscreenImage.addEventListener('mousemove', (e) => {
        if (currentZoom === 1) return;
        const rect = fullscreenImage.getBoundingClientRect();
        let x = (e.clientX - rect.left) / rect.width;
        let y = (e.clientY - rect.top) / rect.height;
        updatePositionFromCoords(x, y);
    });
    
    fullscreenImage.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentZoom === 1) {
            currentZoom = ZOOM_LEVEL;
            const rect = fullscreenImage.getBoundingClientRect();
            let x = (e.clientX - rect.left) / rect.width;
            let y = (e.clientY - rect.top) / rect.height;
            updatePositionFromCoords(x, y);
        } else {
            currentZoom = 1;
            translateX = 0;
            translateY = 0;
            applyTransform();
        }
    });
    
    fullscreenImage.addEventListener('touchmove', (e) => {
        if (currentZoom === 1) return;
        e.preventDefault();
        const touch = e.touches[0];
        const rect = fullscreenImage.getBoundingClientRect();
        let x = (touch.clientX - rect.left) / rect.width;
        let y = (touch.clientY - rect.top) / rect.height;
        updatePositionFromCoords(x, y);
    });
    
    fullscreenImage.addEventListener('touchstart', (e) => {
        if (currentZoom === 1) {
            e.preventDefault();
            currentZoom = ZOOM_LEVEL;
            const touch = e.touches[0];
            const rect = fullscreenImage.getBoundingClientRect();
            let x = (touch.clientX - rect.left) / rect.width;
            let y = (touch.clientY - rect.top) / rect.height;
            updatePositionFromCoords(x, y);
        }
    });
    
    fullscreenImage.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        if (currentZoom === 1) {
            currentZoom = ZOOM_LEVEL;
            const rect = fullscreenImage.getBoundingClientRect();
            let x = (e.clientX - rect.left) / rect.width;
            let y = (e.clientY - rect.top) / rect.height;
            updatePositionFromCoords(x, y);
        } else {
            currentZoom = 1;
            translateX = 0;
            translateY = 0;
            applyTransform();
        }
    });
    
    fullscreenImage.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.3 : 0.3;
        let newZoom = currentZoom + delta;
        newZoom = Math.max(1, Math.min(ZOOM_LEVEL, newZoom));
        
        if (newZoom !== currentZoom) {
            const rect = fullscreenImage.getBoundingClientRect();
            let x = (e.clientX - rect.left) / rect.width;
            let y = (e.clientY - rect.top) / rect.height;
            currentZoom = newZoom;
            if (currentZoom === 1) {
                translateX = 0;
                translateY = 0;
            } else {
                updatePositionFromCoords(x, y);
            }
            applyTransform();
        }
    });
}

function updateFullscreenImage() {
    if (!fullscreenImage) return;
    
    fullscreenImage.style.opacity = '0';
    
    setTimeout(() => {
        fullscreenImage.src = productImages[currentImageIndex];
        fullscreenImage.style.opacity = '1';
        
        currentZoom = 1;
        translateX = 0;
        translateY = 0;
        fullscreenImage.style.transform = 'none';
        fullscreenImage.style.cursor = 'zoom-in';
        
        const counter = document.getElementById('fullscreenCounter');
        if (counter) {
            counter.textContent = `${currentImageIndex + 1} / ${productImages.length}`;
        }
    }, 150);
}

function closeFullscreen() {
    fullscreenModal.classList.remove('active');
    document.body.style.overflow = '';
    currentZoom = 1;
    translateX = 0;
    translateY = 0;
}

function changeFullscreenImage(delta) {
    let newIndex = currentImageIndex + delta;
    if (newIndex < 0) newIndex = productImages.length - 1;
    if (newIndex >= productImages.length) newIndex = 0;
    currentImageIndex = newIndex;
    updateFullscreenImage();
}

function initSwipeSupport() {
    let touchStartX = 0;
    let touchStartTime = 0;
    
    const modal = document.getElementById('fullscreenModal');
    if (!modal) return;
    
    modal.addEventListener('touchstart', (e) => {
        if (currentZoom !== 1) return;
        touchStartX = e.changedTouches[0].screenX;
        touchStartTime = Date.now();
    });
    
    modal.addEventListener('touchend', (e) => {
        if (currentZoom !== 1) return;
        const touchEndX = e.changedTouches[0].screenX;
        const swipeDistance = touchEndX - touchStartX;
        const swipeTime = Date.now() - touchStartTime;
        
        if (Math.abs(swipeDistance) > 50 && swipeTime < 300) {
            if (swipeDistance > 0) {
                changeFullscreenImage(-1);
            } else {
                changeFullscreenImage(1);
            }
        }
    });
}

/* ========== ИНИЦИАЛИЗАЦИЯ ========== */
function initProductPage() {
    productContainer = document.querySelector('.product-page__container');
    fullscreenModal = document.getElementById('fullscreenModal');
    cartModal = document.getElementById('cartModal');
    cartOverlay = document.getElementById('cartOverlay');
    cartContent = document.getElementById('cartContent');
    
    renderProductPage();
    initSwipeSupport();
}

document.addEventListener('componentsLoaded', initProductPage);
if (document.querySelector('.product-page')) initProductPage();

window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }
});