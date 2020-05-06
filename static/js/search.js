$(document).ready(function() {
	
	// if (!inCodePenEditor()) {
	// 	$("#search-input").focus();
	// }

	// mode of form elements changes on input
	$("#search-input").on('input', function() {
		if (isEmpty($("#search-input").val()) ) {
			inputInactive();
		} else {
			inputActive();
		}
	});
	
	// update button tooltip on hover
	$("#search-btn").hover(function() {
		if (isEmpty($("#search-input").val())) {
			$(this).attr("title", "Search the S&P 500 Global Ratings");
		} else {
			$(this).attr("title", "Search Yahoo finance for '" + $("#search-input").val() + "'.");
		}
	});

	// main search functionality
	$("#search-btn").on("click", function(e) {
		e.preventDefault();
		clearCurrentResults();
		// console.log("fire")
		// Add event here
		searchStock($("#search-input").val());
		// retrive the value in the search-input and add pass it into function searchStock

		$("#search-clear").focus();
		// The logo to clear the result
	});

	// bind input cancel functionality to click
	$("#search-clear").on("click", function() {
		cancelInput();
	});

	// bind input cancel functionality to escape key press
	$("#search-form").keyup(function(e) {
		if (e.keyCode == 27) {
			cancelInput();
		}
	});

});

// function inCodePenEditor() {
// 	return !/full|debug/.test(window.location.pathname);
// }

// ========================== change view function ==========================
// initialise site view
function cancelInput() {
	clearInputField();
	showViewInitial();
	inputInactive();
	$("#search-input").focus();
}

function isEmpty(value) {
	return 0 === value.length;
}

function inputInactive() {
	// To tell this box don't has an input value
	$("#search-form").removeClass("hasInput");
}

function inputActive() {
	// To tell this box has an input value
	$("#search-form").addClass("hasInput");
}

function clearCurrentResults() {
	$("#stockPlot").empty();
}

function clearInputField() {
	$("#search-input").val('');
}

function showViewInitial() {
	$("#container").removeClass("view-results");
	$("#container").addClass("view-initial");
}

function showViewResults() {
	// Make search smaller view
	$("#container").removeClass("view-initial");
	$("#container").addClass("view-results");
}

function searchStock(searchTerm) {
	if (isEmpty(searchTerm)) {
		// openRandomArticle();
		// Seach S$P information
		getStockData("^GSPC")
	} else {
		if(true){
			//add for fuzzy query
			// readFileToArr('NYSE.txt',function(list){
			// 	let arr = fuzzQuerry(list, searhTerm.toUpperCase());
			// 	for(let i =0; i<arr.length;i++){
			// 		arr[i] = (arr[i].split("\t"))[0];
			// 	}
			// 	searchTerm = arr[0];
			// 	console.log(searchTerm);
				getStockData(searchTerm);
				showViewResults();
			// })
			// console.log(searchTerm);
			// getStockData(searchTerm);
			// showViewResults();
		}else{
			// TODO wait for the stock checker function
			$("#stockPlot").append(encapsulate("No results found", "p", ""));
		}
	}
}


// use python program to search the stock information
function getStockData(stockName){
	// console.log("fire1");
	$.ajax({
		url:"/",
        type: "GET",
		dataType: "json",
		data:{"stockName":stockName},
        success: function (data, stock_name) {
			if(data){
				// console.log(data, stock_name)
				// console.log(typeof(data))
				// call the plotpy function here
				console.log("fire2");
				plotStock(data, stockName) 
			}else{
				// console.log("fire3");
			}
			
		},
		error: function(e) {
			console.log(e)	
		}
	})
}
// ========================== figure plot function ==========================
function plotStock(data, stockName){

	let closeAvg = data[4].reduce((acc, val) => acc + val, 0) / data[4].length;
	let lowAvg = data[1].reduce((acc, val) => acc + val, 0) / data[1].length;
	let highAvg = data[2].reduce((acc, val) => acc + val, 0) / data[2].length;
	let trace = [
		{
		x: data[0],
		close:data[4],
		high:data[1],
		low:data[2],
		open:data[3],

		increasing: {line: {color: 'green'}}, 
		decreasing: {line: {color: 'red'}}, 
		line: {color: 'rgba(31,119,180,1)'}, 
		type: 'candlestick',
		xaxis:"x",
		yaxis:"y"
	},
	{
		x: data[0],
		y:data[4],
		mode:"lines",
		name:"Close",
		marker: {color: '#835AF1'},
		visible:false,
		width:0.5
	},
	{
		x: data[0],
		y:data[2],
		mode: 'lines',
		name: 'Low',
		marker: {color: '#F06A6A'},
		visible: false
	},
	{
		x: data[0],
		y:data[1],
		mode: 'lines',
		name: 'High',
		marker: {color: '#33CFA5'},
		visible: false
	},
	{
		x: data[0],
		y:data[0].map(a => closeAvg),
		mode: 'lines',
		name: 'Close average',
		line: {color: '#835AF1',dash:"dash"},
		visible: false
	},
	{
		x: data[0],
		y:data[0].map(a => lowAvg),
		mode: 'lines',
		name: 'Low average',
		line: {color: '#F06A6A',dash:"dash"},
		visible: false
	},
	{
		x: data[0],
		y:data[0].map(a => highAvg),
		mode: 'lines',
		name: 'High average',
		line: {color: '#33CFA5',dash:"dash"},
		visible: false
	}
	]
	// let formatedData = [trace]

	let button_layer_1_height = 1.12;
	let button_layer_2_height = 1.0;
	let annotation_offset = 0.04;

	let updatemenus = [
		// {
		// buttons:[
		// 	{
		// 		step: "all",
		// 		label: "All dates"
		// 	},
		// 	{
		// 		step:"month",
		// 		stepmode:"backward",
		// 		count:1,
		// 		label:"1 month"
		// 	},
		// 	{
		// 		step: "month",
		// 		stepmode:"backward",
		// 		count: 3,
		// 		label: "3 months"
		// 	},
		// 	{
		// 		step:"month",
		// 		stepmode:"backward",
		// 		count: 6,
		// 		label:"6 months"
		// 		}],
		// 		direction: 'left',
		// 		pad: {'r': 10, 't': 10},
		// 		showactive: true,
		// 		type: 'buttons',
		// 		x: 0.1,
		// 		xanchor: 'left',
		// 		y: button_layer_1_height,
		// 		yanchor: 'top'
		// },
		{
			buttons:[
				{
					args: [{'visible': [true, false, false, false, false, false, false]},
							{'title': `${stockName} Candle`}],
					label: 'Candle',
					method: 'update'
				},
				{
					args: [{'visible': [false, true, false, false, true, false, false]},
							{'title': `${stockName} Close`}],
					label: 'Close',
					method: 'update'
				},
				{
					args: [{'visible': [false, false, true, false, false, true, false]},
						   {'title': `${stockName} Low`}],
					label: 'Low',
					method: 'update'
				},
				{
					args: [{'visible': [false, false, false, true, false, false, true]},
						   {'title': `${stockName} High`}],
					label: 'High',
					method: 'update'
				}
			]
			
		}
	
	]

	let layout = {
		dragmode: "zoom",
		showlegend: true,
		  type: 'date',
		// xaxis:{
		// 	autorange: true,
		// 	title:stockName,
		// 	rangeselector:{
		// 		x:0,
		// 		y:1.2,
		// 		xanchor:"left",
		// 		font:{size:10}
		// 	}
		// },
		updatemenus:updatemenus
		// yaxis:{
		// 	autorange:true,
		// 	type: 'linear'
		// }
	}
	Plotly.newPlot("stockPlot", trace, layout);
	showViewResults()
	
	if($("#stockPlot").children().length == 0){
		inputInactive();
	}else {
		inputActive();
	}
}

// ========================== Table plot function ==========================
function plotStockStat(data, stockName){
	let values = [{

	}]
}

// ========================== Dom ==========================
// wrap content in given html tags, with given attributes
function encapsulate(content, tag, attr) {
	if (false === content) {
		return "<" + tag + " " + attr + " />";
	} else {
		return '<' + tag + " " + attr + '>' + content + '</' + tag + '>';
	}
}

// Manually set height of card image element
// function setCardImgHeight() {
// 	$(".card-image img", "#stockPlot").css('height', function() {
// 		return Math.round($(this).width() * 0.75);
// 	});
// }

// ========================== search optimization ==========================
//---for fuzzy query
// let fs = require('fs');
// let readline = require('readline');
// function fuzzyQuery(list, keyWord){
//     let arr =[];
//     for(let i=0;i<list.length;i++){
//         if(list[i].match(keyWord) !=null){
//             arr.push(list[i]);
//         }
//     }
//     return arr;
// }
// function readFileToArr(fReadName, callback){
//     let fRead = fs.createReadStream(fReadName);
//     let objReadLine = readline.createInterface({
//         input:fRead
//     });
//     let arr = new Array();
//     objReadLine.on('line',function(line){
//         arr.push(line.toUpperCase());
//     });
//     objReadLine.on('close',function(){
//         callback(arr);
//     });
// }