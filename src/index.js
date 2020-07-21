document.addEventListener("DOMContentLoaded", () => {
  const PUP_URL = 'http://localhost:3000/pups'
  const dogBar = document.getElementById('dog-bar')
  fetch(PUP_URL)
  .then(response => response.json())
  .then(data => displayPups(data))
  .catch(error => console.log(error))

  function displayPups(data) {
    dogBar.innerHTML = ""
    data.forEach(pup => {
      pupSpan = document.createElement('span')
      pupSpan.textContent = pup.name
      pupSpan.dataset.goodness = pup.isGoodDog
      dogBar.appendChild(pupSpan)
      pupSpan.addEventListener("click", () => {
        displayPupInfo(pup)
      });
    });
  }
    
  function displayPupInfo(pup) {
    const pupInfo = document.getElementById('dog-info')
    pupInfo.innerHTML = ""
    const pupImg = document.createElement('img')
    const pupH2 = document.createElement('h2')
    const pupButton = document.createElement('button')
    pupImg.src = pup.image
    pupH2.textContent = pup.name
    determinePupGoodness(pup, pupButton)
    pupInfo.appendChild(pupImg)
    pupInfo.appendChild(pupH2)
    pupInfo.appendChild(pupButton)
    pupButton.addEventListener("click", (e) => {
      toggleGoodness(pup)
    });
  }

    function toggleGoodness(pup) {
      let newInfo = {isGoodDog: !pup.isGoodDog}
      let configObj =  {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(newInfo)
      }
      fetch(PUP_URL+`/${pup.id}`, configObj)
      .then(response => response.json())
      .then(pup => displayPupInfo(pup))

    }

    function determinePupGoodness (pup, pupButton) {
      if (pup.isGoodDog === true) {
        pupButton.textContent = 'Good Dog!'
      } else if (pup.isGoodDog === false) {
        pupButton.textContent = 'Bad Dog!'
      }
    }

    const goodDogFilter = document.getElementById('good-dog-filter')
    goodDogFilter.addEventListener("click", () => {
      console.log(`hit: ${goodDogFilter.textContent}`)
      if(goodDogFilter.textContent === "Filter good dogs: OFF"){
        goodDogFilter.textContent = "Filter good dogs: ON"
        fetch(PUP_URL)
        .then(response => response.json())
        .then(data => displayPups(data.filter(pup => pup.isGoodDog === true)))
        .catch(error => console.log(error))
      } else {
        goodDogFilter.textContent = "Filter good dogs: OFF"
        fetch(PUP_URL)
        .then(response => response.json())
        .then(data => displayPups(data))
        .catch(error => console.log(error))
      }
    });

});