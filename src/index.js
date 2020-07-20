document.addEventListener('DOMContentLoaded', () => {
    const BASE_URL = 'http://localhost:3000/';
    const DOGS_URL = BASE_URL + 'pups/';
    const dogBar = document.querySelector('#dog-bar');
    const dogInfo = document.querySelector('#dog-info');
    const goodDogFilter = document.querySelector('#good-dog-filter');
    const getOptions = {
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        }
    }

    const getAllDogs = (status=false) => {
        fetch(DOGS_URL, getOptions)
        .then(response => response.json())
        .then(dogs => postAllDogs(dogs, status))
    }

    const getOneDog = (dogId) => {
        dogInfo.innerText = null;
        fetch(DOGS_URL + dogId, getOptions)
        .then(response => response.json())
        .then(dog => postDogToInfo(dog))
    }

    const putDogStatus = (dogId, status) => {
        const putOptions = {
            method: "PATCH",
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({
                isGoodDog: status
            })
        }
        fetch(DOGS_URL + dogId, putOptions)
        .then(response => response.json())
        .then(dog => updateDogStatusButton(dog))
    }

    const postAllDogs = (dogs, status) => {
        dogs.forEach(dog => postDogToBar(dog, status));
    }

    const showDogInfo = (e) => {
        const dogId = e.target.dataset.id;
        getOneDog(dogId);
    }

    const postDogToBar = (dog, status=false) => {
        if (status === false) { // Posting all dogs
            let span = document.createElement('span');
            span.innerText = dog.name;
            span.dataset.id = dog.id;

            dogBar.appendChild(span);
            span.addEventListener('click', showDogInfo);
        } else if (status === 'Good' && dog.isGoodDog === true) {
            let span = document.createElement('span');
            span.innerText = dog.name;
            span.dataset.id = dog.id;

            dogBar.appendChild(span);
            span.addEventListener('click', showDogInfo);
        } else if (status === 'Bad' && dog.isGoodDog === false) {
            let span = document.createElement('span');
            span.innerText = dog.name;
            span.dataset.id = dog.id;

            dogBar.appendChild(span);
            span.addEventListener('click', showDogInfo);
        }
    }

    const getNewDogStatus = (e) => {
        const dogId = e.target.dataset.id;
        let status = (e.target.innerText === "Good Dog!") ? false : true;
        putDogStatus(dogId, status);
    }

    const updateDogStatusButton = (dog) => {
        let button = document.querySelector(`button[data-id='${dog.id}']`);
        button.innerText = (dog.isGoodDog) ? "Good Dog!" : "Bad Dog!"
    }

    const postDogToInfo = (dog) => {
        let img = document.createElement('img');
        img.src = dog.image;
        dogInfo.appendChild(img);

        let h2 = document.createElement('h2');
        h2.innerText = dog.name;
        dogInfo.appendChild(h2);

        let button = document.createElement('button');
        button.addEventListener('click', getNewDogStatus);
        button.dataset.id = dog.id;
        button.innerText = (dog.isGoodDog) ? "Good Dog!" : "Bad Dog!"
        dogInfo.appendChild(button);
    }

    const filterDogs = (e) => {
        dogBar.innerText = null;
        if (goodDogFilter.innerText.includes('OFF')) {
            goodDogFilter.innerText = "Filter good dogs: ON"
            getAllDogs("Good");
        } else {
            goodDogFilter.innerText = "Filter good dogs: OFF"
            getAllDogs();
        }
    }

    goodDogFilter.addEventListener('click', filterDogs)

    getAllDogs();
})