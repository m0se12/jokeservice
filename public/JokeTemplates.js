import * as Handlebars from "handlebars";

export default class JokeTemplates {

    async compileContent () {
        const template = await fetch('templates/content.hbs').then(response => response.text())
        const compiler = Handlebars.compile(template)

        return compiler({ })
    }

    async compileJokes (jokes) {
        const template = await fetch('templates/jokes.hbs').then(response => response.text())
        const compiler = Handlebars.compile(template)

        return compiler({ jokes })
    }

    async compileServices (services) {
        const template = await fetch('/templates/services.hbs').then(response => response.text())
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
