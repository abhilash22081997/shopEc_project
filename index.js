const express = require('express')
const app = express();
const session = require('express-session')
const mongoose = require('mongoose');
var expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser')


mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/shopEc");
//-----------------------------


const userRouter = require("./routes/userRouter")
const adminRouter= require('./routes/adminRouter')

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser())

app.use(session({
    secret:'thisismysecretkey',
    saveUninitialized:true,
    cookie:{maxAge:1000000}, //one hour
    resave: false
}))


app.set('views','./views');
app.set('view engine','ejs');
app.use(expressLayouts);
app.set('layout','./layouts/layout')
app.use(express.static('public'));

app.use('/',userRouter)
app.use('/admin',adminRouter)

const PORT = 3001;


app.listen(PORT, () => {
    console.log('Server started');
});