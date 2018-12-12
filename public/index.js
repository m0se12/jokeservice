onload = async () => {

    //const baseUrl = "http://localhost:8010";
    const baseUrl = "https://badjokes.herokuapp.com";

    const [template, ownjokesFetched, othersitesFetched, allOtherJokesFetched] = await Promise.all(
        [
            fetch('/index.hbs'),
            fetch(baseUrl+"/api/jokes"),
            fetch(baseUrl+"/api/othersites"),
            fetch(baseUrl+"/api/allOtherJokes")
        ]);
    const [templateText, ownjokes, otherSources, otherjokes] =
        await Promise.all([
            template.text(),
            ownjokesFetched.json(),
            othersitesFetched.json(),
            allOtherJokesFetched.json()
        ]);

    const compiledTemplate = Handlebars.compile(templateText);

    console.log(ownjokes)
    console.log(otherSources)
    console.log(otherjokes)

    document.body.innerHTML = compiledTemplate({ownjokes, otherSources, otherjokes})
};
