const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

const api = require("../routes/api");

//const baseUrl = "http://localhost:8010";
const baseUrl = "https://badjokes.herokuapp.com";


router.get('/', async function(req, res) {
res.render('index')

});
module.exports = router;
