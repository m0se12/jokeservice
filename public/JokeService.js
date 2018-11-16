export default class JokeService {
    async getJokes () {
        return await fetch('/api/jokes').then(response => response.json())
    }

    async getOtherSites () {
        return await fetch('/api/othersites').then(response => response.json())
    }

    async getOtherJokes (site) {
        return await fetch(`/api/otherjokes/${site}`).then(response => response.json())
    }

    async addJoke (joke) {
        await fetch('/api/jokes', { method: 'POST', body: JSON.stringify(joke), headers: { 'Content-Type': 'application/json' } })
    }

    async deleteJoke(id) {
        await fetch('/api/jokes', { method: 'DELETE', body: JSON.stringify({ id }), headers: { 'Content-Type': 'application/json' } })
    }

    async updateJoke(id, setup, punchline) {
        await fetch('/api/jokes', { method: 'PATCH', body: JSON.stringify({ id, setup, punchline }), headers: { 'Content-Type': 'application/json' } })
    }
}
