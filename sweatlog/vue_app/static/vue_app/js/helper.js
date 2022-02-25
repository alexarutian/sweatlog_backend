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
