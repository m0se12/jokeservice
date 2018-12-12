const express = require('express');
const router = express.Router();

const baseUrl = "http://localhost:8010";
//const baseUrl = "https://badjokes.herokuapp.com";

router.get('/', async function(req, res) {
res.render('index')

});
module.exports = router;
