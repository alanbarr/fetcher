function wipeDownResponse() {
    document.getElementById("response_status").value = null;
    document.getElementById("response_body").value = null;
    document.getElementById("response_headers").value = null;
}

function updateInputsFromUrl() {

    const url = new URL(window.location.href);
    const target = url.searchParams.get("target");
    const fetch = url.searchParams.get("fetch");

    console.log("URL Param Target:" + target);
    console.log("URL Param Fetch:" + fetch);

    if (target && fetch) {
        document.getElementById("target_uri").value = target;
        document.getElementById("fetch_json").value = fetch;
    }
}

function updateUrlFromInputs() {

    const target = document.getElementById("target_uri").value;
    const fetch = document.getElementById("fetch_json").value;

    history.replaceState("", "", "?target=" + encodeURIComponent(target)
                                  + "&fetch=" + encodeURIComponent(fetch));
}

function submitButtonClicked() {
    console.log("Submit Pressed");

    wipeDownResponse();

    const target = document.getElementById("target_uri").value
    //const target ="http://192.168.1.50:8080/v1/pos?Action=Status&Format=XML";

    console.log("Request going to URI: " + target)

    //const init_data = document.getElementById("fetch_json").value
    const init_data = JSON.parse(document.getElementById("fetch_json").value);

    fetch(target, init_data)
      .then(response => processResponse(response));

    updateUrlFromInputs()
}

async function processResponse(response) {

    console.log("Response status was: " + response.status);
    console.log(response);

    const response_status_p = document.getElementById("response_status");
    response_status_p.value = response.status

    const response_body_box = document.getElementById("response_body");

    const text = await response.text();
    response_body_box.value = text

    const headers_box = document.getElementById("response_headers");
    const headers = await response.headers;

    let header_text = ""
    for (var pair of headers.entries()) {
        header_text += pair[0]+ ": "+ pair[1] + "\n";
    }

    headers_box.value = header_text;
}

const btn = document.getElementById("submit_button");
btn.addEventListener("click", submitButtonClicked);
const fetch_json_box = document.getElementById("fetch_json");

document.getElementById("fetch_json").defaultValue =`{
  "method": "GET",
  "mode": "cors",
  "credentials": "same-origin",
  "headers" : {
    "content-type": "text/plain"
  },
  "redirect": "follow"
}`;

updateInputsFromUrl();
