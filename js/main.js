function init() { // runs on page load

// json object with state as ID to match with topojson object
// this will be more robust in data and not located in the main.js 
// file by the end of things. And probably not named 'waka'
var waka =
[
	{ "state": "HI", "number": "434" },
	{ "state": "WA", "number": "22" },
	{ "state": "MT", "number": "56" },
	{ "state": "ME", "number": "334" },
	{ "state": "ND", "number": "102" },
	{ "state": "SD", "number": "345" },
	{ "state": "WY", "number": "104" },
	{ "state": "WI", "number": "234" },
	{ "state": "ID", "number": "54" },
	{ "state": "VT", "number": "097" },
	{ "state": "MN", "number": "67" },
	{ "state": "OR", "number": "567" },
	{ "state": "NH", "number": "687" },
	{ "state": "IA", "number": "25" },
	{ "state": "MA", "number": "100" },
	{ "state": "NE", "number": "234" },
	{ "state": "NY", "number": "456" },
	{ "state": "PA", "number": "111" },
	{ "state": "CT", "number": "654" },
	{ "state": "RI", "number": "345" },
	{ "state": "NJ", "number": "479" },
	{ "state": "IN", "number": "529" },
	{ "state": "NV", "number": "243" },
	{ "state": "UT", "number": "234" },
	{ "state": "CA", "number": "234" },
	{ "state": "OH", "number": "034" },
	{ "state": "IL", "number": "234" },
	{ "state": "DC", "number": "64" },
	{ "state": "DE", "number": "240" },
	{ "state": "WV", "number": "24" },
	{ "state": "MD", "number": "875" },
	{ "state": "CO", "number": "764" },
	{ "state": "KY", "number": "457" },
	{ "state": "KS", "number": "235" },
	{ "state": "VA", "number": "736" },
	{ "state": "MO", "number": "54" },
	{ "state": "AZ", "number": "936" },
	{ "state": "OK", "number": "508" },
	{ "state": "NC", "number": "725" },
	{ "state": "TN", "number": "873" },
	{ "state": "TX", "number": "98" },
	{ "state": "NM", "number": "765" },
	{ "state": "AL", "number": "87" },
	{ "state": "MS", "number": "54" },
	{ "state": "GA", "number": "43" },
	{ "state": "SC", "number": "654" },
	{ "state": "AR", "number": "765" },
	{ "state": "LA", "number": "765" },
	{ "state": "FL", "number": "43" },
	{ "state": "MI", "number": "345" },
	{ "state": "AK", "number": "654" }
];

// setting up main index map parameters for d3
var width = 750, 
	height = 450;

var svg = d3.select("#map").append("svg") 
	.attr("width", width)
	.attr("height", height); 

var projection = d3.geo.albers() 
	.scale(950)
	.translate([width / 2, height / 2])
	.precision(.1);

var path = d3.geo.path()  
	.projection(projection);  

// loading the topojson file with our states
queue()
	.defer(d3.json, 'data/states.json')
	.await(makeMap);

// main function that creates the map. The biggest thing here is
// selectAll() which creates a unique SVG object for each state instead
// of a single svg object or group that wouldn't allow us to access 
// each state's properties (used to match with waka json object)
function makeMap(error, state) {

	// countries index
	// let's talk about what's happening here instead of me commenting it
	// you can read http://giscollective.org/d3-topojson-interaction/
	// if you want to learn more about topojson interaction :)
	svg.selectAll('.land')
		.data(topojson.feature(state, state.objects.usStates).features)
		.enter()
		.append('path')
		.attr('class', 'land')
		.attr('d', path)
		.on('mouseover', highlight)
		.on('click', selection);
}

// area by circle volumes
var w = 200,
	h = 200;

var svgCircles = d3.select("#volumes").append("svg")
	.attr("width", w)
	.attr("height", h);



// selection variables
var selectCount = 0; // if at two this means we've chosen to objects to compare so don't choose anymore and rest
var first = null; // used to build information within the other d3 container (the circles) from the first selection
var second = null; // same as first, but second choice information

// function that is supposed to be a hover animation on the index map
function highlight(d) {
	d3.select(this).style('opacity', 0.8);
}
// same, but mouse leaving the object go back to normal opacity
function lowlight(d) {
	d3.select(this).style('opacity', 1);
}

// this is the big function that runs when you click an object on the index map
// passed with 'd' which is the data variable from d3 for the specific object you have chosen
// this will allow us to grab the 'ID' which is within the property named STATE_ABBR
function selection(d) {
	selectCount++;
	if (selectCount <= 1) {
		d3.select(this).style('fill', 'blue'); // highlight the clicked state with blue fill
		state = d.properties.STATE_ABBR; // assign 'state' with STATE_ABBR value
		value = getValue(waka, state); // with the ID from STATE_ABBR, find the match value in the json object
		first = value; // assign value to first object chosen
		$('#lineup').append(state); // append state to <p id="lineup"></p> so we can see what we've chosen
		$('#number').append(value); // append the value so we can see the raw number
	} else if (selectCount <= 2) {
		d3.select(this).style('fill', 'red'); // this is the same as the above functions but for second click
		state = d.properties.STATE_ABBR;
		value = getValue(waka, state);
		second = value;
		areas = [first, second]; // build array with first and second values used in creating circles via d3
		drawCircle(areas); // pass values as data array which can be used in d3's .data() function
		$('#lineup').append(' vs. '+state);
		$('#number').append(' | '+value);
	} else { // this resets everything on a third click so we can do the whole process again with other choices
		selectCount = 0;
		firstSelect = null;
		secondSelect = null;
		svgCircles.selectAll('circle').remove();
		d3.selectAll('.land').style('fill', '#e5e5e5')
		d3.selectAll('.land').attr('class', 'land');
		$('#lineup').html('');
		$('#number').html('');
	}
} 

function getValue(json, item) {
	for (var i in json) { // match the topojson ID with the key value in 'waka' json object
		if (json[i].state == item) {
			return json[i].number; // return the key value of 'number' from that matched object
		}
	}
}

function drawCircle(area) {
	var circles = svgCircles.selectAll('circle')
		.data(area) // uses first and second value as parameters
		.enter()
		.append('circle');

	circles.attr('cx', w/2) // x axis location (half of the width of the svg plane)
		.attr('cy', h/2) // y axis location
		.attr('fill', 'blue') 
		.attr('r', function(d) { // creates radius based on value (divided by 10 to keep things small right now)
			return d / 10; // we will have to find the radius based on the total area eventually so these 
					// circles are more representative of the area of the object we've clicked
		})
		.attr('opacity', 0.5); // makes sure there are two circles (eventually will just be outlines I think)
} 

}

window.onLoad = init(); // run everything once the page is loaded



