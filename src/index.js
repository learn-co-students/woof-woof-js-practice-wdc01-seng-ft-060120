document.addEventListener("DOMContentLoaded", () => {
    const dogSpanDiv = document.getElementById("dog-bar")
    const urlPre = "http://localhost:3000/"
    const dogSummaryDiv = document.getElementById("dog-info")
    const filterButton = document.getElementById("good-dog-filter")
    const filterDiv = document.getElementById("filter-div")

    dogSummaryDiv.addEventListener("click", (e) => {
        console.dir(e.target.innerText)
        if (e.target.matches("#good-dog-button")){
            if(e.target.innerText === "Good Dog!") {
                toggleGoodDog(e.target.dataset.id, true)
            }
            else{
                toggleGoodDog(e.target.dataset.id, false)
            }

        }
    })

    filterDiv.addEventListener("click", (e) => {
        console.log(e.target.innerText === "Filter good dogs: ON")
        let badDogs = document.querySelectorAll(`[data-good-dog="false"]`)
        if (e.target.innerText === "Filter good dogs: OFF"){
            
            for(const dog of badDogs){
                dog.classList.add("hidden")
            }
            e.target.innerText= "Filter good dogs: ON"
        }
        else {
            console.log(e.target)
            for(const dog of badDogs){
                dog.classList.remove("hidden")
            } 
            e.target.innerText= "Filter good dogs: OFF"
        }

    })

    const fetchDogs = () => {
        fetch(`${urlPre}pups/`)
        .then(response => response.json())
        .then(pups => {
            for(const dog of pups) {
                renderDogSpan(dog)
            }
        })
    }

    const fetchDog = (id) => {
        fetch(`${urlPre}pups/${id}`)
        .then(response => response.json())
        .then(pup => {
            dogSummaryDiv.innerHTML = ""
            renderDogInfo(pup)
        })
    }

    const renderDogSpan = (dog) => {
        let span = document.createElement("span")
        span.innerText = dog.name
        span.dataset.goodDog = dog.isGoodDog
        span.dataset.id = dog.id
        dogSpanDiv.appendChild(span)
    }

    const renderDogInfo = (pup) => { 
        let img = document.createElement("img")
        img.src=pup.image
        let h2 = document.createElement("h2")
        h2.innerText = pup.name
        let button = document.createElement("button")
        button.id = "good-dog-button"
        button.dataset.id = pup.id
        if (pup.isGoodDog) {
            button.innerText = "Good Dog!"
        }
        else {
            button.innerText = "Bad Dog!"
        }
        dogSummaryDiv.appendChild(img)
        dogSummaryDiv.appendChild(h2)
        dogSummaryDiv.appendChild(button)
    }

    const toggleGoodDog = (id, currentStatus) => {
        
        let dogObj = {
            "isGoodDog": !currentStatus
        }
  
        let dogConfig = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(dogObj)
        }
       
        fetch(`${urlPre}pups/${id}`, dogConfig)
        .then(response => response.json())
        .then(dog => {
            dogSummaryDiv.innerHTML = ""
            let span = document.querySelector(`[data-id="${id}"]`)
            span.dataset.goodDog = dog.isGoodDog
            console.log(span)
            renderDogInfo(dog)
        })
 
        
    }

    dogSpanDiv.addEventListener("click", (e) =>{
        if (e.target.matches("span")){
            fetchDog(e.target.dataset.id)
        }
    })

    fetchDogs()

})