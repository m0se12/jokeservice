var express = require('express');
const fetch = require('node-fetch');
var router = express.Router();

const api = require("../routes/api");

const baseUrl = "http://localhost:8010";
//const baseUrl = "https://badjokes.herokuapp.com/";


/* GET home page. */
router.get('/', async function(req, res, next) {
    var json = {};

    function addToJsonArray(key,value) {
        json[key] = value;
    }

    addToJsonArray('title','badjokes');

    let jokes = await fetch(baseUrl+"/api/jokes").then(i=>i.json()).then(i=>{return i});
    let othersites = await fetch(baseUrl+"/api/othersites").then(i=>i.json()).then(i=>{return i});
    let otherJokesResult = await fetch(baseUrl+"/api/allOtherJokes").then(x=>x.json()).then(i=>{return i});


    addToJsonArray("ownjokes",jokes);
    addToJsonArray("otherSources",othersites);
    addToJsonArray("otherjokes",otherJokesResult);

    res.render('index', json);






});
module.exports = router;
