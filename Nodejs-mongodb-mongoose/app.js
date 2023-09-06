// imports
require('dotenv').config();
const express = require('express')
const session = require("express-session")
const bodyParser = require('body-parser')
const cors = require('cors')
const zomatoRoutes = require('./Routes/zomato')
const paymentRoutes = require('./Routes/payments')
const mongoose = require('mongoose')
const passport = require("passport")
const LocalStrategy = require("passport-local")
const passportLocalMongoose = require("passport-local-mongoose")
const MongoStore = require('connect-mongo');
//const MongoClient = require("mongodb").MongoClient;
//var MongoDBStore = require('connect-mongodb-session')(session);



const User = require('./Models/user') 

// create express server
var app = express()

// add middleware before routes
app.use(bodyParser.json())
app.use(cors({
    origin: 'https://vrestaurant.onrender.com'
}))

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "https://v-restaurant.herokuapp.com");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

//connect to mongoDB

const uri = process.env.MONGO_URI;

console.log(uri, "this is the uri")
console.log('this is hi from GitHub')

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName:'zomato1'
}

mongoose.connect(uri, options).then(() => {
    console.log('mongoose connected')
}).catch(e => console.log(e))


// mongoose.connection.on('connected', () => {
//     console.log('mongoose is connected')
// })

// create and connect to mongostore (connect-mongodb-session)

// var store = new MongoDBStore({
//   uri: uri,
//   collection: 'sessions'
// },
//     function(error){
//     console.log(error,'this is the error')
// });

// // Catch errors
// store.on('error', function(error) {
//   console.log(error,'this is store on error error log');
// });


app.use(session({
    secret: "this is unambigous secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24*60*60*1000 },
    store: MongoStore.create({ 
        client: mongoose.connection.getClient(),
        dbName:'zomato1',
        autoRemove: 'disabled',
        ttl: 14 * 24 * 60 * 60
     })
    
}));

app.use(passport.initialize());
app.use(passport.session());
 


// middleware routes
app.use('/zomato', zomatoRoutes)
app.use('/payment', paymentRoutes)


// heroku configuration
if(process.env.NODE_ENV=="production"){
    const path = require('path')
    app.use(express.static(path.resolve(__dirname, "vrestaurant/build")))
    console.log(path.resolve(__dirname, "vrestaurant/build/index.html"),'this is the path that needs to be resolved')
    app.get("/*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "vrestaurant", "build", "index.html"))
    })
}

//listen to a port
app.listen( process.env.PORT , () => {
    console.log('express app is up and running on port log: ', process.env.PORT)
})
