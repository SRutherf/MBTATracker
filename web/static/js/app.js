// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

// import socket from "./socket"
import React from "react"
import ReactDOM from "react-dom"
import Papa from "./papaparse"

/////////////////////////////////////////////////////////////////////////////////
// Widget Code
/////////////////////////////////////////////////////////////////////////////////

var DateWidget = React.createClass({
	render: function() {
		var epoch = new Date();
		var epochString = epoch.toLocaleDateString()
		return (<div> {epochString} </div>);
	}
});

var TimeWidget = React.createClass({
  getInitialState: function() {
  	var epoch = new Date();
  	var time = epoch.toLocaleTimeString();
    return {
    	time: time
    };
  },
  tick: function() {
  	var epoch = new Date();
  	var time = epoch.toLocaleTimeString();
    this.setState({
    	time: time
    });
  },
  componentDidMount: function() {
    this.interval = setInterval(this.tick, 1000);
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  render: function() {
    return (
      <div>{this.state.time}</div>
    );
  }
});

class Credits extends React.Component {
	render() {
		return (<p>Developed by Steven Rutherford, 2017 <br></br> <a href="http://www.mbta.com/index.asp">MBTA</a> - <a href="http://www.phoenixframework.org/">Phoenix</a> - <a href="http://papaparse.com/">Papa Parse</a> </p>);
	}
}

/////////////////////////////////////////////////////////////////////////////////
// Table code
/////////////////////////////////////////////////////////////////////////////////

var tabdat = [];
var datEpoch; //use to convert csv data into readable time format

function getData() {
	//note this URL works only the Allow-Control-Allow-Origin extension on chrome
	//https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi
	//for a local example replace the url with "images/Departures.csv"
	Papa.parse("http://developer.mbta.com/lib/gtrtfs/Departures.csv", {
		download: true,
		complete: function(results) {
			tabdat = [];
			for (var x = 0; x < results.data.length; x++){
				tabdat.push([]);
				for (var y = 0; y < results.data[0].length; y++){
					tabdat[x][y] = results.data[x][y];
				}
			}
		}
	});
}

var BuildTable = React.createClass({
	getInitialState: function() {
		return {
			tableData: tabdat
		}
	},
	updateRow: function() {
		this.setState ({
			tableData: tabdat
		});
	},
	//parsing is asynchronous so give getData time to download the data before updating
	//MBTA api requires that requests be made with at least a 10 second wait period
	componentDidMount: function() {
		this.interval = setInterval(getData, 10000);
		this.interval2 = setInterval(this.updateRow, 5000);
	},
	componentWillUnmount: function() {
		clearInterval(this.interval);
		clearInterval(this.interval2);
	},
	render: function() {
		//return nothing if data not populated
		if (this.state.tableData.length == 0) {
			return (
				<p>MBTA station data currently unavailable.</p>
			)	
		}
		var rows = this.state.tableData.map(function(row) {
			//check if the data is an epoch in milliseconds.  If so convert to time format.
			var datas = row.map(function(data) {
				if (!isNaN(data) && data.length > 6){
					datEpoch = new Date(parseInt(data)*1000);
					data = datEpoch.toLocaleTimeString();
					return <td> {data} </td>	
				}
				else{
					return <td> {data} </td>
				}
			});
			return <tr> {datas} </tr>
		});
    	return (
			<table>
				{rows}
			</table>
    	);
	}
});

/////////////////////////////////////////////////////////////////////////////////
// render blocks
/////////////////////////////////////////////////////////////////////////////////

ReactDOM.render(
	<TimeWidget />, 
	document.getElementById("time"),
);
ReactDOM.render(
  <DateWidget />,
  document.getElementById("date"),
)
ReactDOM.render(
  <BuildTable />,
  document.getElementById("tracker-table"),
)
ReactDOM.render(
  <Credits />,
  document.getElementById("credits"),
)