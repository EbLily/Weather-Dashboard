const apikey = "f93f65c4b676bc267a0fbcdcb802da4b"
const searchbtn = document.querySelector("#searchbtn");
const todayWeather = document.querySelector(".today");
const forcast  =     document.querySelector(".forcast");
const cityinput = document.querySelector("#city-input");

function search(city){
    console.log(city)   
    fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apikey}`
    ).then(function(response){ 
        return response.json()
    }).then(function(weatherdata){
        console.log(weatherdata)
        const todayDate = new Date(weatherdata.dt * 1000 ).toLocaleDateString()
        
        console.log(todayDate)
       
        const weatherEl = `
        <div>
        <img src="https://openweathermap.org/img/wn/${weatherdata.weather[0].icon}.png"/>
        <h2>${weatherdata.name}</h2>
        <span>${todayDate}</span>
        <p>temp: ${weatherdata.main.temp}</p>
        <p>humidity: ${weatherdata.main.humidity}%</p>
        <p>wind: ${weatherdata.wind.speed}</p>
        </div>
        
        `;
        todayWeather.innerHTML = weatherEl
        const lat = weatherdata.coord.lat
        const lon = weatherdata.coord.lon
       
        weeklyForcast(lat,lon)
    })

}
function weeklyForcast(lat,lon){
   fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apikey}`
   )
   .then(function(response){ 
    return response.json()
   }).then(function(fivedaydata){
    
    const fivedayarray = fivedaydata.list.filter(day=>day.dt_txt.includes("12:00:00"))
    let forecastcard = ""
    for(let day of fivedayarray){
        console.log(day)
        const todayDate = new Date(day.dt * 1000 ).toLocaleDateString()
        forecastcard +=`
        <div>
        <p>${todayDate}</p>
        <p>temp: ${day.main.temp}</p>
        <p>humidity: ${day.main.humidity}</p>
        <p>wind: ${day.wind.speed}</p>
        
       
        </div>
        `
        forcast.innerHTML=forecastcard
    }
   })
}

searchbtn.addEventListener("click",function(event){
event.preventDefault()
const city = cityinput.value.trim()
search(city)

})