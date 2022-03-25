// obtain csrf token
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// used for email input fields
function validateEmail(email) {
  return email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

async function postJSONFetch(url, body, csrftoken = null) {
  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Accept", "application/json");
  if (csrftoken != null) {
    headers.append("X-CSRFToken", csrftoken);
  }
  body = JSON.stringify(body);
  let response = await fetch(url, { headers, body, method: "POST" });
  let final_data = await response.json();
  final_data._status = response.status;
  return final_data;
}

async function getJSONFetch(url, params, csrftoken = null) {
  let headers = new Headers();
  headers.append("Accept", "application/json");
  if (csrftoken != null) {
    headers.append("X-CSRFToken", csrftoken);
  }
  // handle json GET requests
  if (params.json !== undefined) {
    params.json = JSON.stringify(params.json);
  }
  url = new URL(url, document.location);
  url.search = new URLSearchParams(params).toString();
  let response = await fetch(url, { headers, method: "GET" });
  let final_data = await response.json();
  final_data._status = response.status;
  return final_data;
}

async function deleteJSONFetch(url, body, csrftoken = null) {
  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Accept", "application/json");
  if (csrftoken != null) {
    headers.append("X-CSRFToken", csrftoken);
  }
  body = JSON.stringify(body);
  let response = await fetch(url, { headers, body, method: "DELETE" });
  let final_data = await response.json();
  final_data._status = response.status;
  return final_data;
}

async function putJSONFetch(url, body, csrftoken = null) {
  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Accept", "application/json");
  if (csrftoken != null) {
    headers.append("X-CSRFToken", csrftoken);
  }
  body = JSON.stringify(body);
  let response = await fetch(url, { headers, body, method: "PUT" });
  let final_data = await response.json();
  final_data._status = response.status;
  return final_data;
}

function formatTime(seconds) {
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 60 * 60) {
    minutes = Math.floor(seconds / 60);
    seconds = seconds - minutes * 60;
    if (seconds != 0) {
      return `${minutes}min ${seconds}sec`;
    } else {
      return `${minutes}min`;
    }
  } else {
    return ">1 hour";
  }
}

function formatDatetoYYYYMMDD(date) {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

function convertDateFromYYYYMMDDtoJSDate(str) {
  let year = parseInt(str.slice(0, 4));
  let month = parseInt(str.slice(5, 7)) - 1;
  let day = parseInt(str.slice(8, 10));
  date = new Date(year, month, day);
  return date;
}

function getFutureDates(startDate, noOfDays) {
  let dateList = [];
  let date = new Date(startDate);

  // start one day back so startDate is inclusive
  date.setDate(date.getDate() - 1);

  var formatter = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  // added 1 to noofdays to offset inclusive start date
  for (var i = 0; i <= noOfDays + 1; i++) {
    date.setDate(date.getDate() + 1);
    dateString = date.toLocaleDateString("en-US", formatter);
    dateValidator = formatDatetoYYYYMMDD(date);
    dateList.push({ date, dateString, dateValidator });
  }

  return dateList;
}

function moveInArray(arr, from, to) {
  //delete item from its current position
  let item = arr.splice(from, 1);

  // move to new position
  arr.splice(to, 0, item[0]);

  return arr;
}

function replaceInPlaceInArray(arr, index, replacementItem) {
  //delete original item
  arr.splice(index, 1);

  //replace with new item
  arr.splice(index, 0, replacementItem);

  return arr;
}

const CONSTANTS = {
  timeOptions: [
    { display: "0:05", value: 5 },
    { display: "0:10", value: 10 },
    { display: "0:15", value: 15 },
    { display: "0:20", value: 20 },
    { display: "0:25", value: 25 },
    { display: "0:30", value: 30 },
    { display: "0:35", value: 35 },
    { display: "0:40", value: 40 },
    { display: "0:45", value: 45 },
    { display: "0:50", value: 50 },
    { display: "0:55", value: 55 },
    { display: "1:30", value: 90 },
    { display: "2:00", value: 120 },
    { display: "2:30", value: 150 },
    { display: "3:00", value: 180 },
    { display: "3:30", value: 210 },
    { display: "4:00", value: 240 },
    { display: "4:30", value: 270 },
    { display: "5:00", value: 300 },
    { display: "6:00", value: 360 },
    { display: "7:00", value: 420 },
    { display: "8:00", value: 480 },
    { display: "9:00", value: 540 },
    { display: "10:00", value: 600 },
    { display: "11:00", value: 660 },
    { display: "12:00", value: 720 },
    { display: "13:00", value: 780 },
    { display: "14:00", value: 840 },
    { display: "15:00", value: 900 },
    { display: "20:00", value: 1200 },
    { display: "25:00", value: 1500 },
    { display: "30:00", value: 1800 },
    { display: "40:00", value: 2400 },
    { display: "50:00", value: 3000 },
    { display: "60:00", value: 3600 },
  ],
};
