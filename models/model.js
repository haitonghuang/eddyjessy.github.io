const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    // location: {
    //     type: String
    // },
    // gender: {
    //     type: String
    // },
    // bio: {
    //     type: String
    // },
    // img: {
    //     type: Buffer
    // }
})

module.exports = mongoose.model('User', userSchema)