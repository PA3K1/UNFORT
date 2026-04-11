// js/payment.js
let currentPaymentId = null;

async function createPayment(amount, description, email, phone) {
    const orderNumber = Math.floor(Math.random() * 1000000);
    
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
    
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
        showPaymentError('Неверная сумма платежа');
        return;
    }
    
    const amountStr = amountNum.toFixed(2);
    
    try {
        const response = await fetch('http://localhost:3000/api/create-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: amountStr,
                description: description,
                email: email,
                phone: normalizedPhone,
                orderId: orderNumber
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentPaymentId = data.paymentId;
            localStorage.setItem('currentPaymentId', data.paymentId);
            window.location.href = data.confirmationUrl;
        } else {
            showPaymentError(data.error || 'Ошибка при создании платежа');
        }
        
    } catch (error) {
        console.error('Payment error:', error);
        showPaymentError('Ошибка соединения с сервером');
    }
}

function showPaymentError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'payment-error';
    errorDiv.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: #ff4444; color: white; padding: 15px 20px; border-radius: 8px; z-index: 10000; max-width: 350px;">
            ❌ ${message}
            <button onclick="this.parentElement.remove()" style="margin-left: 10px; background: none; border: none; color: white; cursor: pointer;">✕</button>
        </div>
    `;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

window.UnfortPayment = {
    createPayment: createPayment
};