function init() {
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

queue()
	.defer(d3.json, 'data/states.json')
	.await(makeMap);

function makeMap(error, state) {

	// countries index
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
var selectCount = 0;
var first = null;
var second = null;

function highlight(d) {
	d3.select(this).style('opacity', 0.8);
}
function lowlight(d) {
	d3.select(this).style('opacity', 1);
}
function selection(d) {
	selectCount++;
	if (selectCount <= 1) {
		d3.select(this).style('fill', 'blue');
		state = d.properties.STATE_ABBR;
		value = getValue(waka, state);
		first = value;
		$('#lineup').append(state);
		$('#number').append(value);
	} else if (selectCount <= 2) {
		d3.select(this).style('fill', 'blue');
		state = d.properties.STATE_ABBR;
		value = getValue(waka, state);
		second = value;
		areas = [first, second];
		drawCircle(areas);
		$('#lineup').append(' vs. '+state);
		$('#number').append(' | '+value);
	} else {
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
	for (var i in json) {
		if (json[i].state == item) {
			return json[i].number;
		}
	}
}

function drawCircle(area) {
	var circles = svgCircles.selectAll('circle')
		.data(area)
		.enter()
		.append('circle');

	console.log(area);
	circles.attr('cx', w/2)
		.attr('cy', h/2)
		.attr('fill', 'blue')
		.attr('r', function(d) {
			return d / 10;
		})
		.attr('opacity', 0.5);
} 

}

window.onLoad = init();



