const displayClock = document.getElementById("displayClock");
const displayDay = document.getElementById("displayDay");
displayClock.addEventListener("load", clock());
displayDay.addEventListener("load", clock());

function clock() {
  const days = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-Feira",
    "Sábado",
  ];

  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const date = new Date();
  const dayMonth = date.getDate();
  const dayWeek = date.getDay();
  const month = date.getMonth();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  displayDay.innerText = `Hoje é ${days[dayWeek]}, ${dayMonth} de ${months[month]}.`;
  displayClock.innerText = `Horário: ${hours}:${minutes} e ${seconds} segundos.`;
  setTimeout(clock, 1);
}
