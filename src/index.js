document.addEventListener('DOMContentLoaded', () => {
    const baseURL = 'http://localhost:3000/'
    const pupsURL = baseURL + 'pups/'

    const dogBar = document.getElementById('dog-bar')
    const dogInfo = document.getElementById('dog-info')
    const dogFilter = document.getElementById('good-dog-filter')

    function fetchPuppies() {
        fetch(pupsURL)
            .then(resp => resp.json())
            .then(data => renderAllDogs(data))
    }

    function renderAllDogs(puppies) {
        puppies.forEach(pup => renderDogBar(pup))
    }

    function renderDogBar(pup) {
        const span = document.createElement('span')
        span.textContent = pup.name
        span.dataset.name = pup.name
        dogBar.appendChild(span)

        span.addEventListener('click', () => {
            renderDog(pup)
        })
    }

    function renderDog(pup) {
        dogInfo.innerHTML = ''

        const img = document.createElement('img')
        img.src = pup.image
        dogInfo.appendChild(img)

        const h2 = document.createElement('h2')
        h2.textContent = pup.name
        dogInfo.appendChild(h2)

        const button = document.createElement('button')
        button.textContent = pup.isGoodDog ? 'Goog Dog!' : 'Bad Dog!'
        dogInfo.appendChild(button)

        addListener(pup, button)
    }

    function addListener(pup, button) {
        // The button's text should change from Good to Bad or Bad to Good
        // The corresponding pup object in the database should be updated to reflect the new isGoodDog value
        button.addEventListener('click', () => {
            const configurationObject = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    isGoodDog: !pup.isGoodDog,
                }),
            }

            fetch(pupsURL + pup.id, configurationObject)
                .then(resp => resp.json())
                .then(dog => {
                    renderDog(dog)
                    if (dog.isGoodDog) {
                        renderDogBar(dog)
                    } else {
                        const dogSpan = document.querySelector(`span[data-name="${dog.name}"]`)
                        dogSpan.remove()
                    }
                })
                .catch(err => console.log(err))
        })
    }

    const filterStatus = {
        'Filter good dogs: ON': 'Filter good dogs: OFF',
        'Filter good dogs: OFF': 'Filter good dogs: ON',
    }

    function filterPuppies() {
        dogFilter.addEventListener('click', () => {
            if (dogFilter.textContent === 'Filter good dogs: OFF') {
                dogBar.innerHTML = ''

                fetch(pupsURL)
                    .then(resp => resp.json())
                    .then(data => {
                        const filteredDogs = data.filter(element => element.isGoodDog == true)
                        renderAllDogs(filteredDogs)
                        dogFilter.textContent = filterStatus[dogFilter.textContent]
                    })
                    .catch(err => console.log(err))
            } else {
                dogBar.innerHTML = ''
                fetchPuppies()
                dogFilter.textContent = filterStatus[dogFilter.textContent]
            }
        })
    }

    fetchPuppies()
    filterPuppies()
})
