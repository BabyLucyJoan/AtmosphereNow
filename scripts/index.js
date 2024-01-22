const accessToken = localStorage.getItem("accessToken");

if (!accessToken) {
  window.location.href = "./pages/index.html";
}

const apiKey = "99474fc85fc296eb2440fd77efa7d371";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const searchBox = document.querySelector(".search input");
console.log(searchBox.value);
const searchBtn = document.querySelector(".search button");

async function checkWeather(city) {
  if (!city) {
    console.error("Please enter a city name");
    return;
  }

  try {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML =
      Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
}

searchBtn.addEventListener("click", () => {
  console.log("City value:", searchBox.value);
  checkWeather(searchBox.value);
});
