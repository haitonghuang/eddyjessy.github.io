const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('./models/model')

function initialize(passport) {
    passport.use(new LocalStrategy({
        usernameField: 'email'
    },
    function(email, password, done){
        User.findOne({ email: email}, async (err, user) => {
            if (err) return done(err)
            if (!user) return done(null, false)
            await bcrypt.compare(password, user.password,(err, result) => {
                if (err) throw err;
                if (result) {
                    return done(null, user)
                }else{
                    return done(null, false)
                }
            })
        })
    }))

//If authentication succeeds, a session will be established and maintained via a cookie set in the user's browser.
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}


module.exports = initialize     
    
