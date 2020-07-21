document.addEventListener('DOMContentLoaded', start);
const URL = 'http://localhost:3000/pups';

const fetchDogs = () => {
    fetch('http://localhost:3000/pups')
    .then(resp => resp.json())
    .then(dogs => dogs.forEach(dog => renderDog(dog)))
}

const renderDog = (dog) => {
    const dogBar = document.querySelector('#dog-bar');
    let span = document.createElement('span');
    span.id = `${dog.id}`;
    span.className = "dog";
    span.dataset.id = `${dog.id}`;
    span.innerText = `${dog.name}`;
    dogBar.appendChild(span);
    span.addEventListener('click', () => {
        featureDog(dog);
    })
}

const featureDog = (dog) => {
    const dogInfo = document.querySelector('#dog-info');
    dogInfo.innerText = '';

    let img = document.createElement('img');
    img.src = `${dog.image}`;

    let h2 = document.createElement('h2');
    h2.innerHTML = `${dog.name}`;

    let button = document.createElement('button');
    button.className = 'goodBad';
    if(dog.isGoodDog === true){
        button.innerHTML = "Good Dog!";
    } else {
        button.innerHTML = "Bad Dog!";
    }
    button.addEventListener('click', () => {
        changeDog(dog, button);
    })

    dogInfo.appendChild(img);
    dogInfo.appendChild(h2);
    dogInfo.appendChild(button);
}

const changeDog = (dog, button) => {
    let dogData = {
        isGoodDog: !dog.isGoodDog
    }

    fetch(`${URL}/${dog.id}`, {
      method : 'PATCH',
      headers: {'content-type' : 'application/json', 'accept' : 'application/json'},
      body : JSON.stringify(dogData)
    })
    .then(response => response.json())
    .then(dog => buttonStatus(dog, button));
}

const buttonStatus = (dog, button) => {
    if (dog.isGoodDog == true) {
        button.innerText = "Good Dog!";
    } else {
        button.innerText = "Bad Dog!";
    };     
}


function start(){
    fetchDogs();
}