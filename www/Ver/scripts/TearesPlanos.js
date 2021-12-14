
var options
var dados
var chart
var data2;
var options2;
var chart2;
var data3;
var options3;
var chart3;


function Status()
{
	var Cards = document.querySelectorAll('div#Cards')
	$.ajax(
	{
		url: '/Fabrica/TearesPlanos/Info', 
		type: "get",   

		
		success : function(aDados)
		{
			for (i = 0; i < aDados.length; i++)
			{	
				
				if(aDados[i].STATUS !='Funcionando') {
					Cards[i].classList.add("atencao");

				} else {
					if(aDados[i].EFICIENCIA>94)
					{
						Cards[i].classList.remove(Cards[i].classList[6])
						Cards[i].classList.add("correto");
					} else { if(aDados[i].EFICIENCIA>85)
							{
								Cards[i].classList.remove(Cards[i].classList[6])
								Cards[i].classList.add("alerta");
							} else {
								Cards[i].classList.remove(Cards[i].classList[6])
								Cards[i].classList.add("atencao");
							}
					}
				}

				document.getElementById(aDados[i].MAQUINA + "_Eficiencia").innerHTML = aDados[i].EFICIENCIA;
				document.getElementById(aDados[i].MAQUINA + "_Nominal").innerHTML = aDados[i].NOMINAL;
				document.getElementById(aDados[i].MAQUINA + "_BPM").innerHTML = aDados[i].BPM; 
				document.getElementById(aDados[i].MAQUINA + "_Batidas").innerHTML = aDados[i].BATIDAS;
				document.getElementById(aDados[i].MAQUINA + "_Status").innerHTML = aDados[i].STATUS;                          	
			}
		}
  });  
}

// --------------------------------- Status ---------------------------------

function Percentuais()
{
	$.ajax(
	{
		url: '/Fabrica/TearesPlanos/Status', 
		type: "get",   

		success : function(aDados)
		{
			for (i = 0; i < aDados.length; i++)
			{						
				// Carrega dados
				document.getElementById("PerParado").style.width      = aDados[i].PER_PARADAS + '%'; 
				PerParado.innerHTML        = aDados[i].PER_PARADAS + '%';
				QtdParado.innerHTML 	   = aDados[i].PARADAS;

				document.getElementById("PerFalhas").style.width      = aDados[i].PER_FALHAS + '%'; 
				PerFalhas.innerHTML        = aDados[i].PER_FALHAS + '%';
				QtdFalhas.innerHTML 	   = aDados[i].FALHAS;

				document.getElementById("PerDesligados").style.width  = aDados[i].PER_DESLIGADAS + '%'; 
				PerDesligados.innerHTML    = aDados[i].PER_DESLIGADAS + '%'; 		
				QtdDesligados.innerHTML    = aDados[i].DESLIGADAS;  

				QtdTotal.innerHTML 		   = aDados[i].TOTAL;

				document.getElementById("PerFuncionando").style.width = aDados[i].PER_FUNCIONANDO + '%'; 
				PerFuncionando.innerHTML   = aDados[i].PER_FUNCIONANDO + '%'; 		
				QtdFuncionando.innerHTML   = aDados[i].FUNCIONANDO;  

			}
		}
	});   
}


// --------------------------------- Tempo entre Status ---------------------------------


function Cronometro()
{
	$.ajax({
		url: '/Fabrica/TearesPlanos/Info', 
		type: "get",   

		success : function(aDados)
		{
			for (i = 0; i < aDados.length; i++)
			{	
				aSecs[i][1]++;
				if(aSecs[i][1]==60){aSecs[i][1]=0;aMins[i][1]++;
					if(aMins[i][1]<=9)aMins[i][1]="0"+aMins[i][1];
				}
				if(aMins[i][1]==60){aMins[i][1]="0"+0;aHors[i][1]++;
					if(aHors[i][1]<=9)aHors[i][1]="0"+aHors[i][1];
				}
				if(aSecs[i][1]<=9)aSecs[i][1]="0"+aSecs[i][1];

				document.getElementById(aSecs[i][0] + "_TempoStatus").innerHTML	=	aHors[i][1]+":"+aMins[i][1]+":"+aSecs[i][1];
			}
			
		}
	})           
}

var aHors = []
var aMins = []
var aSecs = []

$.ajax({
	url: '/Fabrica/TearesPlanos/Info', 
	type: "get",   

	success : function(aDados)
	{
		for (i = 0; i < aDados.length; i++)
		{		
			var aMaquinas = []

			aMaquinas.push(aDados[i].MAQUINA)
			aMaquinas.push("0"+0)
			
			aHors.push(aMaquinas)

			aMaquinas = []

			aMaquinas.push(aDados[i].MAQUINA)
			aMaquinas.push("0"+0)

			aMins.push(aMaquinas)
			
			aMaquinas = []

			aMaquinas.push(aDados[i].MAQUINA)
			aMaquinas.push(0)

			aSecs.push(aMaquinas)
		}
	}
})


//setInterval('Cronometro()',1000);


// --------------------------------- Graficos ---------------------------------
 google.charts.load("current", {packages:['corechart', 'bar', 'table'],'language':'pt-BR'}); 
 google.charts.setOnLoadCallback(Teares);
 google.charts.setOnLoadCallback(Teares2);

 function Teares()
 {
	 dados = new google.visualization.DataTable();
	 dados.addColumn('string', 'Máquina');
	 dados.addColumn('number', 'Percentual');
	 dados.addColumn({type:'string', role:'annotation'}); // annotation role col.
	 dados.addColumn({type:'string', role:'style'});
	 dados.addColumn({type:'string', role:'annotation'}); // annotation role col.
	
	 chart = new google.visualization.ColumnChart(document.getElementById("Teares"));
	 chart.draw(dados, options);
}


function Teares2()
{
	dados3 = new google.visualization.DataTable();
	dados3.addColumn('string', 'Máquina');
	dados3.addColumn('number', 'Percentual');
	dados3.addColumn({type:'string', role:'annotation'}); // annotation role col.
	dados3.addColumn({type:'string', role:'style'});
	dados3.addColumn({type:'string', role:'annotation'}); // annotation role col.
 
	chart3= new google.visualization.ColumnChart(document.getElementById("Teares2"));
	chart3.draw(dados3, options3);
}
//google.charts.setOnLoadCallback(Turnos);

function Turnos() {
	// Some raw data (not necessarily accurate)
	//data2 = google.visualization.arrayToDataTable([
	//	['Dias'   ,   'A',      'B',         'C' ],
	//	['2004/05',   165,      938,         522 ],
	//]);
	
	dados2 = new google.visualization.DataTable();
	dados2.addColumn('string', 'Dias');
	dados2.addColumn('number', 'A');
	dados2.addColumn({type:'string', role:'annotation'}); // annotation role col.
	dados2.addColumn({type:'string', role:'style'});
	dados2.addColumn({type:'string', role:'annotation'}); // annotation role col.
	dados2.addColumn({type:'string', role:'annotation'}); // annotation role col.
	dados2.addColumn({type:'string', role:'annotation'}); // annotation role col.
	dados2.addColumn('number', 'B');
	dados2.addColumn({type:'string', role:'annotation'}); // annotation role col.
	dados2.addColumn({type:'string', role:'style'});
	dados2.addColumn({type:'string', role:'annotation'}); // annotation role col.
	dados2.addColumn({type:'string', role:'annotation'}); // annotation role col.
	dados2.addColumn({type:'string', role:'annotation'}); // annotation role col.
	dados2.addColumn('number', 'C');
	dados2.addColumn({type:'string', role:'annotation'}); // annotation role col.
	dados2.addColumn({type:'string', role:'style'});
	dados2.addColumn({type:'string', role:'annotation'}); // annotation role col.
	dados2.addColumn({type:'string', role:'annotation'}); // annotation role col.
	dados2.addColumn({type:'string', role:'annotation'}); // annotation role col.

	for (i = 0; i < 1; i++)
	{
		dados2.addRows(
			[
				['12/02/2019', 0, '9999', 'BLUE'  ,'0%', '', 'A', 
							   0, '9999', 'GREEN' ,'0%', '', 'B', 
							   0, '9999', 'YELLOW','0%', '', 'C']
			]
		);   
   };

	options2 = {
		title : '% de Eficiencia por Turnos',
		bar: {groupWidth: "50%"},
		legend: {
				 //position: 'bottom', 
				 position: "none"
		},
		//		 textStyle: {
		//			 		 color: 'black',
		//					 fontSize: 16,
		//					 bold: true,		
		//		}},
		vAxis: {
				title: '%',
				titleTextStyle: {
					color: '#1a237e',
					fontSize: 11,
					bold: true
					},
					'minValue': 0, 
					'maxValue': 120
		},
		hAxis: {
				title: 'Turnos'
		},
		seriesType: 'bars',		
		series: {5: {type: 'line'}
	
		},
		titleTextStyle: {
			color: '#1a237e',
			fontSize: 11,
			bold: true
			},		
	};

	chart2 = new google.visualization.ComboChart(document.getElementById('Turnos'));
	chart2.draw(dados2, options2);
}


function LoadGraf01()
{

	$.ajax(
		{
			url: '/Fabrica/TearesPlanos/Eficiencia/1/1', 
			type: "get",   
	
			success : function(aDados)
			{
				var nTabela = dados.getNumberOfRows()
				var nDados = aDados.length                     

				if (nDados > nTabela) {
					Teares()
					for (i = 0; i < nDados; i++) {
						dados.addRows([ ['TEAR', 0, 'TEAR', 'RED', '0%']])   
					}
				}

				for (i = 0; i < aDados.length; i++)
				{
					dados.setValue(i, 0, aDados[i].MAQUINA);
					dados.setValue(i, 1, aDados[i].PERCENTUAL);
					dados.setValue(i, 2, aDados[i].TOTAL_REAL.toString());
					
					if(aDados[i].PERCENTUAL>94)
					{
						dados.setValue(i, 3, "GREEN");
					} else { if(aDados[i].PERCENTUAL>85)
							{
								dados.setValue(i, 3, "YELLOW");
							} else {
								dados.setValue(i, 3, "RED");        
							}
					}
					dados.setValue(i, 4, aDados[i].PERCENTUAL.toString() +"%");  
					chart.draw(dados, options);
				}
					//opçoes para o gráfico barras
					options = { 
						title : '% de Eficiencia da última Hora',
						bar: {groupWidth: "20%"},		
						legend: { position: 'none' },
						hAxis: {
								title: '',
								textStyle: {
											color: '#01579b',
											fontSize: 11,
											fontName: 'Arial',
											bold: true,
											italic: false
											},
								titleTextStyle: {
													color: '#01579b',
													fontSize: 11,
													fontName: 'Arial',
													bold: false,
													italic: true
												}
						},
						vAxis: {
									title: '%',
									textStyle: {
												color: '#1a237e',
												fontSize: 11,
												bold: true
												},
									titleTextStyle: {
													color: '#1a237e',
													fontSize: 11,
													bold: true
													},
									'minValue': 0, 
									'maxValue': 120
								}, 
								annotations: {
											alwaysOutside : true,
											textStyle: {
														fontSize: 12,
														bold: true,
														italic: false,
														color: '#871b47',
														auraColor: '#00',
														opacity: 0.8
														}
											}	
					};
			}
		});               
		chart.draw(dados, options);  
}

function LoadGraf02(){}
/*
{
	$.ajax(
		{
			url: ':3000/TearTurnos', 
			type: "get",   
	
			success : function(aDados)
			{
				for (i = 0; i < aDados.length; i++)
				{
					dados2.setValue(0, 0, aDados[i].DATA);

					dados2.setValue(0, 1,  aDados[i].PERCENTUAL_A);
					dados2.setValue(0, 2,  aDados[i].TOTAL_A.toString());
					dados2.setValue(0, 3,  'BLUE');
					dados2.setValue(0, 4,  aDados[i].PERCENTUAL_A + '%');
					dados2.setValue(0, 5,  '');
					dados2.setValue(0, 6,  'A');
					
					dados2.setValue(0, 7,  aDados[i].PERCENTUAL_B);
					dados2.setValue(0, 8,  aDados[i].TOTAL_B.toString());
					dados2.setValue(0, 9,  'GREEN');
					dados2.setValue(0, 10,  aDados[i].PERCENTUAL_B + '%');
					dados2.setValue(0, 11,  '');
					dados2.setValue(0, 12,  'B');
					
					dados2.setValue(0, 13,  aDados[i].PERCENTUAL_C);
					dados2.setValue(0, 14,  aDados[i].TOTAL_C.toString());
					dados2.setValue(0, 15,  'YELLOW');
					dados2.setValue(0, 16,  aDados[i].PERCENTUAL_C + '%');
					dados2.setValue(0, 17,  '');
					dados2.setValue(0, 18,  'C');
				}
			}
		});               
		chart2.draw(dados2, options2);  
}
*/
function LoadGraf03(){

	$.ajax(
		{
			url: '/Fabrica/TearesPlanos/Eficiencia/1/2', 
			type: "get",   
	
			success : function(aDados)
			{
				var nTabela = dados3.getNumberOfRows()
				var nDados = aDados.length                     

				if (nDados > nTabela) {
					Teares2()
					for (i = 0; i < nDados; i++) {
						dados3.addRows([ ['TEAR', 0, 'TEAR', 'RED', '0%']])   
					}
				}

				for (i = 0; i < aDados.length; i++)
				{
					dados3.setValue(i, 0, aDados[i].MAQUINA);
					dados3.setValue(i, 1, aDados[i].PERCENTUAL);
					dados3.setValue(i, 2, aDados[i].TOTAL_REAL.toString());
					
					if(aDados[i].PERCENTUAL>94)
					{
						dados3.setValue(i, 3, "GREEN");
					} else { if(aDados[i].PERCENTUAL>85)
							{
								dados3.setValue(i, 3, "YELLOW");
							} else {
								dados3.setValue(i, 3, "RED");        
							}
					}
					dados3.setValue(i, 4, aDados[i].PERCENTUAL.toString() +"%");  
					chart3.draw(dados3, options3);  
				}
					//opçoes para o gráfico barras
					options3 = { 
						title : '% de Eficiencia da última Hora',
						bar: {groupWidth: "20%"},		
						legend: { position: 'none' },
						hAxis: {
								title: '',
								textStyle: {
											color: '#01579b',
											fontSize: 11,
											fontName: 'Arial',
											bold: true,
											italic: false
											},
								titleTextStyle: {
													color: '#01579b',
													fontSize: 11,
													fontName: 'Arial',
													bold: false,
													italic: true
												}
						},
						vAxis: {
									title: '%',
									textStyle: {
												color: '#1a237e',
												fontSize: 11,
												bold: true
												},
									titleTextStyle: {
													color: '#1a237e',
													fontSize: 11,
													bold: true
													},
									'minValue': 0, 
									'maxValue': 120
								}, 
								annotations: {
											alwaysOutside : true,
											textStyle: {
														fontSize: 12,
														bold: true,
														italic: false,
														color: '#871b47',
														auraColor: '#00',
														opacity: 0.8
														}
											}	
					};
			}
		});      
		chart3.draw(dados3, options3);  
}


// aguarda 1 segundo e carrega dados
var n = 0    
setInterval(function () {
    if(n==0) {
		LoadGraf01()
		LoadGraf02()
		LoadGraf03()
		Status()
		n++
    }
}, 1000);
    