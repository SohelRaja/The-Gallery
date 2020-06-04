const express = require('express');
const mongoose = require('mongoose');

const {MONGOURI} = require('./config/keys');

const app = express();
const PORT = process.env.PORT || 5000

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
app.use(require('./routes/user'));

if(process.env.NODE_ENV === "production"){
    app.use(express.static('client/build'));
    const path = require('path');
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','index.html'))
    })
}

app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`)
})