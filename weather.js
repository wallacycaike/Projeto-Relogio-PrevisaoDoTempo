const weather = document.querySelector(".weather"),
  inputPart = weather.querySelector(".input-part"),
  infoTxt = inputPart.querySelector(".info-txt"),
  inputField = inputPart.querySelector("input"),
  locationBtn = inputPart.querySelector("button"),
  wIcon = weather.querySelector(".weather-part img"),
  arrowBack = weather.querySelector("header i");

let api;

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
      wIcon.src = "images/weather-icons/clear.svg";
    } else if (id >= 200 && id <= 232) {
      wIcon.src = "images/weather-icons/storm.svg";
    } else if (id >= 600 && id <= 622) {
      wIcon.src = "images/weather-icons/snow.svg";
    } else if (id >= 701 && id <= 781) {
      wIcon.src = "images/weather-icons/haze.svg";
    } else if (id >= 801 && id <= 804) {
      wIcon.src = "images/weather-icons/cloud.svg";
    } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
      wIcon.src = "images/weather-icons/rain.svg";
    }

    weather.querySelector(".temp .numb").innerText = Math.floor(temp);
    weather.querySelector(".weather-content").innerText = description;
    weather.querySelector(".location span").innerText = `${city}, ${country}`;
    weather.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
    weather.querySelector(".humidity span").innerText = `${humidity}%`;

    inputField.value = "";
    infoTxt.classList.remove("pending", "error");
    weather.classList.add("active");
    // console.log(info);
  }
}

arrowBack.addEventListener("click", () => {
  weather.classList.remove("active");
});
