export default class JokeTemplates {
    constructor () {
        this.loader = '<div class="emoji-container"><div class="emoji"><div>😂</div></div>'
    }

    async compileContent () {
        const template = await fetch('/assets/templates/content.hbs').then(response => response.text())
        const compiler = Handlebars.compile(template)

        return compiler({ })
    }

    async compileJokes (jokes) {
        const template = await fetch('/assets/templates/jokes.hbs').then(response => response.text())
        const compiler = Handlebars.compile(template)

        return compiler({ jokes })
    }

    async compileServices (services) {
        const template = await fetch('/assets/templates/services.hbs').then(response => response.text())
        const compiler = Handlebars.compile(template)

        return compiler({ services })
    }

    async registerPartials (jokes, services) {
        await Promise.all([
            this.registerJokesPartial(jokes),
            this.registerServicesPartial(services)
        ])
    }

    async registerJokesPartial (jokes) {
        Handlebars.registerPartial('jokesPartial', await this.compileJokes(jokes))
    }

    async registerServicesPartial (services) {
        Handlebars.registerPartial('servicesPartial', await this.compileServices(services))
    }
}
