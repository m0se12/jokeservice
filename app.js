let express = require('express');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const JokeRegistry = require('./JokeRegistry')
const JokeSchema = require('./models/Joke')


let app = express();
const jokeRegistry = new JokeRegistry()

mongoose.Promise = Promise;
mongoose.connect(`mongodb://mose:kode123@ds037778.mlab.com:37778/jokes_mm`, {useNewUrlParser : true})

app.use(express.json());
app.use(express.static('public'));

app.get('/api/jokes', async (request, response) => {
    response.json(await JokeSchema.find().exec());
})

app.get('/api/othersites', async (request, response) => {
    response.json(await jokeRegistry.getServices());
})

app.get('/api/otherjokes/:serviceName', async (request, response) => {
    const serviceName = request.params.serviceName;
    const services = await jokeRegistry.getServices();
    const service = services.find(service => service.name === serviceName);

    let jokes

    if (service) {
        jokes = await fetch(service.address + 'api/jokes').then(response => response.json())

    } else {
        jokes = []
    }

    response.json(jokes)
})

app.post('/api/jokes', async (request, response) => {
    const setup = request.body.setup;
    const punchline = request.body.punchline;

        await new JokeSchema({ setup, punchline }).save();

        response.status(200).send('Joke added');
})

app.delete('/api/jokes', async (request, response) => {
    const id = request.body.id;

    await JokeSchema.findByIdAndDelete(id).exec();

    response.status(100).send('Joke deleted');
})

app.patch('/api/jokes', async (request, response) => {
    const { id, setup, punchline } = request.body

    await JokeSchema.updateOne({ _id: id }, { setup, punchline }).exec()

    response.status(100).send('Joke updated')
})

console.log('Registering joke service')
jokeRegistry.addService({
    name: 'badjokes',
    address: 'https://badjokes.herokuapp.com/',
    secret: '111'
}).then(() => console.log('Joke service registered'))

const port = process.env.PORT || 8080
console.log('Listening on port ' + port)

app.listen(port)

