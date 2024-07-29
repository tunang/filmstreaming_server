require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors')


const authRouter = require('./routes/auth')
const watchingRouter = require('./routes/watching')
const favoriteRouter = require('./routes/favorite')

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.euaefbu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
        console.log('Connected')
    }
    catch (error) {
        console.log('Error');
    }
}
connectDB()

const app =  express();
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => res.send('Hello world'));
app.use('/api/auth', authRouter);
app.use('/api/watching', watchingRouter);
app.use('/api/favorite', favoriteRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server start on port ${PORT}`));