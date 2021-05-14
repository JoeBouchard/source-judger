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
	//console.log(data);
	document.getElementById('output').innerHTML = "Working... <br><b>DO NOT CLICK SUBMIT AGAIN</b> <br>It will slow down your results";
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