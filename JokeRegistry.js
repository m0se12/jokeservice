const fetch = require('node-fetch');
const urlMatcher = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2})\S*$/

module.exports = class JokeRegistry {
    constructor () {
        this.url = 'https://krdo-joke-registry.herokuapp.com/api/services';
    }
    async getServices () {
        const services = await fetch(this.url).then(response => response.json())
        const filteredServices = []

        for (const service of services) {
            let address = service.address

            if (!urlMatcher.test(address)) {
                continue
            }

            if (!address.endsWith('/')) {
                service.address = address + '/'

                address += '/api/jokes';
            } else {
                address += 'api/jokes';
            }

            filteredServices.push(fetch(address).then(response => response.json()).catch(ignored => {}).then(response => ({ response, service })));
        }

        return (await Promise.all(filteredServices))
            .filter(element => element.response)
            .map(element => element.service)
            .filter(service => service.name !== 'badjokes');
    }

    async addService (service) {
        await fetch(this.url, {
            method: 'POST',
            body: JSON.stringify(service),
            headers: { 'Content-Type': 'application/json' }
        })
    }

    async deleteService (service) {
        await fetch(this.url, {
            method: 'DELETE',
            body: JSON.stringify(service),
            headers: { 'Content-Type': 'application/json' }
        })
    }
}
