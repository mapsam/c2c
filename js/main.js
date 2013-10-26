function init() { // runs on page load

// json object with state as ID to match with topojson object
// this will be more robust in data and not located in the main.js 
// file by the end of things. And probably not named 'waka'
var waka = [
	{ "state": "Alaska","abbrev": "AK","area": "663267.26" },
	{ "state": "Texas","abbrev": "TX","area": "268580.82" },
	{ "state": "California","abbrev": "CA","area": "163695.57" },
	{ "state": "Montana","abbrev": "MT","area": "147042.4" },
	{ "state": "New Mexico","abbrev": "NM","area": "121589.48" },
	{ "state": "Arizona","abbrev": "AZ","area": "113998.3" },
	{ "state": "Nevada","abbrev": "NV","area": "110560.72" },
	{ "state": "Colorado","abbrev": "CO","area": "104093.57" },
	{ "state": "Oregon","abbrev": "OR","area": "98380.64" },
	{ "state": "Wyoming","abbrev": "WY","area": "97813.56" },
	{ "state": "Michigan","abbrev": "MI","area": "96716.11" },
	{ "state": "Minnesota","abbrev": "MN","area": "86938.87" },
	{ "state": "Utah","abbrev": "UT","area": "84898.83" },
	{ "state": "Idaho","abbrev": "ID","area": "83570.08" },
	{ "state": "Kansas","abbrev": "KS","area": "82276.84" },
	{ "state": "Nebraska","abbrev": "NE","area": "77353.73" },
	{ "state": "South Dakota","abbrev": "SD","area": "77116.49" },
	{ "state": "Washington","abbrev": "WA","area": "71299.64" },
	{ "state": "North Dakota","abbrev": "ND","area": "70699.79" },
	{ "state": "Oklahoma","abbrev": "OK","area": "69898.19" },
	{ "state": "Missouri","abbrev": "MO","area": "69704.31" },
	{ "state": "Florida","abbrev": "FL","area": "65754.59" },
	{ "state": "Wisconsin","abbrev": "WI","area": "65497.82" },
	{ "state": "Georgia","abbrev": "GA","area": "59424.77" },
	{ "state": "Illinois","abbrev": "IL","area": "57914.38" },
	{ "state": "Iowa","abbrev": "IA","area": "56271.55" },
	{ "state": "New York","abbrev": "NY","area": "54556" },
	{ "state": "North Carolina","abbrev": "NC","area": "53818.51" },
	{ "state": "Arkansas","abbrev": "AR","area": "53178.62" },
	{ "state": "Alabama","abbrev": "AL","area": "52419.02" },
	{ "state": "Louisiana","abbrev": "LA","area": "51839.7" },
	{ "state": "Mississippi","abbrev": "MS","area": "48430.19" },
	{ "state": "Pennsylvania","abbrev": "PA","area": "46055.24" },
	{ "state": "Ohio","abbrev": "OH","area": "44824.9" },
	{ "state": "Virginia","abbrev": "VA","area": "42774.2" },
	{ "state": "Tennessee","abbrev": "TN","area": "42143.27" },
	{ "state": "Kentucky","abbrev": "KY","area": "40409.02" },
	{ "state": "Indiana","abbrev": "IN","area": "36417.73" },
	{ "state": "Maine","abbrev": "ME","area": "35384.65" },
	{ "state": "South Carolina","abbrev": "SC","area": "32020.2" },
	{ "state": "West Virginia","abbrev": "WV","area": "24229.76" },
	{ "state": "Maryland","abbrev": "MD","area": "12406.68" },
	{ "state": "Hawaii","abbrev": "HI","area": "10930.98" },
	{ "state": "Massachusetts","abbrev": "MA","area": "10554.57" },
	{ "state": "Vermont","abbrev": "VT","area": "9614.26" },
	{ "state": "New Hampshire","abbrev": "NH","area": "9349.94" },
	{ "state": "New Jersey","abbrev": "NJ","area": "8721.3" },
	{ "state": "Connecticut","abbrev": "CT","area": "5543.33" },
	{ "state": "Delaware","abbrev": "DE","area": "2489.27" },
	{ "state": "Rhode Island","abbrev": "RI","area": "1545.05" }
];

// setting up main index map parameters for d3
var width = 750, 
	height = 450;

var svg = d3.select("#indexMap").append("svg") 
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
		.on('mouseout', lowlight)
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
		d3.select(this).style('fill', '#B2AD28'); // highlight the clicked state with blue fill
		stateID = d.properties.STATE_ABBR; // assign 'state' with STATE_ABBR value
		state = getValue(waka, stateID); // with the ID from STATE_ABBR, find the match value in the json object and return array of values
		first = state[1]; // assign value to first object chosen
		$('#first').append(state[0]); // append state to <p id="lineup"></p> so we can see what we've chosen
		$('#number').append(state[1]); // append the value so we can see the raw number
	} else if (selectCount <= 2) {
		d3.select(this).style('fill', '#458FB2'); // this is the same as the above functions but for second click
		stateID = d.properties.STATE_ABBR;
		state = getValue(waka, stateID);
		second = state[1];
		areas = [first, second]; // build array with first and second values used in creating circles via d3
		drawCircle(areas); // pass values as data array which can be used in d3's .data() function
		$('#second').append(' '+state[0]);
		$('#number').append(' | '+state[1]);
	} else { // this resets everything on a third click so we can do the whole process again with other choices
		selectCount = 0;
		firstSelect = null;
		secondSelect = null;
		svgCircles.selectAll('circle').remove();
		d3.selectAll('.land').attr('class', 'land');
		$('#first').html('');
		$('#second').html('');
		$('#number').html('');
	}
} 

function getValue(json, item) {
	for (var i in json) { // match the topojson ID with the key value in 'waka' json object
		if (json[i].abbrev == item) {
			return [json[i].state, json[i].area]; // return the key value of 'number' from that matched object
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
		.attr('stroke', function(d){
			if (d == first) {
				return '#B2AD28';
			} else {
				return '#458FB2';
			}
		})
		.attr('stroke-width', '4px')
		.attr('fill', 'none')
		.attr('r', function(d) { // creates radius based on value (divided by 10 to keep things small right now)
			return d / 1000; // we will have to find the radius based on the total area eventually so these 
					// circles are more representative of the area of the object we've clicked
		})
		.attr('opacity', 0.5); // makes sure there are two circles (eventually will just be outlines I think)
} 

}

window.onLoad = init(); // run everything once the page is loaded



