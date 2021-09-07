const notAlNumDashSpace = /[^a-zA-Z\s]/gi;

function process() {
  var rawText = document.getElementById("Input_Text").value;
  document.getElementById("output").innerHTML =
    "Preprocessing... <br><b>DO NOT CLICK SUBMIT AGAIN</b> <br>It will slow down your results";
  handleParagraph(rawText);
}

function handleParagraph(p) {
  let data = {};

  const propn = document.getElementById("names").checked;
  console.log(propn);

  var processed = p.replaceAll(notAlNumDashSpace, " ");
  //console.log(processed);
  var toks = processed.split(/\s/);
  for (t of toks) {
    if (t != "I" && !propn) {
      lt = t.toLowerCase();
    } else {
      lt = t;
    }
    if (lt != "") {
      if (!data.hasOwnProperty(lt)) {
        data[lt] = 0;
      }
      data[lt] += 1;
    }
  }
  const numKeys = Object.keys(data).length;
  //console.log(data);
  document.getElementById("output").innerHTML =
    "Working on " +
    numKeys +
    " distinct words... <br><b>DO NOT CLICK SUBMIT AGAIN</b> <br>It will slow down your results";
  if (numKeys > 5000) {
    document.getElementById("output").innerHTML +=
      "<br><br><br>You have a large number of unique words. This may omit some to avoid timing out. If the time is >29 seconds, some words were omitted from the analysis";
  }
  /*
    var xhr = new XMLHttpRequest();  
    xhr.open("POST", "/freqData");  
    xhr.send(JSON.stringify(data)); 
	var json_data = xhr.responseText;
	console.log(json_data);
	*/
  fetch("/freqData", {
    method: "POST",
    body: JSON.stringify(data),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (jsonResponse) {
      writeOut(jsonResponse);
      // do something with jsonResponse
    });

  /*.then(res => res.json())
	.then(data => obj = data)
	.then(console.log(data));
	//.then(() => addFreq(obj['freqs']));
	*/
}

function addFreq(freq) {
  let key;
  for (key in freq) {
    if (freqs.hasOwnProperty(key)) {
      freqs[key] += freq[key];
    } else {
      freqs[key] = freq[key];
    }
  }
}

function addOut(t) {
  document.getElementById("output").innerHTML += t;
}
function writeOut(data) {
  var newPage = "<ol>";
  //document.getElementById('output').innerHTML = "<ol>"
  for (key of Object.keys(data)) {
    console.log(key);
    if (key != "TIME") {
      newPage +=
        "<li id=" +
        key +
        "><a href=" +
        data[key][2] +
        ' target="_blank">' +
        key +
        "</a>: ";
      newPage += data[key][0];
      newPage += " percent match with ";
      newPage += data[key][1] + " distinct words</li>";
    } else {
      newPage += "</ol>";
      newPage += "<br>";
      newPage += "This took " + data[key] + " seconds";
    }
  }
  document.getElementById("output").innerHTML = newPage;
}
