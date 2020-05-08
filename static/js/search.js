$(document).ready(function() {

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
	$("#stockTable").empty();
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

//require fuzzey
function searchStock(searchTerm) {
	if (isEmpty(searchTerm)) {
		// openRandomArticle();
		// Seach S$P information
		getStockData("^GSPC")
	} else {
		searchTerm = fuzzyQuery(searchTerm);
		if(searchTerm){
			//add for fuzzy query
			// 	console.log(searchTerm);
				getStockData(searchTerm);
				showViewResults();

		}else{
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
        success: function (data) {
			if(data){
				// console.log(data, stock_name)
				// console.log(typeof(data))
				// call the plotly function here
				console.log("fire2");
				plotStock(data, stockName) 
				let tableData = {
					RSI:data[7][data[7].length - 1],
					monthly_sma:data[10][data[1].length - 1],
					MACD:data[11][data[11].length - 1],
					data:data
				}
				if(stockName!="^GSPC"){
					plotStockStat(tableData, stockName)
				}
				
			}else{
				console.log("fire3");
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
		name:stockName,
		increasing: {line: {color: 'green'}}, 
		decreasing: {line: {color: 'red'}}, 
		line: {color: 'rgba(31,119,180,1)'}, 
		type: 'candlestick',
		xaxis:"x",
		yaxis:"y"
	},
	{
		// Close 2
		x: data[0],
		y:data[4],
		mode:"lines",
		name:"Close",
		marker: {color: '#835AF1'},
		visible:false,
		width:0.5,
		yaxis:"y"
	},
	{
		// Low 3
		x: data[0],
		y:data[2],
		mode: 'lines',
		name: 'Low',
		marker: {color: '#F06A6A'},
		visible: false,
		yaxis:"y"
	},
	{
		// High 4
		x: data[0],
		y:data[1],
		mode: 'lines',
		name: 'High',
		marker: {color: '#33CFA5'},
		visible: false,
		yaxis:"y"
	},
	{
		// Clsoe Average 5
		x: data[0],
		y:data[0].map(a => closeAvg),
		mode: 'lines',
		name: 'Close average',
		line: {color: '#835AF1',dash:"dash"},
		visible: false,
		yaxis:"y"
	},
	{
		// Low average 6
		x: data[0],
		y:data[0].map(a => lowAvg),
		mode: 'lines',
		name: 'Low average',
		line: {color: '#F06A6A',dash:"dash"},
		visible: false,
		yaxis:"y"
	},
	{
		// High average 7
		x: data[0],
		y:data[0].map(a => highAvg),
		mode: 'lines',
		name: 'High average',
		line: {color: '#33CFA5',dash:"dash"},
		visible: false,
		yaxis:"y"
	},
	{
		// 10 MA 8
		x:data[0],
		y:data[8],
		mode:"lines",
		name:"10 MA",
		marker:{color:"#f4b80e"},
		visible:false,
		yaxis:"y"
	},
	{
		// 10 MA 9
		x:data[0],
		y:data[9],
		mode:"lines",
		name:"20 MA",
		marker:{color:"#f4b80e"},
		visible:false,
		yaxis:"y"
	},
	{
		// month MA 10
		x:data[0],
		y:data[10],
		mode:"lines",
		name:"month MA",
		marker:{color:"#f4b80e"},
		visible:false,
		yaxis:"y"
	},
	{
		// RSI 11
		x:data[0],
		y:data[7],
		mode:"lines",
		name:"RSI",
		marker:{color:"#4f5fb7"},
		visible:false,
		yaxis:"y2"
	},
	{
		// MACD 12
		x:data[0],
		y:data[11],
		mode:"lines",
		name:"MACD",
		marker:{color:"#73808e"},
		visible:false,
		yaxis:"y3"
	},
	{
		// MACD signal 13
		x:data[0],
		y:data[12],
		mode:"lines",
		name:"MACD Signal",
		marker:{color:"#f6c3cb"},
		visible:false,
		yaxis:"y3"
	}
	]

	let button_layer_1_height = 1.12;
	let button_layer_2_height = 1.0;
	let annotation_offset = 0.04;

	let updatemenus = [
		{
			buttons:[
				{
					args: [{'visible': [true, false, false, false, false, false, false, false, false, false ,false, false, false],},
							{'title': `${stockName} Candle`}],
					label: 'Candle',
					method: 'update'
				},
				{
					args: [{'visible': [false, true, false, false, true, false, false, false, false, false ,false, false, false]},
							{'title': `${stockName} Close`}],
					label: 'Close',
					method: 'update'
				},
				{
					args: [{'visible': [false, false, true, false, false, true, false, false, false, false ,false, false, false]},
						   {'title': `${stockName} Low`}],
					label: 'Low',
					method: 'update'
				},
				{
					args: [{'visible': [false, false, false, true, false, false, true, false, false, false ,false, false, false]},
						   {'title': `${stockName} High`}],
					label: 'High',
					method: 'update'
				},
				{
					args: [{'visible': [true, false, false, false, false, false, false, true, false, false ,false, false, false]},
						   {'title': `${stockName} 10 MA`}],
					label: '10 MA',
					method: 'update'
				},
				{
					args: [{'visible': [true, false, false, false, false, false, false, false, true, false ,false, false, false]},
						   {'title': `${stockName} 20 MA`}],
					label: '20 MA',
					method: 'update'
				},
				{
					args: [{'visible': [true, false, false, false, false, false, false, false, false, true ,false, false, false]},
						   {'title': `${stockName} month MA`}],
					label: 'month MA',
					method: 'update'
				},
				{
					args: [{'visible': [true, false, false, false, false, false, false, false, false, false ,true, false, false]},
						   {'title': `${stockName} RSI`,
						   "yaxis2.visible":true, 
						   "yaxis2.position":1,
						   "yaxis3.visible":false}],
					label: 'RSI',
					method: 'update'
				},
				{
					args: [{'visible': [true, false, false, false, false, false, false, false, false, false ,false, true, true]},	
						   {'title': `${stockName} MACD`,
						   "yaxis3.visible":true, 
						   "yaxis3.position":1,
						   "yaxis2.visible":false
						}],
					label: 'MACD',
					method: 'update'
				}
			]
		}
	
	]

	let layout = {
		dragmode: "zoom",
		showlegend: true,
		type: 'date',
		title:stockName,
		updatemenus:updatemenus,
		width: 1000,
		yaxis:{

		},
		yaxis2: {
			title: 'RSI',
			titlefont: {color: '#4f5fb7'},
			tickfont: {color: '#4f5fb7'},
			anchor: 'free',
			overlaying: 'y',
			side: 'right',
			range: [0, 100],
			position:1,
			visible:false,
			zeroline:false
		},
		yaxis3: {
			title: 'MACD',
			titlefont: {color: '#73808e'},
			tickfont: {color: '#73808e'},
			anchor: 'free',
			overlaying: 'y',
			side: 'right',
			autorange:true,
			position:1,
			visible:false
		}
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
	let values = [
		[stockName], [data.RSI],[data.monthly_sma], [data.MACD], [buy_sell(data.data)]
	]

	let tableData = [
		{
			type:"table",
			header: {
				values: [["stock Name"], ["RSI"],["monthly_MA"], ["MACD"], ["Buy/Sell"]],
				align: "center",
				line: {width: 1, color: 'black'},
				fill: {color: "#F06A6A"},
				font: {family: "Arial", size: 12, color: "white"}
			  },
			  cells: {
				values: values,
				align: "center",
				line: {color: "black", width: 1},
				font: {family: "Arial", size: 11, color: ["black"]}
			  }
		}
	]
	Plotly.newPlot('stockTable', tableData);
}

// ========================== Table plot function ==========================
// function plotIndicator(data){
// 	let trace = [
// 		{
// 		x: data[0],
// 		close:data[4],
// 		high:data[1],
// 		low:data[2],
// 		open:data[3],
// 		name:stockName,
// 		increasing: {line: {color: 'green'}}, 
// 		decreasing: {line: {color: 'red'}}, 
// 		line: {color: 'rgba(31,119,180,1)'}, 
// 		type: 'candlestick',
// 		xaxis:"x",
// 		yaxis:"y"
// 	},
// 	{
// 		// Close
// 		x: data[0],
// 		y:data[4],
// 		mode:"lines",
// 		name:"Close",
// 		marker: {color: '#835AF1'},
// 		visible:false,
// 		width:0.5
// 	}]
// }

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

function fuzzyQuery(str){
    let arr=[];
    list = eval(tickList);
    //console.log(list);
    str = str.toUpperCase();
    for(let i=0;i<list.length;i++){
        //match the code first
        if( (list[i].code).match(str) !=null){
            arr.push(list[i].code);
        }else if( ((list[i].name)).toUpperCase().match(str) !=null){
            arr.push(list[i].code);
        }
    }

    return arr[0];
};

// ========================== Buy/Sell recommender ==========================
function buy_sell(data){
	let buy = 0;
	let sell = 0;
	let RSI = data[7][data[7].length - 1];
	let allRSI = data[7];
	let macdDiff = data[13];
	let n = macdDiff.length
	if (RSI >= 70){
		return "This stock is overbought"
	}
	else if (RSI <= 30){
		return "This stock is oversold"
	}
	else if (RSI >= 65){
		return "recommend to sell"
	}
	else if(RSI <= 35){
		return "recommend to buy"
	}
	else{
		let a = "";
		let count = 0;
		for(i=1; i < 11;i++){
			if (macdDiff[n - i] < 0 && macdDiff[n - i - 1] > 0){
				a = "Bearish,";
				break
			}
			else if(macdDiff[n - i] > 0 && macdDiff[n - i-1] < 0){
				a = "Bullish,"
				break
			}
		}

		for(i=1; i < 11;i++){
			if (macdDiff[n - i] < 0 && macdDiff[n - i - 1] > 0){
				count = count + 1;
			}
			if(macdDiff[n - i] > 0 && macdDiff[n - i] < 0){
				count = count + 1;
			}
			if (count > 2){
			    a = ''
			}
		}

		for(i = 1; i < 6; i ++){
			if (allRSI[n - i] > allRSI[n - i - 1]){
				sell += 1;
			}
			else if (allRSI[n - i] < allRSI[n - i - 1]){
				buy += 1
			}
			else if (Math.min(allRSI.splice(n-20,n-1)) == RSI){
				sell = 0
			}
			else if (Math.max(allRS.slice(n-20,n-1)) == RSI){
				buy = 0
			}
		}
		let suggest = buy - sell;
		if (suggest >= 3){
			return a + "recommend to buy";
		}else if(suggest < 3){
			return a + "recommend to sell"
		}else if (suggest > 0){
			return a + "consider to buy"
		}else if (suggest < 0){
			return a + "consider to sell"
		}
	}
}