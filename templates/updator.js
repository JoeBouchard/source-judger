//var freqs = {};
const notAlNumDashSpace = /[^a-zA-Z\-\s]/ig;

function process() {
	var rawText = document.getElementById('Input Text').value;
	document.getElementById('output').innerHTML = "Preprocessing... <br><b>DO NOT CLICK SUBMIT AGAIN</b> <br>It will slow down your results";
	handleParagraph(rawText);
	//const paragraphs = rawText.split("\n");
	//paragraphs.forEach(p => handleParagraph(p, freqs))
}

function handleParagraph(p){
	let data = {};
	
	var processed = p.replaceAll(notAlNumDashSpace, '')
	//console.log(processed);
	var toks = processed.split(/\s/);
	for (t of toks){
		if (t != "I"){
			lt = t.toLowerCase();
		} else {
			lt = t;
		}
		if (lt != ""){
			if (!data.hasOwnProperty(lt)){
				data[lt] = 0;
			}
			data[lt] += 1;
		}
	}
	const numKeys = Object.keys(data).length
	//console.log(data);
	document.getElementById('output').innerHTML = "Working on "+numKeys+" distinct words... <br><b>DO NOT CLICK SUBMIT AGAIN</b> <br>It will slow down your results";
	if (numKeys > 5000){
		document.getElementById('output').innerHTML += "<br><br><br>You have a large number of unique words. This may omit some to avoid timing out. If the time is >29 seconds, some words were omitted from the analysis";
	}
	fetch("/freqData", {
		method: "POST", 
		body: JSON.stringify(data)
	}).then(res => res.json())
	.then(data => obj = data)
	.then(() => writeOut(obj['text']));
	//.then(() => addFreq(obj['freqs']));
}

function addFreq(freq){
	let key;
	for (key in freq){
		if(freqs.hasOwnProperty(key)){
			freqs[key]+=freq[key];
		} else {
			freqs[key] = freq[key];
		}
	}
}
function writeOut(data){
	document.getElementById('output').innerHTML = data;
}