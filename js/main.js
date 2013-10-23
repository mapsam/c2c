function init() {

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

selectCount = 0;

function highlight(d) {
	console.log('state name');
}
// function lowlight(d) {
// 	d3.select(this).style('fill', '#e5e5e5');
// }
function selection(d) {
	selectCount++;
	if (selectCount <= 2) {
		console.log('state selected');
		d3.select(this).style('fill', 'blue');
	} else {
		selectCount = 0;
		d3.selectAll('.land').style('fill', '#e5e5e5')
		d3.selectAll('.land').attr('class', 'land');
	}
} 

}

window.onLoad = init();



