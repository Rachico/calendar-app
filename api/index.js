const mongoose = require('mongoose');
const availabilities = require('./routes/availabilities');
const reservations = require('./routes/reservations');
const dbConfig = require("./config/db.config");


const express = require('express');
const app = express();
require('dotenv').config();



var cors = require('cors');

app.use(cors());
app.use(express.json());
app.use('/api/reservations', reservations);
app.use('/api/availabilities', availabilities);



mongoose.connect(dbConfig.url)
    .then(()=> console.log('Connected to MongoDB...'))
    .catch((error) => console.error('Could not connect...',error));


app.get('/',(req,res)=>{
    res.send('Giskard app running....');
});

const port = process.env.NODE_DOCKER_PORT || 8000 ; 

app.listen(port, ()=>{
    console.log(`Listening on port ${port}...`);
});
