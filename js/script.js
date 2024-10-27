const apikey = "f93f65c4b676bc267a0fbcdcb802da4b";
        const searchForm = document.querySelector("#search-form");
        const todayWeather = document.querySelector(".today");
        const forecast = document.querySelector(".forecast");
        const cityInput = document.querySelector("#city-input");
        const historyContainer = document.querySelector(".history");
        
        let searchHistory = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];

        function updateSearchHistory(city) {
            if (!searchHistory.includes(city)) {
                searchHistory.unshift(city);
                if (searchHistory.length > 5) {
                    searchHistory.pop();
                }
                localStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistory));
                displaySearchHistory();
            }
        }

        function displaySearchHistory() {
            historyContainer.innerHTML = '';
            searchHistory.forEach(city => {
                const button = document.createElement('button');
                button.textContent = city;
                button.addEventListener('click', () => search(city));
                historyContainer.appendChild(button);
            });
        }

        function search(city) {
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apikey}`)
                .then(response => response.json())
                .then(weatherData => {
                    updateSearchHistory(city);
                    const todayDate = new Date(weatherData.dt * 1000).toLocaleDateString();
                    
                    const weatherEl = `
                        <h2>${weatherData.name} (${todayDate}) 
                            <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" alt="weather icon" style="width: 50px; height: 50px;"/>
                        </h2>
                        <div class="weather-info">
                            <p>Temperature: ${Math.round(weatherData.main.temp)}°F</p>
                            <p>Humidity: ${weatherData.main.humidity}%</p>
                            <p>Wind Speed: ${weatherData.wind.speed} MPH</p>
                        </div>
                    `;
                    todayWeather.innerHTML = weatherEl;

                    const lat = weatherData.coord.lat;
                    const lon = weatherData.coord.lon;
                    weeklyForecast(lat, lon);
                })
                .catch(error => {
                    console.error('Error:', error);
                    todayWeather.innerHTML = '<p style="color: red;">City not found. Please try again.</p>';
                });
        }

        function weeklyForecast(lat, lon) {
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apikey}`)
                .then(response => response.json())
                .then(fiveDayData => {
                    const fiveDayArray = fiveDayData.list.filter(day => day.dt_txt.includes("12:00:00"));
                    
                    forecast.innerHTML = fiveDayArray.map(day => {
                        const date = new Date(day.dt * 1000).toLocaleDateString();
                        return `
                            <div class="forecast-card">
                                <div class="forecast-date">${date}</div>
                                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="weather icon"/>
                                <p>Temp: ${Math.round(day.main.temp)}°F</p>
                                <p>Wind: ${day.wind.speed} MPH</p>
                                <p>Humidity: ${day.main.humidity}%</p>
                            </div>
                        `;
                    }).join('');
                });
        }

        searchForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const city = cityInput.value.trim();
            if (city) {
                search(city);
                cityInput.value = '';
            }
        });

        // Display search history on page load
        displaySearchHistory();

        // If there's search history, show the last searched city's weather
        if (searchHistory.length > 0) {
            search(searchHistory[0]);
        }