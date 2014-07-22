function init() { // runs on page load

// json object with state as ID to match with topojson object
// this will be more robust in data and not located in the main.js 
// file by the end of things. And probably not named 'waka'

// setting up main index map parameters for d3

var scale = 2000;

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
			// get the data for the svg
			var name = d.properties.STATE_ABBR,
					cID = d.properties.STATE_ABBR

			// create select lists
			$('.country-select').append($('<option></option>').attr('value', cID).text(name));

			// get the area
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
        .attr("id", cID)
        .attr("data-area", area)
      .append("g")
        .attr("transform", "scale(" + s + ")translate(" + [10 - bounds[0][0], 10 - bounds[0][1]] + ")")
        // .attr("transform", "translateX(" + (-(dx*s+30)) + ")")
      .append("path")
        .attr("d", path);
		});
	}

	$('.country-select').change(function(){
		// get selection id
		var newCountryID = $(this).val();
		console.log(newCountryID);
		if($(this).attr('id')==='cOne') {

			$('.one-active').attr('class', 'state');
			$('#'+newCountryID).attr('class', 'state one-active');

		} else {

			$('.two-active').attr('class', 'state');
			$('#'+newCountryID).attr('class', 'state two-active');

		}
		
	});
}

window.onLoad = init(); // run everything once the page is loaded



