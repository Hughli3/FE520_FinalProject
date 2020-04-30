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
			getStockData(searchTerm);
			showViewResults();
		}else{
			// TODO wait for the stock checker function
			$("#stockPlot").append(encapsulate("No results found", "p", ""));
		}
	}
}


// use python program to search the stock information
function getStockData(stockName){
	console.log("fire1");
	$.ajax({
		url:"/",
        type: "GET",
		dataType: "json",
		data:{"stockName":stockName},
        success: function (data, stock_name) {
			if(data){
				console.log(data, stock_name)
				console.log(typeof(data))
				// call the plotpy function here
				console.log("fire2");
				plotStock(data, "Test")
			}else{
				console.log("fire3");
			}
			
		},
		error: function(e) {
			console.log(e)	
		}
	})
}

function plotStock(data, stockName){
	let trace = {
		x: data[0],
		close:data[4],
		high:data[1],
		low:data[2],
		open:data[3],
		increasing: {line:{color:"red"}},
		descreasing:{line:{color:"green"}},

		xaxis:"x",
		yaxis:"y"
	}
	let formatedData = [trace]
	let layout = {
		dragmode: "zoom",
		xaxis:{
			autorange:true,
			title:stockName,
			rangeselector:{
				x:0,
				y:1.2,
				xanchor:"left",
				font:{size:10},
				button:[{
					step:"month",
					stepmode:"backward",
					count:1,
					label:"1 month"
				},
				{
					step: "month",
					stepmode:"backward",
					count: 3,
					label: "3 months"
				},
				{
					step:"month",
					stepmode:"backward",
					count: 6,
					label:"6 months"
				},
				{
					step: "all",
					label: "All dates"
				}]
			}
		},
		yaxis:{
			autorange:true
		}
	}
	Plotly.plot("stockPlot", formatedData, layout);
	showViewResults()
	
	if($("#stockPlot").children().length == 0){
		inputInactive();
	}else {
		inputActive();
	}
}


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