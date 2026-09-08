const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

const API_URL = 'https://dummyjson.com/products';

// R: Read (Get all products) & Search Functionality
app.get('/', async (req, res) => {
    const searchQuery = req.query.search || '';
    const url = searchQuery ? `${API_URL}/search?q=${searchQuery}` : API_URL;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        res.render('product', { products: data.products, searchQuery });
    } catch (error) {
        res.status(500).send('Error fetching products');
    }
});

// R: Read (Get single product details)
app.get('/product/:id', async (req, res) => {
    try {
        const response = await fetch(`${API_URL}/${req.params.id}`);
        const product = await response.json();
        res.render('product_detail', { product });
    } catch (error) {
        res.status(500).send('Error fetching product details');
    }
});

// C: Create (Insert a new product)
app.post('/product/create', async (req, res) => {
    try {
        await fetch(`${API_URL}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        res.redirect('/'); // DummyJSON simulates the creation
    } catch (error) {
        res.status(500).send('Error creating product');
    }
});

// U: Update (Update an existing product)
app.post('/product/:id/update', async (req, res) => {
    try {
        const response = await fetch(`${API_URL}/${req.params.id}`, {
            method: 'PUT', /* หรือ PATCH */
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: req.body.title, description: req.body.description })
        });
        
        // รับข้อมูลที่ DummyJSON ตอบกลับมาว่าอัปเดตสำเร็จ
        const updatedData = await response.json(); 
        
        // ปริ้นท์โชว์ใน Terminal ให้อาจารย์ดูว่าข้อมูลถูกจำลองการอัปเดตแล้ว
        console.log("✅ อัปเดตข้อมูลสำเร็จ! นี่คือข้อมูลที่จำลองการส่งกลับมา:");
        console.log(updatedData); 

        // รีเฟรชกลับไปหน้ารายละเอียด (ซึ่งข้อมูลบนหน้าเว็บจะกลับเป็นเหมือนเดิมตามข้อจำกัดของ DummyJSON)
        res.redirect(`/product/${req.params.id}`);
    } catch (error) {
        res.status(500).send('Error updating product');
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));