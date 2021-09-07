import React, { Component, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import ReactDOM from "react-dom";

class Input extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    // const [gridApi, setGridApi] = useState(null);
    this.state = {
      value: "",
      columnDefs: [
        { headerName: "Source", field: "source" },
        { headerName: "Match Score", field: "percent" },
        { headerName: "Matching Words", field: "words" },
      ],
      rowData: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.notAlNumDashSpace = /[^a-zA-Z\s]/gi;
  }

  onGridReady = (params) => {
    console.log(this);
    this.setState({ api: params.api, columnApi: params.columnApi });
    params.api.sizeColumnsToFit();
  };

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    this.handleParagraph(this.state.value);
    this.setState({ rowData: [] });
    event.preventDefault();
  }

  handleParagraph(p) {
    console.log(p);
    let data = {};

    const propn = document.getElementById("names").checked;
    console.log(propn);

    var processed = p.replaceAll(this.notAlNumDashSpace, " ");
    console.log(processed);
    var toks = processed.split(/\s/);
    console.log(toks);
    for (let t of toks) {
      //   t = toks[to];
      console.log(t);
      let lt;
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

    // document.getElementById("output").innerHTML =
    var outputVal =
      "Working on " +
      numKeys +
      " distinct words... <br><b>DO NOT CLICK SUBMIT AGAIN</b> <br>It will slow down your results";
    if (numKeys > 5000) {
      outputVal +=
        "<br><br><br>You have a large number of unique words. This may omit some to avoid timing out. If the time is >29 seconds, some words were omitted from the analysis";
    }

    this.setState({ output: outputVal });
    /*
      var xhr = new XMLHttpRequest();  
      xhr.open("POST", "/freqData");  
      xhr.send(JSON.stringify(data)); 
      var json_data = xhr.responseText;
      console.log(json_data);
      */
    const This = this;
    fetch("/freqData", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (jsonResponse) {
        This.writeOut(jsonResponse);
        // do something with jsonResponse
      });

    /*.then(res => res.json())
      .then(data => obj = data)
      .then(console.log(data));
      //.then(() => addFreq(obj['freqs']));
      */
  }

  writeOut(data) {
    var newPage = "<ol>";
    var rowData = [];
    //document.getElementById('output').innerHTML = "<ol>"
    for (let key of Object.keys(data)) {
      console.log(key);
      let dat = {};
      if (key != "TIME") {
        // newPage +=
        //   "<li id=" +
        //   key +
        //   "><a href=" +
        //   data[key][2] +
        //   ' target="_blank">' +
        //   key +
        //   "</a>: ";
        dat.source = key;
        dat.percent = data[key][0];
        dat.words = data[key][1];
        rowData.push(dat);
        // newPage += data[key][0];
        // newPage += " percent match with ";
        // newPage += data[key][1] + " distinct words</li>";
        //   } else {
        //     newPage += "</ol>";
        //     newPage += "<br>";
        //     newPage += "This took " + data[key] + " seconds";
        //   }
      }
    }
    this.setState({ rowData: rowData });
    console.log(this.state);
  }

  render() {
    return (
      <div id="wrapper">
        <div id="input">
          <label htmlFor="Input_Text">Enter text here...</label>
          <textarea
            id="Input_Text"
            value={this.state.value}
            onChange={this.handleChange}
          ></textarea>
          <br></br>
          <input type="checkbox" id="names" name="names" value="True"></input>
          <label htmlFor="names"> Exclude Proper Nouns? (beta)</label>
          <br></br>
          <div>
            <button onClick={this.handleSubmit}>Submit</button>
          </div>
        </div>
        <div className="ag-theme-alpine">
          <AgGridReact
            onGridReady={this.onGridReady}
            columnDefs={this.state.columnDefs}
            rowData={this.state.rowData}
            // onChange={this.api.sizeColumnsToFit}
          ></AgGridReact>
        </div>
        {/* <div id="output" value={this.state}>
          <ol>
            <li id="r/NoSleep">
              <a href="https://www.reddit.com/r/NoSleep" target="_blank">
                r/NoSleep
              </a>
              : {this.state.nosleep.percent} percent match with
              {this.state.nosleep.num} distinct words
            </li>
            <li id="Standard Wikipedia">
              <a href="https://en.wikipedia.org" target="_blank">
                Standard Wikipedia
              </a>
              : {this.state.wiki.percent} percent match with
              {this.state.swiki.num} distinct words
            </li>
            <li id="GroupMe">
              <a href="https://www.groupme.com" target="_blank">
                GroupMe
              </a>
              : {this.state.groupme.percent} percent match with
              {this.state.groupme.num} distinct words
            </li>
            <li id="Fanfiction.net">
              <a href="https://www.fanfiction.net" target="_blank">
                Fanfiction.net
              </a>
              : {this.state.ff.percent} percent match with {this.state.ff.num}
              distinct words
            </li>
            <li id="r/ShittyAskScience">
              <a
                href="https://www.reddit.com/r/ShittyAskScience"
                target="_blank"
              >
                r/ShittyAskScience
              </a>
              : {this.state.sas.percent} percent match with {this.state.sas.num}
              distinct words
            </li>
            <li id="Simple Wikipedia">
              <a href="https://simple.wikipedia.org" target="_blank">
                Simple Wikipedia
              </a>
              : {this.state.swiki.percent} percent match with
              {this.state.swiki.num} distinct words
            </li>
            <li id="r/TIFU>">
              <a href="https://www.reddit.com/r/TIFU" target="_blank">
                r/TIFU
              </a>
              : {this.state.tifu.percent} percent match with
              {this.state.tifu.num} distinct words
            </li>
            <li id="r/LifeProTips">
              <a href="https://www.reddit.com/r/LifeProTips" target="_blank">
                r/LifeProTips
              </a>
              : {this.state.lpt.percent} percent match with {this.state.lpt.num}
              distinct words
            </li>
            <li id="r/ExplainLikeImFive">
              <a
                href="https://www.reddit.com/r/ExplainLikeImFive"
                target="_blank"
              >
                r/ExplainLikeImFive
              </a>
              : 33.2 percent match with 0 distinct words
            </li>
            <li id="r/UnpopularOpinion">
              <a
                href="https://www.reddit.com/r/UnpopularOpinion"
                target="_blank"
              >
                r/UnpopularOpinion
              </a>
              : 29.433 percent match with 0 distinct words
            </li>
            <li id="r/AskScience">
              <a href="https://www.reddit.com/r/AskScience" target="_blank">
                r/AskScience
              </a>
              : 25.8 percent match with 0 distinct words
            </li>
            <li id="r/Confessions">
              <a href="https://www.reddit.com/r/Confessions" target="_blank">
                r/Confessions
              </a>
              : 25.167 percent match with 0 distinct words
            </li>
            <li id="r/AskHistorians">
              <a href="https://www.reddit.com/r/AskHistorians" target="_blank">
                r/AskHistorians
              </a>
              : 19.433 percent match with 0 distinct words
            </li>
            <li id="r/AmITheAsshole">
              <a href="https://www.reddit.com/r/AmITheAsshole" target="_blank">
                r/AmITheAsshole
              </a>
              : 13.433 percent match with 0 distinct words
            </li>
            <li id="r/Relationships">
              <a href="https://www.reddit.com/r/Relationships" target="_blank">
                r/Relationships
              </a>
              : 11.067 percent match with 0 distinct words
            </li>
          </ol>
          This took 0 seconds
        </div> */}
      </div>
    );
  }
}

export default Input;
