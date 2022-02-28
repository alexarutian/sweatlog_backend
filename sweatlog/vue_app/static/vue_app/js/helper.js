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
