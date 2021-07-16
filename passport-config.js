const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('./models/model')


// function initialize(passport, getUserByEmail) {
//     const authenticateUser = async (email, password, done) => {
//         const user = getUserByEmail(email)
//         if (user == null) {
//             return done(null, false, { message: 'No user with that email'})
//         }
//         try{
//             if (await bcrypt.compare(password, user.password)) {
//                 return done(null, user)
//             }else{
//                 return done(null, false, { message: 'Passwor incorrect'})
//             }
//         }catch(e){
//             return done(e)
//         }

//     }
//     passport.use(new LocalStrategy({ usernameField: 'email'}, authenticateUser))
//     passport.serializeUser((user, done) => done(null, user.id))
//     passport.deserializeUser((id, done) => {
//         return done(null, getUserById(id))
//     })
// }


// module.exports = initialize

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
    })
    )

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
    
