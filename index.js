const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the public directory

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/users')
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// User schema
const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('validate', userSchema);

// Medicine schema
const medicineSchema = new mongoose.Schema({
    "Medicine Name": { type: String, required: true },
    "Price (INR)": { type: Number, required: true },
    "Manufacturer": { type: String, required: true },
    "Side Effects": { type: String, required: true }
});

const Medicine = mongoose.model('medicine', medicineSchema);

// Serve the login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/aboutus', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/medicine', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'medicines.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Medicine search API with case-insensitive search
app.post('/search-medicine', async (req, res) => {
    const { medicineName } = req.body;

    try {
        // Case-insensitive search for the medicine
        const medicine = await Medicine.findOne({ "Medicine Name": { $regex: new RegExp(medicineName, "i") } });
        
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }

        res.status(200).json(medicine);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Sign Up Endpoint
app.post('/signup', async (req, res) => {
    const { userId, password } = req.body;

    try {
        const existingUser = await User.findOne({ userId });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        const newUser = new User({ userId, password });
        await newUser.save();
        res.status(201).send('User created successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Sign In Endpoint
app.post('/signin', async (req, res) => {
    const { userId, password } = req.body;

    try {
        const user = await User.findOne({ userId, password });
        if (!user) {
            return res.status(401).send('Incorrect User ID or Password');
        }

        res.status(200).send('User authenticated');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


// Contact form submission endpoint
app.post('/submit-contact', async (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    try {
        // Create a new document for the contact submission
        const contactData = {
            name,
            email,
            phone,
            subject,
            message,
            submittedAt: new Date()
        };

        // Assuming you're storing contact details in the 'contact' collection
        const contactCollection = mongoose.connection.collection('contact');
        await contactCollection.insertOne(contactData);

        res.status(201).json({ message: 'Contact information submitted successfully' });
    } catch (error) {
        console.error('Error submitting contact form:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
