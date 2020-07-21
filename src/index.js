const DOGS_PATH = "http://localhost:3000/pups/"

document.addEventListener("DOMContentLoaded",() =>
{
  document.getElementById("good-dog-filter").dataset.on = "false";
  fetchDogs();

  document.addEventListener("click",e => clickHandler(e))
})

const clickHandler = (e) =>
{
  const tgt = e.target;

  if(tgt.className === 'dog-span')
    fetchDog(tgt.dataset.id);
  else if (tgt.className === 'good-bad-button')
    toggleGood(tgt.dataset.id,tgt.dataset.good);
  else if (tgt.id === "good-dog-filter")
    filterGoodDogs(tgt)
}

const filterGoodDogs = (ele) =>
{
  if (ele.children[0].innerText === "ON")
  {
    ele.children[0].innerText = "OFF"
    fetchDogs();
  }
  else
  {
    ele.children[0].innerText = "ON"
    fetchDogs(true);
  }

}

const toggleGood = (dogId,good) =>
{
  let configObj =
  {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(
      {
        isGoodDog: !(good === 'true')
      }
    )
  };
  fetch(DOGS_PATH + dogId,configObj)
  .then(resp => resp.json())
  .then(json => displayDogInfo(json));
}

const fetchDog = (dogId) =>
{
  fetch(DOGS_PATH + dogId)
  .then(resp => resp.json())
  .then(dog => displayDogInfo(dog))
  .catch(error => console.log(error.message));
}

const displayDogInfo = (dogJson) =>
{
  const infoDiv = document.getElementById('dog-info');
  infoDiv.innerHTML = "";

  const elements = ["img","h2","button"].map((txt) => document.createElement(txt))
  elements.forEach((el) => infoDiv.append(el));


  elements[0].src = dogJson.image;
  elements[1].innerText = dogJson.name;
  elements[2].innerText = dogJson.isGoodDog ? "Good Dog!" : "Bad Dog!";
  elements[2].className = "good-bad-button"
  elements[2].dataset.good = dogJson.isGoodDog;
  elements[2].dataset.id = dogJson.id

}

const fetchDogs = (onlyGood = false) =>
{
  const path = onlyGood ? (DOGS_PATH + "?isGoodDog=true") : DOGS_PATH
  fetch(path)
  .then(resp => resp.json())
  .then(json => addDogs(json))
  .catch(error => console.log(error));
}

const addDogs = (dogs) =>
{
  const dogBar = document.getElementById('dog-bar');
  dogBar.innerHTML = "";

  dogs.forEach((dog) => addDog(dog,dogBar));
}

const addDog = (dog,div) =>
{
  const span = document.createElement('span');
  span.className = 'dog-span'
  span.innerText = dog.name;
  span.dataset.id = dog.id;
  div.append(span);
}