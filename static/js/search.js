$(document).ready(function() {
	
	// if (!inCodePenEditor()) {
	// 	$("#search-input").focus();
	// }

	// mode of form elements changes on input
	$("#search-input").on('input', function() {
		if (isEmpty($("#search-input").val())) {
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

	// bind window resize to manually adjust card image height, in order to maintain required aspect ratio of card images
	// $(window).resize(function() {
	// 	setCardImgHeight();
	// });

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
	$("#cards").empty();
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
		getStockData(searchTerm);
		showViewResults();
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
		close:data[1],
		high:data[2],
		low:data[3],
		open:data[4],
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
}

// Query Wikipedia api for search term
// function getSearchResults(searchTerm) {
// 	var endPoint = "https://en.wikipedia.org/w/api.php";
// 	// get url encoded query parameter string
// 	var params = "?" + $.param({
// 		action: "query",
// 		generator: "search",
// 		gsrsearch: searchTerm,
// 		gsrnamespace: 0,
// 		gsrlimit: 12, // search limit
// 		prop: "pageimages|extracts|info",
// 		pithumbsize: 200, // size of pageimages
// 		pilimit: "max", // should be 'max' to get all the available relevant page images
// 		exsentences: 1, // number of sentences to retrieve
// 		exintro: 1, // retrieve only introductory content
// 		explaintext: 1, // retrieve content in plain text
// 		exlimit: "max", // should be 'max' to get all the available page extracts
// 		inprop: "url",
// 		format: "json",
// 		formatversion: 2 // retrieves properly formatted json array
// 	});

// 	$.getJSON(endPoint + params + "&callback=?", function(data) {

// 		if ('undefined' !== typeof data.query) {
// 			$("#stockPlot").append(resultCardHtml(data.query.pages));
// 			// manually set height of card images, since the width is already known
// 			setCardImgHeight();
// 		} else {
// 			$("#stockPlot").append(encapsulate("No results found", "p", ""));
// 		}

// 	}).fail(function(jqXHR, status, error) {
// 		console.log(jqXHR.responseText);
// 	});
// }

// Build cards elements from 'pages' array
// function resultCardHtml(pages) {
// 	var html = "";
// 	pages.forEach(function(page) {
// 		var imgSrc = 'undefined' !== typeof page.thumbnail ?
// 			page.thumbnail.source : "https://placehold.it/200x150/e6e6e6?text=Image+unavailable";
// 		// build elements to be appended to #cards
// 		var image = encapsulate(false, "img", "src='" + imgSrc + "' alt='Main Wikipedia image for " + page.title + "'");
// 		var imageDiv = encapsulate(image, "div", "class='card-image'");
// 		var title = encapsulate(page.title, "h2", "");
// 		var titleDiv = encapsulate(title, "div", "class='card-title'");
// 		var text = encapsulate(page.extract, "p", "");
// 		var textDiv = encapsulate(text, "div", "class='card-text'");
// 		var action = encapsulate("READ MORE", "a", "href='" + page.canonicalurl + "' target='_blank'");
// 		var actionDiv = encapsulate(action, "div", "class='card-actions'");
// 		html = html + encapsulate(imageDiv + titleDiv + textDiv + actionDiv, "div", "class='card'");
// 	});

// 	return html;
// }

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