document.addEventListener("DOMContentLoaded", function () {
    let lastWeatherData;
    let lastForecastData;
	let searchedCities = [];

    // Function to get weather data
    function getWeather() {
        const apiKey = "0686f0090499c8914d7528f9ee83b8de";
        const city = document.getElementById("cityInput").value;
        const weatherApiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
        const forecastApiUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

    // Fetch current weather data
    fetch(weatherApiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                lastWeatherData = data;
                displayWeatherData();
                if (!searchedCities.includes(city)) {
                    searchedCities.push(city);
                }

				localStorage.setItem("searchedCities", JSON.stringify(searchedCities));

                updateSearchedCitiesList();
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
            });

    // Fetch 5-day forecast data
    fetch(forecastApiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                lastForecastData = data;
                displayForecastData();
            })
            .catch(error => {
                console.error("Error fetching forecast data:", error);
            });	
    }

	 document.getElementById("cityInput").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            getWeather();
        }
    });

	// Function to display daily weather data
	function displayWeatherData() {
		const column2Element = document.querySelector(".column-2");

		if (lastWeatherData) {
			const cityName = lastWeatherData.name;
			const weatherIconCode = lastWeatherData.weather[0].icon;

			const today = new Date();
			const formattedToday = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;

			const html = `
            <h2>${cityName} ${formattedToday} <img src="http://openweathermap.org/img/w/${weatherIconCode}.png" alt="Weather Icon"></h2>
            <p>Temp: ${lastWeatherData.main.temp} F</p>
			 <p>Wind: ${lastWeatherData.wind.speed}mph</p>
            <p>Humidity: ${lastWeatherData.main.humidity}%</p>
        `;

			column2Element.innerHTML = html;
			column2Element.style.display = "block"; // Show the box
		} else {
			// If no data is available, leave .column-2 empty
			column2Element.innerHTML = "";
			column2Element.style.display = "none"; // Hide the box
		}
	}

	// Function to display 5-day forcast data
	function displayForecastData() {
		const column3Element = document.getElementById("forecastData");

		if (lastForecastData) {
		
			const forecasts = lastForecastData.list.filter((_, index) => index % 8 === 0).slice(0, 5);

			let html = "<h2>Five Day Forecast:</h2>"; 

			html += '<div class="row">';

			forecasts.forEach((forecast, index) => {
				const date = new Date(forecast.dt * 1000);
				const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
				const weatherIconCode = forecast.weather[0].icon;

				html += `
                <div class="col">
                    <h5>${formattedDate}</h5>
                    <img src="http://openweathermap.org/img/w/${weatherIconCode}.png" alt="Weather Icon">
                    <p>Temp: ${forecast.main.temp} F</p>
                    <p>Wind: ${forecast.wind.speed} mph</p>
                    <p>Humidity: ${forecast.main.humidity}%</p>
                </div>`;
			});

			html += '</div>'; 


			column3Element.innerHTML = html;
			column3Element.style.display = "block"; // Show the box
		} else {
	
			column3Element.innerHTML = "";
			column3Element.style.display = "none"; // Hide the box
		}
	}

	// Function to display previously search cities and save to local stoage
	function updateSearchedCitiesList() {
		const historyListElement = document.getElementById("searchedCitiesList");

		historyListElement.innerHTML = "";
		
		const lastFiveCities = searchedCities.slice(-5);
		lastFiveCities.forEach(city => {
			const listItem = document.createElement("li");
			listItem.textContent = city;
			
			listItem.addEventListener("click", function () {
	
				document.getElementById("cityInput").value = city;
				getWeather();
			});

			historyListElement.appendChild(listItem);
		});
	}
	
    document.getElementById("getWeatherButton").addEventListener("click", getWeather);

    const storedCities = localStorage.getItem("searchedCities");
    if (storedCities) {
        searchedCities = JSON.parse(storedCities);
       
        updateSearchedCitiesList();
    }
});

