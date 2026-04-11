const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const SHOP_ID = '1328041';
const SECRET_KEY = 'test_uij2KtJ783e_FjDIbs1OxFBg5Dins0BRe6G0In17Hs4';


app.post('/api/create-payment', async (req, res) => {
    try {
        const { amount, description, email, phone, orderId } = req.body;
        
        const idempotenceKey = uuidv4();
        
        const paymentData = {
            amount: {
                value: amount.toString(),
                currency: 'RUB'
            },
            capture: true,
            confirmation: {
                type: 'redirect',
                return_url: 'http://127.0.0.1:5500/success.html'
            },
            description: description || `Заказ UNFORT #${orderId}`,
            receipt: {
                customer: {
                    email: email,
                    phone: phone
                },
                items: [
                    {
                        description: description || 'Товары UNFORT',
                        quantity: '1.00',
                        amount: {
                            value: amount.toString(),
                            currency: 'RUB'
                        },
                        vat_code: '1',
                        payment_mode: 'full_payment',
                        payment_subject: 'commodity'
                    }
                ]
            }
        };
        
        const auth = Buffer.from(`${SHOP_ID}:${SECRET_KEY}`).toString('base64');
        
        const response = await axios.post(
            'https://api.yookassa.ru/v3/payments',
            paymentData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Idempotence-Key': idempotenceKey,
                    'Authorization': `Basic ${auth}`
                }
            }
        );
        
        res.json({
            success: true,
            confirmationUrl: response.data.confirmation.confirmation_url,
            paymentId: response.data.id
        });
        
    } catch (error) {
        console.error('Error creating payment:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            error: error.response?.data?.description || 'Ошибка при создании платежа'
        });
    }
});

app.get('/api/payment/:id', async (req, res) => {
    try {
        const paymentId = req.params.id;
        const auth = Buffer.from(`${SHOP_ID}:${SECRET_KEY}`).toString('base64');
        
        const response = await axios.get(
            `https://api.yookassa.ru/v3/payments/${paymentId}`,
            {
                headers: {
                    'Authorization': `Basic ${auth}`
                }
            }
        );
        
        res.json({
            success: true,
            payment: response.data
        });
        
    } catch (error) {
        console.error('Error getting payment:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            error: error.response?.data?.description || 'Ошибка при получении информации о платеже'
        });
    }
});


app.post('/api/webhook', async (req, res) => {
    try {
        const event = req.body;
        
        if (event.event === 'payment.succeeded') {
            const payment = event.object;
            
        }
        
        res.json({ success: true });
        
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ success: false });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер оплаты запущен на http://localhost:${PORT}`);
});