require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});
app.use('/api/geo', require('./routes/geoRoute'));  
const connectServer = async () => {
    try {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.error('Error starting the server:', error);
    }
}

connectServer();

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});
