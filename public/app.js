import JokeService from './JokeService.js'
import JokeTemplates from './JokeTemplates.js'

const service = new JokeService()
const templates = new JokeTemplates()

const selfServiceName = 'badjokes'
let activeService = selfServiceName


const updateContent = async () => {
    document.getElementById('content').innerHTML = await templates.compileContent()
    document.querySelector(`[data-service-name="${activeService}"]`).classList.add('active')

    if (activeService !== selfServiceName) {
        document.querySelectorAll('.joke-actions').forEach(element => element.classList.add('hidden'))
    }
}

const listenForClicks = (filter, click) => {
    document.addEventListener('click', event => {
        const target = event.target

        if (!filter(target)) {
            return
        }

        event.preventDefault()

        click(target)
    })
}

// Listen for clicks on service buttons
listenForClicks(target => target.matches('.service-button') && !target.matches('.active'), async target => {
    const serviceName = target.dataset.serviceName

    document.querySelectorAll('.service-button').forEach(element => element.classList.remove('active'))
    target.classList.add('active')

    activeService = serviceName

    if (activeService === selfServiceName) {
        document.querySelector('.add').classList.remove('hidden')
    } else {
        document.querySelector('.add').classList.add('hidden')
    }



    let jokes
    if (serviceName === selfServiceName) {
        jokes = await service.getJokes()
    } else {
        jokes = await service.getOtherJokes(serviceName)
    }

    await templates.registerJokesPartial(jokes)
    await updateContent()
})

// Listen for clicks on jokes
listenForClicks(target => target.matches('.joke'), async target => {
    const elementPunchline = document.getElementById(target.id + '-punchline')
    const classList = elementPunchline.classList

    if (classList.contains('hidden')) {
        classList.remove('hidden')
    } else {
        classList.add('hidden')
    }
})

// Listen for clicks on add button
listenForClicks(target => target.matches('#add-submit'), async target => {
    const inputSetup = document.getElementById('add-setup')
    const inputPunchline = document.getElementById('add-punchline')

    const setup = inputSetup.value
    const punchline = inputPunchline.value

    if (!setup || !punchline) {
        return
    }

    inputSetup.value = ''
    inputPunchline.value = ''
    await service.addJoke({ setup, punchline })
    await templates.registerJokesPartial(await service.getJokes())
    await updateContent()
})

// Listen for clicks on delete button
listenForClicks(target => target.matches('.joke-delete'), async target => {
    const id = target.dataset.id

    displayLoader()

    await service.deleteJoke(id)
    await templates.registerJokesPartial(await service.getJokes())
    await updateContent()
})

// Listen for clicks on save button
listenForClicks(target => target.matches('.joke-save'), async target => {
    const id = target.dataset.id

    const setup = document.getElementById(`${id}-edit-setup`).value
    const punchline = document.getElementById(`${id}-edit-punchline`).value

    displayLoader()

    await service.updateJoke(id, setup, punchline)
    await templates.registerJokesPartial(await service.getJokes())
    await updateContent()
})

// Listen for clicks on edit button
listenForClicks(target => target.matches('.joke-edit'), async target => {
    const id = target.dataset.id

    const classListActions = document.getElementById(`${id}-edit-actions`).classList
    const classListSave = document.getElementById(`${id}-save`).classList

    if (classListActions.contains('hidden')) {
        classListActions.remove('hidden')
        classListSave.remove('hidden')
    } else {
        classListActions.add('hidden')
        classListSave.add('hidden')
    }
})

onload = async () => {
    const [jokes, services] = await Promise.all([service.getJokes(), service.getOtherSites()])

    await templates.registerPartials(jokes, services)
    await updateContent()
}
