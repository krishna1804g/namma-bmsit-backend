const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();
const router = require('./routes');

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

app.use(cors ({
    origin: ['http://localhost:3000', ]
}));

// middleware
app.use(router);

app.all('/', (req, res) => {
    res.status(200).json({ status: 200, message: 'Welcome to Namma-BMSIT API.' })
})
app.all('*', (req, res) => {
    res.status(404).json({ status: 404, message: 'Not Found.' })
})
const start = () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        })
    } catch (error) {
        console.error(error)
    }
}


start();