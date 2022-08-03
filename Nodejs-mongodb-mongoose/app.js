// imports
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



const User = require('./Models/user') 

// create express server
var app = express()

// add middleware before routes
app.use(bodyParser.json())
app.use(cors())

//connect to mongoDB
const uri = process.env.MONGO_URI || 'mongodb://localhost/zomato';

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family:4
}

const connectWithDB = () => {
    mongoose.connect(uri, options, (err, db) => {
      if (err) console.error(err);
      else console.log("database connection")
    })
}

connectWithDB()




app.use(session({
    secret: "this is unambigous secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24*60*60*1000 },
    store   : MongoStore.create({ 
        client: mongoose.connection.getClient(),
        dbName:'zomato',
        ttl: 14 * 24 * 60 * 60
     })
    
}));

app.use(passport.initialize());
app.use(passport.session());
 


// middleware routes
app.use('/zomato', zomatoRoutes)
app.use('/payment', paymentRoutes)


//listen to a port
app.listen(5252,() => {
    console.log("express app is up and running on port 5252");
})

