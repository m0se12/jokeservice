const express = require('express');
const mongoose= require('mongoose');
const fetch = require('node-fetch');
const Schema = mongoose.Schema;
mongoose.Promise = Promise;
mongoose.connect('mongodb://mose:kode123@ds037778.mlab.com:37778/jokes_mm', {useNewUrlParser: true});

//const baseUrl = "http://localhost:8010";
const baseUrl = "https://badjokes.herokuapp.com";

const timeout = 500;

function fetchWithTimeout( url, timeout ) {
    return new Promise( (resolve, reject) => {
        // Set timeout timer
        let timer = setTimeout(
            () => reject( new Error('Request timed out') ),
            timeout
        );

        fetch( url ).then(
            response => resolve( response ),
            err => reject( err )
        ).finally( () => clearTimeout(timer) );
    })
}

addService();
async function addService() {
    let result = await fetch("https://krdo-joke-registry.herokuapp.com/api/services", {
        method: 'POST',
        body: JSON.stringify({
            "name": "badjokes",
            "address": "https://badjokes.herokuapp.com",
            "secret": "mm123"
        }),
        headers: { 'Content-Type': 'application/json' }
    });
    console.log("Added to service")
}

const router = express.Router();


const joke = new Schema({
    setup: String,
    punchline: String
});

const Joke = mongoose.model('Joke', joke, next);

function createJoke(setup_in, punchline_in) {

    const joke = new Joke({
        setup: setup_in,
        punchline: punchline_in
    });
    return joke.save();
}

function getJokes() {
    return Joke.find().exec();
}

router.get('/jokes', function(req, res, next) {

    getJokes().then(function (i) {
        res.json(i);
    })

});

router.get('/othersites', function(req, res, next) {
    let url = 'https://krdo-joke-registry.herokuapp.com/api/services';

    return fetch(url).then(function (response) {

        return response.json().then(function (value) {
            res.send(value)
        })
    })
});

router.get('/otherjokes/:site', function(req, res, next) {
    let url = "http://"+req.params['site']+"/api/jokes";
    return fetchWithTimeout(url, timeout).then(function (response) {

        return response.json().then(function (value) {
            res.send(value)
        }).catch(i=>{
            res.end();
        })
    }).catch(i=>{
        res.end();
    })

});

router.get('/allOtherJokes', async function(req, res, next) {
    let otherJokesResult = await fetchWithTimeout(baseUrl+"/api/othersites", timeout).then(resultat=>resultat.json()).then(async resultat => {
        let jsonObject = {};

        for(let site of resultat)
        {
            try {
                let address = site.address.replace("http://", "").replace("https://", "");
                let jokes = await fetch(baseUrl+"/api/otherjokes/"+address).catch(reason=>{}).then(i=>i.json()).catch(exception=>{}).then(i=>{return i});
                jsonObject[site._id] = jokes;
            } catch (reason){
                console.log(reason)
            }
        }
        return jsonObject;

    });
    res.send(otherJokesResult);

});

router.post('/jokes',function (req, res, next) {

    createJoke(req.body.setup, req.body.punchline);
    backURL = req.header('Referer');
    if (backURL != null) {
        res.redirect(backURL);
    }
    res.end();
});

module.exports = router;
