const consoleLogDebbugBlynk = 0;
let data, oldRequest, dataType;

// Create a request variable and assign a new XMLHttpRequest object to it.

// const app = document.getElementById('root');
// console.log(app);

// const logo = document.createElement('img')
// logo.src = 'logo.png'

// const container = document.createElement('div')
// container.setAttribute('class', 'container')

// app.appendChild(logo)
// app.appendChild(container)

function unixConverter(UNIX_time, type){
	let a = new Date(UNIX_time);
	let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	let year = a.getFullYear();
	let month = months[a.getMonth()];
	let date = a.getDate();
	if (date <10){
		date = "0"+date;
	} 
	if (type === "MENSAL"){
		return (date + ' ' + month)
	}else if(type === "ANUAL"){
		return (month + ' ' + year)
	}else if (type === "year"){
		return year
	}else{
		return (date + ' ' + month + ' ' + year)
	}
}
// ---------------------------------------------------------------------------------------------

function seasonality(value, type){
	if(value > 27){
		return "MENSAL"
	}else if (value == 13){
		return "ANUAL"
	}else if (type == 2){
		return "PREVISTO"
	}else{
		return ""
	}
}
// ---------------------------------------------------------------------------------------------

function getNumberOfElements(data, dataType){
	let count = 0;

	// if (dataType == 0){
	// 	for (let key in data.t){
	//    	if(data.t.hasOwnProperty(key)){
	//    		count++
	//    }
	// 	};
	// 	return count
	// }else if (dataType == 2){
	// 	for (let key in data[0].tHist){
	// 	   	if(data[0].tHist.hasOwnProperty(key)){
	// 	   		count++
	// 	   }
	// 	};
	// 	for (let key in data[1].tPred){
	// 	   	if(data[1].tPred.hasOwnProperty(key)){
	// 	   		count++
	// 	   }
	// 	};
	// 	return count	
	// }
	for (let key in data){
	   	if(data.hasOwnProperty(key)){
	   		count++;
	   		console.log("works!");
	   	}
	}
	return count
}

// ---------------------------------------------------------------------------------------------

function updateGraph(){
	 dataType = 2;
	let request = new XMLHttpRequest();
	// Open a new connection, using the GET request on the URL endpoint
	request.open('GET', 'http://blynk-cloud.com/6nCttbNj4w4XJPcEwvpJk1MW6iG1iMeu/get/V0', true)
	// request.open('GET', 'http://blynk-cloud.com/4sYLFkG0xPGFOua7JKBTkpNSbTzcyATe/get/V12', true)
	request.onload = function() {
	    // Begin accessing JSON data here

	    
			let verif = this.response.slice(2,this.response.length-2);
			if (dataType == 0 || dataType == 1){

		  		data = JSON.parse(verif);
			}else{

		  		data = JSON.parse(verif);

			}

		  	//console.log("Dados data: ", data);

		console.log("old reque5t: ", request.status >= 200 && request.status < 400 && verif !== oldRequest);


		if (request.status >= 200 && request.status < 400 && verif !== oldRequest) {
	  		// const setDeDados = document.getElementById('myData');
	  		// const paragrafo = document.createElement('p');
	  		// paragrafo.textContent = unixConverter(data.t[0]);
	  		// setDeDados.appendChild(paragrafo);
	  		// console.log(new Date() > 1573704415000)
			let myArray = {
				numberOfElementsInObj: 0,
				numberOfElementsInObj2: 0,
				type:"Not Defined",
				unit: "R$",
			};

			if (dataType == 0){  //historico mensal/anual
				myArray.numberOfElementsInObj = getNumberOfElements(data.t, dataType);
				myArray.type = seasonality(myArray.numberOfElementsInObj, dataType)
			} else if (dataType == 1){ //historico por aparelho
				myArray.numberOfElementsInObj = data[0].length;
				myArray.type = seasonality(myArray.numberOfElementsInObj, dataType)
			} else if (dataType == 2){ //predição de consumo
				myArray.numberOfElementsInObj = getNumberOfElements(data[0].tHist, dataType);
				myArray.numberOfElementsInObj2 = getNumberOfElements(data[1].tPred, dataType);
				
				console.log("data[0].tHist::::", data[0].tHist);

				console.log("222222::::", myArray.numberOfElementsInObj2);
				myArray.type = seasonality(myArray.numberOfElementsInObj, dataType)

			}

			// console.log("myArray", myArray);

			
			let setDeDados = document.getElementById('box-title-message');
			setDeDados.textContent = `ANÁLISE DE CONSUMO ${myArray.type} (${myArray.unit})`;

			let paragrafo = document.createElement('p');


			if (dataType == 0){
				paragrafo.textContent = unixConverter(data.t[myArray.numberOfElementsInObj-1], "year");	
			}
	  		

	  		// console.log("teste: ", myArray.numberOfElementsInObj)  //---------------------------------------------------------
	  		paragrafo.setAttribute('class', 'dataSetYear')
	  		setDeDados.appendChild(paragrafo);

			let timeData = new Array;
			let energyData = new Array;
			let energyData2 = new Array;



			if (dataType == 0){
				for(let i =0; i<myArray.numberOfElementsInObj; i++){
					timeData.push(unixConverter(data.t[i], myArray.type));
					energyData.push(data.energy[i]*0.54 || data.energy[i]);
				}
			} else if (dataType == 1){
				//for(let i =0; i<myArray.numberOfElementsInObj; i++){
					//timeData.push(unixConverter(data[0][i], myArray.type));
					//energyData.push(data[1][i]*0.54 || data[1][i]);
				//}
			}else if (dataType == 2){
				
				console.log("data[0].tHist: ", myArray.numberOfElementsInObj);
				for(let i = 0; i<myArray.numberOfElementsInObj; i++){
					timeData.push(unixConverter(data[0].tHist[i+109], myArray.type));
					energyData.push(data[0].energyHist[i+109]*0.54 || data[0].energyHist[i+109]);
					energyData2.push(null);

				}
				for(let j = 0; j<myArray.numberOfElementsInObj2; j++){
					timeData.push(unixConverter(data[1].tPred[j], myArray.type));
					energyData2.push(data[1].energyPred[j]*0.54 || data[1].energyPred[j]);
				}

				console.log("timeData: ", timeData);

				console.log("energyData: ", energyData);

				console.log("energyData2: ", energyData2);
			}

			let chartistData = {
			  labels: undefined,
			  series: undefined
			};


			if (dataType == 0){

				 chartistData = {
				  labels: timeData,
				  series: [energyData]
				};
				let chartistOptions={
					//scale
					 low: 200,
					// fullWidth: false,
				    chartPadding: {
				    	left: 40,
				  	},
					// Draw the line chart points?
	  				showPoint: false,
	  				showArea: true,		
	  				// Line smoothing?
	 				lineSmooth: false,

	 				axisX:{
	 					// offset: 50,
	 					showGrid : true,    
	 				},
	 				axisY:{
	 					// offset: 50,
	 					showGrid : true,scaleMinSpace: 50,
	 				},
	 				
				};
			let chart = new Chartist.Line('.ct-chart', chartistData, chartistOptions);

			chart.on('draw', function(data) {
			  if(data.type === 'line' || data.type === 'area') {
			    data.element.animate({
			      d: {
			        begin: 0,
			        dur: 500,
			        from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
			        to: data.path.clone().stringify(),
			        easing: Chartist.Svg.Easing.easeOutQuint
			      }
			    });
			  }
			});




			}else if (dataType == 1){
				
				chartistData = {
					labels: data[0],
				 	series: data[1]
				};

				// chartistData = {
				// 	labels: ['Bananas', 'Apples', 'Grapes'],
				//     series: [20, 15, 40]
				// };



				let options = {
					// labelInterpolationFnc: function(value) {
				 //    	return value[0]
					// },
					donut: true,
					donutWidth: 60,
					
					showLabel: true
				};

				let responsiveOptions = [
				  ['screen and (min-width: 640px)', {
				    chartPadding: 30,
				    labelOffset: 100,
				    labelDirection: 'explode',
				    labelInterpolationFnc: function(value) {
				      return value;
				    }
				  }],
				  ['screen and (min-width: 1024px)', {
				    labelOffset: 40,
				    chartPadding: 20
				  }]
				];
			new Chartist.Pie('.ct-chart', chartistData, options, responsiveOptions);






			
			} else if (dataType == 2){

			//console.log("time data",timeData);

				chartistData = {
				  labels: timeData,
				  series:[
							 {
							 	name: 'series-1',
							    data: energyData
							 }, 
							 {
							    name: 'series-2',
							    data: energyData2
							 }
						 ]
				};
				let chartistOptions={
					//scale
					 low: 200,
					// fullWidth: false,
				    chartPadding: {
				    	left: 40,
				  	},
					// Draw the line chart points?
	  				showPoint: false,
	  				showArea: true,		
	  				// Line smoothing?
	 				lineSmooth: false,

	 				axisX:{
	 					// offset: 50,
	 					showGrid : true,    
	 				},
	 				axisY:{
	 					// offset: 50,
	 					showGrid : true,
	 					scaleMinSpace: 50,
	 				},
	 				
	 				series: {

				    'series-1': {
				      lineSmooth: false,
				    },
				    'series-2': {
				      lineSmooth: false,
				      showArea: true
				    },
				    
				  },


				};
			let chart = new Chartist.Line('.ct-chart', chartistData, chartistOptions);

			chart.on('draw', function(data) {
			  if(data.type === 'line' || data.type === 'area') {
			    data.element.animate({
			      d: {
			        begin: 2000 * data.index,
			        dur: 500,
			        from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
			        to: data.path.clone().stringify(),
			        easing: Chartist.Svg.Easing.easeOutQuint
			      }
			    });
			  }
			});

			}
			

		} else {
	  		//console.log('error')
		}
		

		oldRequest =  verif;
	}
	// Send request
	request.send()
}

// ---------------------------------------------------------------------------------------------
function getData(){
	let request = new XMLHttpRequest();
	// Open a new connection, using the GET request on the URL endpoint
	// request.open('GET', 'http://blynk-cloud.com/6nCttbNj4w4XJPcEwvpJk1MW6iG1iMeu/get/V0', true)
	request.open('GET', 'http://blynk-cloud.com/4sYLFkG0xPGFOua7JKBTkpNSbTzcyATe/get/V11', true)
	/*
	• Consulta de consumo energetico: 0;
	• Consulta de consumo energetico por aparelho: 1;
	• Predição de consumo energetico: 2.
	*/
	request.onload = function() {
	    // Begin accessing JSON data here
		// let verif = this.response.slice(2,this.response.length-2);
		// let verif = this.response;
	  	dataType = JSON.parse(this.response.slice(2,this.response.length-2))
	  	 //console.log("Dados recebidos: ", dataType, "lala");
		if (request.status >= 200 && request.status < 400) {
			// if not error
			updateGraph(dataType);				
		} else {
	  		//console.log('error')
		}
	}
	// Send request
	request.send()
}
// ---------------------------------------------------------------------------------------------







getData();


setInterval(getData,200);
