const mongoose = require('mongoose')

module.exports = mongoose.model('Joke', new mongoose.Schema({
    setup: { type: String, required: true },
    punchline: { type: String, required: true }
}))
