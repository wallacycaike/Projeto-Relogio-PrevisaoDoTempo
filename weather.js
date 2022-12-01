const weather = document.querySelector(".weather"),
  inputPart = weather.querySelector(".input-part"),
  infoTxt = inputPart.querySelector(".info-txt"),
  inputField = inputPart.querySelector("input"),
  locationBtn = inputPart.querySelector("button"),
  wIcon = weather.querySelector(".weather-part img"),
  arrowBack = weather.querySelector("header i"),
  favStar = weather.querySelector("#fav-star"),
  favListIcon = weather.querySelector("#list-icon"),
  favList = weather.querySelector(".fav-list"),
  favoriteCity = weather.querySelectorAll(".fav-list li");

let api;
let favCities = JSON.parse(localStorage.getItem("fav-cities"));

inputField.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && inputField.value !== "") {
    requestApi(inputField.value);
  }
});

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Seu navegador não suporta geolocation api.");
  }
});

function onSuccess(position) {
  const { latitude, longitude } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=fa9328957fd6fd6daadc4032ed11ad16`;
  fetchData();
}

function onError(error) {
  infoTxt.innerText = error.message;
  infoTxt.classList.add("error");
}

function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=fa9328957fd6fd6daadc4032ed11ad16`;
  fetchData();
}

function fetchData() {
  infoTxt.innerText = "Obtendo detalhes do tempo...";
  infoTxt.classList.add("pending");
  fetch(api)
    .then((response) => response.json())
    .then((result) => weatherDetails(result));
}

function weatherDetails(info) {
  if (info.cod === "404") {
    infoTxt.classList.replace("pending", "error");
    infoTxt.innerText = `${inputField.value} não é um nome de cidade válido`;
  } else {
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { feels_like, humidity, temp } = info.main;

    if (id === 800) {
      wIcon.src = "/images/icons-weather/clear.png";
    } else if (id >= 200 && id <= 232) {
      wIcon.src = "/images/icons-weather/storm.png";
    } else if (id >= 600 && id <= 622) {
      wIcon.src = "/images/icons-weather/snow.png";
    } else if (id >= 701 && id <= 781) {
      wIcon.src = "/images/icons-weather/haze.png";
    } else if (id >= 801 && id <= 804) {
      wIcon.src = "/images/icons-weather/cloud.png";
    } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
      wIcon.src = "/images/icons-weather/rain.png";
    }

    weather.querySelector(".temp .numb").innerText = Math.floor(temp);
    weather.querySelector(".weather-content").innerText = description;
    weather.querySelector(".location span").innerText = `${city}, ${country}`;
    weather.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
    weather.querySelector(".humidity span").innerText = `${humidity}%`;

    inputField.value = "";
    infoTxt.classList.remove("pending", "error");
    weather.classList.add("active");
    favList.classList.add("secondary");

    if (favCities) {
      checkCity(city);
    }
  }
}

arrowBack.addEventListener("click", () => {
  favList.classList.remove("show");
  favList.classList.remove("secondary");
  weather.classList.remove("active");
});

favStar.addEventListener("click", () => {
  showFavCities();
  fetch(api)
    .then((response) => response.json())
    .then((result) => addOrRemoveCity(result.name));
});

function checkCity(cityName) {
  if (favCities.includes(cityName)) {
    favStar.classList.remove("fa-regular");
    favStar.classList.add("fa-solid");
  } else {
    favStar.classList.remove("fa-solid");
    favStar.classList.add("fa-regular");
  }
}

function showFavCities() {
  if (favCities) {
    if (favCities.length === 0) {
      favList.innerHTML = `<li>Nenhuma cidade salva.</li>`;
      favList.classList.add("warning");
    } else {
      favList.classList.remove("warning");
      let li = "";
      for (let i = 0; i < favCities.length; i++) {
        li += `<li onclick="showFavCityInfo(this)">${favCities[i]}</li>`;
        favList.innerHTML = li;
      }
    }
  } else {
    favList.innerHTML = `<li>Nenhuma cidade salva.</li>`;
    favList.classList.add("warning");
  }
}

function addOrRemoveCity(cityName) {
  if (favCities) {
    if (favCities.includes(cityName)) {
      const cityId = favCities.indexOf(cityName);
      favStar.classList.remove("fa-solid");
      favStar.classList.add("fa-regular");
      favCities.splice(cityId, 1);
      localStorage.setItem("fav-cities", JSON.stringify(favCities));
    } else {
      favStar.classList.remove("fa-regular");
      favStar.classList.add("fa-solid");
      favCities.push(cityName);
      localStorage.setItem("fav-cities", JSON.stringify(favCities));
    }
  } else {
    favStar.classList.remove("fa-regular");
    favStar.classList.add("fa-solid");
    favCities = [];
    favCities.push(cityName);
    localStorage.setItem("fav-cities", JSON.stringify(favCities));
  }
}

favListIcon.addEventListener("click", () => {
  showFavCities();
  favList.classList.add("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName !== "I") {
      favList.classList.remove("show");
    }
  });
});

function showFavCityInfo(city) {
  requestApi(city.textContent);
}
