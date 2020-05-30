const express = require('express');
const mongoose = require('mongoose');

const {MONGOURI} = require('./keys');

const app = express();
const PORT = 5000

// Mongodb connection
mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('connected',()=>{
    console.log(`Connected to MongoDB`);
});
mongoose.connection.on('error',(err)=>{
    console.log(`Error Connecting ${err}`);
});

// Registering the mongoose model
require('./models/user');
require('./models/post');

// registering the routes
app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));

app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`)
})