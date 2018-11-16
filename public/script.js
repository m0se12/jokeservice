
onload = () => {
    import JokeService from './JokeService.js'
    import JokeTemplates from './JokeTemplates.js'

    const service = new JokeService()
    const templates = new JokeTemplates()

    const selfServiceName = 'badjokes'
    let activeService = selfServiceName

    document.getElementById("add-submit").addEventListener("click",()=>{
        const inputSetup = document.getElementById('add-setup')
        const inputPunchline = document.getElementById('add-punchline')

        const setup = inputSetup.value
        const punchline = inputPunchline.value
        if (!setup || !punchline) {
            return
        }

        inputSetup.value = ''
        inputPunchline.value = ''
         service.addJoke({ setup, punchline })
         templates.registerJokesPartial(service.getJokes())
        updateContent()
    });


}
