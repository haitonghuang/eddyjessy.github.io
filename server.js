if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const PORT = process.env.PORT || 8000
const app = express()
const url = 'mongodb+srv://user:user01@cluster0.q2bow.mongodb.net/users'
const session = require('express-session')
const flash = require('express-flash')
const passport = require('passport')
const User = require('./models/model')
const bcrypt = require('bcrypt')
const initializePassport = require('./passport-config')
var cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const { Store } = require('express-session')


//establish connection to database
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log('Connected to database')
}).catch(err => console.log(err))


app.use(cors({origin:'http://localhost:3000', credentials:true}))
app.use(express.json())
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false}))
// https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0#39779840
// a. express.json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object. 
// This method is called as a middleware in your application using the code: app.use(express.json());

// b. express.urlencoded() is a method inbuilt in express to recognize the incoming Request Object as strings or arrays. 
// This method is called as a middleware in your application using the code: app.use(express.urlencoded());

app.use(cookieParser(process.env.SESSION_SECRET))


app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true, 
    cookie:{httpOnly:false}   
}))
app.use(passport.initialize())
app.use(passport.session())

initializePassport(passport)



app.post('/register', (req, res) => {
    User.findOne({email: req.body.email}, async(err, result) => {
        if (err) throw err
        if (result){
            res.end('User Already Exists')
        }else{
            let user = new User(req.body );
            
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            user.password  = hashedPassword
            await user.save()
            console.log('Create users successfully')
            res.status(200).end()
        }
    })
})

app.post('/login', (req, res, next) => {
    
    passport.authenticate('local', (err, user, info) => {
        if (err) throw err
        if (!user){
            console.log('No user exists')
            res.end('No User Exists')
        } else{
            req.logIn(user, (err) => {
                if (err) throw err;
                console.log('successfully authenticated')
               
                res.send("log in successfully")
                // res.redirect('/account')
                console.log(req.user)
            })
        }

    })(req, res, next)
})


// app.get('/account/:id', (req, res) => {
//     User.findById(req.params.id)
//     .then(data => {
//         console.log('retrieved')
//         res.send(data)
//     }).catch(err => {
//         console.log(err)
//         res.status(500).end()
//     })
// })
app.get('/account', (req, res) => {
    console.log(req.session)
    res.send(req.user); // The req.user stores the entire user that has been authenticated inside of it.
  });
    


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})