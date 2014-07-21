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

var scale = 1000;

var projection = d3.geo.stereographic().translate([0, 0]).scale(scale).clipAngle(90);

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
	// svg.selectAll('.land')
	// 	.data(topojson.feature(state, state.objects.usStates).features)
	// 	.enter()
	// 	.append('path')
	// 	.attr('class', 'land')
	// 	.attr('d', path)
	// 	.on('mouseover', highlight)
	// 	.on('mouseout', lowlight)
	// 	.on('click', selection);

	// new stuff from milstead
	var svg = d3.select('#map').selectAll('svg')
		.data(topojson.feature(state, state.objects.usStates).features)
		.enter().append('svg')
		.each(function(d){
			d.area = d3.geo.area(d);
			var cWidth = $('#map').width();
			var cHeight = $('#map').height();
			var svg = d3.select(this),
					b = d3.geo.bounds(d),
					centroid = [.5 * (b[0][0] + b[1][0]), .5 * (b[0][1] + b[1][1])];
			projection.rotate(Math.abs(b[0][1]) === -90 ? [0, 90] : Math.abs(b[1][1]) === 90 ? [0, -90] : [-centroid[0], -centroid[1]]);
			var bounds = path.bounds(d),
          area = path.area(d),
          s = Math.sqrt(d.area / area) * scale,
          dx = bounds[1][0] - bounds[0][0],
          dy = bounds[1][1] - bounds[0][1];
      svg 
        .attr("width", dx * s + 50)
        .attr("height", dy * s + 50)
        .attr("class", "state")
        .attr("style", "margin-left:"+(cWidth-(dx*s+50))/2+"px;margin-top:"+(cHeight-(dy*s+50))/2+"px;")
        .attr("data-area", area)
      .append("g")
        .attr("transform", "scale(" + s + ")translate(" + [10 - bounds[0][0], 10 - bounds[0][1]] + ")")
        // .attr("transform", "translateX(" + (-(dx*s+30)) + ")")
      .append("path")
      	.style("fill", "none")
      	.style("stroke", "steelblue")
      	.style("stroke-width", .5)
        .attr("d", path);
		});
	}

}

window.onLoad = init(); // run everything once the page is loaded



