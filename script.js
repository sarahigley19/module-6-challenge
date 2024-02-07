document.addEventListener("DOMContentLoaded", function () {
	// Variables to store last fetched weather and forecast data
	let lastWeatherData;
	let lastForecastData;

	// Array to store previously searched cities
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
				// Save the weather data in the variable
				lastWeatherData = data;

				// Process the weather data as needed
				displayWeatherData();

				// Add the city to the searchedCities array
				if (!searchedCities.includes(city)) {
					searchedCities.push(city);
				}

				// Save the searchedCities array to local storage
				localStorage.setItem("searchedCities", JSON.stringify(searchedCities));

				// Update the displayed list of searched cities
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
				// Save the forecast data in the variable
				lastForecastData = data;

				// Process the forecast data as needed
				displayForecastData();
			})
			.catch(error => {
				console.error("Error fetching forecast data:", error);
			});
	}

	function displayWeatherData() {
		const column2Element = document.querySelector(".column-2");

		// Check if there is any data to display
		if (lastWeatherData) {
			// Extract city name
			const cityName = lastWeatherData.name;

			// Get today's date
			const today = new Date();
			const formattedToday = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;

			// Create HTML to display weather data (customize as needed)
			const html = `
            <h2>${cityName} ${formattedToday}</h2>
            <p>Temperature: ${lastWeatherData.main.temp} F</p>
            <p>Humidity: ${lastWeatherData.main.humidity}%</p>
            <p>Weather: ${lastWeatherData.weather[0].description}</p>
        `;

			// Set the HTML content to display the weather data within .column-2
			column2Element.innerHTML = html;
			column2Element.style.display = "block"; // Show the box
		} else {
			// If no data is available, leave .column-2 empty
			column2Element.innerHTML = "";
			column2Element.style.display = "none"; // Hide the box
		}
	}

	function displayForecastData() {
		const column3Element = document.getElementById("forecastData");

		// Check if there is any forecast data to display
		if (lastForecastData) {
			// Extract relevant forecast information for 5 days (every 8th entry for a 3-hour interval forecast)
			const forecasts = lastForecastData.list.filter((_, index) => index % 8 === 0).slice(0, 5);

			// Create HTML to display forecast data (temperature, wind, humidity) with dates including the year
			let html = "<h2>Five Day Forecast:</h2>"; // Add the label

			html += '<div class="row">';

			forecasts.forEach((forecast, index) => {
				const date = new Date(forecast.dt * 1000);
				const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

				html += `
            <div class="col">
                <h5>${formattedDate}</h5>
                <p>Temperature: ${forecast.main.temp} F</p>
                <p>Wind Speed: ${forecast.wind.speed} mph</p>
                <p>Humidity: ${forecast.main.humidity}%</p>
            </div>`;
			});

			html += '</div>'; // Close the row div

			// Set the HTML content to display the forecast data within .column-3
			column3Element.innerHTML = html;
			column3Element.style.display = "block"; // Show the box
		} else {
			// If no data is available, leave .column-3 empty
			column3Element.innerHTML = "";
			column3Element.style.display = "none"; // Hide the box
		}
	}

	function updateSearchedCitiesList() {
		// Retrieve the container for displaying the list of searched cities
		const historyListElement = document.getElementById("searchedCitiesList");

		// Clear the existing content
		historyListElement.innerHTML = "";

		// Append the last five cities to the list
		const lastFiveCities = searchedCities.slice(-5);
		lastFiveCities.forEach(city => {
			const listItem = document.createElement("li");
			listItem.textContent = city;
			historyListElement.appendChild(listItem);
		});
	}

	// Add an event listener to the button
	document.getElementById("getWeatherButton").addEventListener("click", getWeather);

	// Retrieve previously searched cities from local storage on page load
	const storedCities = localStorage.getItem("searchedCities");
	if (storedCities) {
		searchedCities = JSON.parse(storedCities);
		// Update the displayed list of searched cities
		updateSearchedCitiesList();
	}
});

