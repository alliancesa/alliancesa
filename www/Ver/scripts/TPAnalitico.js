var options
var dados
var chart
var options2
var dados2
var chart2

// --------------------------------- Graficos ---------------------------------
google.charts.load("current", {packages:['corechart', 'bar', 'table'],'language':'pt-BR'}); 
google.charts.setOnLoadCallback(Teares);

function Teares()
{
	dados = new google.visualization.DataTable();
	dados.addColumn('string', 'Máquina');
	dados.addColumn('number', 'Percentual');
	dados.addColumn({type:'string', role:'annotation'}); // annotation role col.
	dados.addColumn({type:'string', role:'style'});
	dados.addColumn({type:'string', role:'annotation'}); // annotation role col.
   
	chart = new google.visualization.ColumnChart(document.getElementById("TPSintetico"));
	chart.draw(dados, options);

	for (i = 0; i < 3; i++) {
		dados.addRows([ ['TEAR', 0, 'TEAR', 'RED', '0%']])   
	}
	//opçoes para o gráfico barras
	options = { 
		title : '% de Eficiencia',
		bar: {groupWidth: "20%"},		
		legend: { position: 'left' },
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

function LoadGraf01()
{

	$.ajax(
		{
			url: '/Fabrica/TearesPlanos/Eficiencia/0/' + TPSintetico.className
			,type: "get"
			,success : function(aDados)
			{
				for (i = 0; i < aDados.length; i++)
				{
					dados.setValue(i, 0, '1 Hora');
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
				}
			}
		});       
		
		$.ajax(
			{
				url: '/Fabrica/TearesPlanos/Eficiencia/12/' + TPSintetico.className
				,type: "get"
				,success : function(aDados)
				{
					for (i = 0; i < aDados.length; i++)
					{
						dados.setValue(i+1, 0, '12 Horas');
						dados.setValue(i+1, 1, aDados[i].PERCENTUAL);
						dados.setValue(i+1, 2, aDados[i].TOTAL_REAL.toString());
						
						if(aDados[i].PERCENTUAL>94)
						{
							dados.setValue(i+1, 3, "GREEN");
						} else { if(aDados[i].PERCENTUAL>85)
								{
									dados.setValue(i+1, 3, "YELLOW");
								} else {
									dados.setValue(i+1, 3, "RED");        
								}
						}
						dados.setValue(i+1, 4, aDados[i].PERCENTUAL.toString() +"%");  
					}
				}
			})
			$.ajax(
				{
					url: '/Fabrica/TearesPlanos/Eficiencia/242/' + TPSintetico.className
					,type: "get"
			
					,success : function(aDados)
					{
						for (i = 0; i < aDados.length; i++)
						{
							dados.setValue(i+2, 0, '24 Horas');
							dados.setValue(i+2, 1, aDados[i].PERCENTUAL);
							dados.setValue(i+2, 2, aDados[i].TOTAL_REAL.toString());
							
							if(aDados[i].PERCENTUAL>94)
							{
								dados.setValue(i+2, 3, "GREEN");
							} else { if(aDados[i].PERCENTUAL>85)
									{
										dados.setValue(i+2, 3, "YELLOW");
									} else {
										dados.setValue(i+2, 3, "RED");        
									}
							}
							dados.setValue(i+2, 4, aDados[i].PERCENTUAL.toString() +"%");  
						}
					}
				})	
		
		chart.draw(dados, options);  
}


google.charts.setOnLoadCallback(Teares24);

function Teares24() {
	
	dados2 = new google.visualization.DataTable();
	dados2.addColumn('string', 'Horarios');
	dados2.addColumn('number', "Média");
	dados2.addColumn('number', TPAnalitico.className);
	
	options2 = {
		hAxis: {title: 'Horários',  titleTextStyle: {color: '#333'}}
		,vAxis: {minValue: 0}
	}

	chart2 = new google.visualization.AreaChart(document.getElementById('TPAnalitico'));
	chart2.draw(dados2, options2);
	
}

function LoadGraf02()
{
	$.ajax(
	{
		url: '/Fabrica/TearesPlanos/Eficiencia/24/' + TPAnalitico.className
		,type: "get"

		,success : function(aDados)
		{
			var nTabela = dados2.getNumberOfRows()
			var nDados = aDados.length                     

			if (nDados > nTabela) {
				for (i = 0; i < (nDados-nTabela); i++) {
					dados2.addRows([ ['24:00:00', 0, 0] ])   
				}
			}
			var nMedia   = 0
			var nNominal = 0 
			for (i = 0; i < aDados.length; i++)
			{
				nMedia   = nMedia + aDados[i].PERCENTUAL
				nNominal = aDados[i].Nominal
			}
			nMedia = (nMedia / 24)
			for (i = 0; i < aDados.length; i++)
			{
				dados2.setValue(i, 0, aDados[i].HORA.toString());
				dados2.setValue(i, 1, nMedia);
				dados2.setValue(i, 2, aDados[i].PERCENTUAL);
			}
		}
	});
	chart2.draw(dados2, options2);
}

function LoadFalhas()
{
	aFalhas = [];	

	$.each( $( ".Percentuais" ), function() {
		if(this.id.match(/TP/) ){	
			aFalhas.push(this.id);
	   };
   });

	$.ajax(
	{
		url: '/Fabrica/TearesPlanos/Falhas/' + TPSintetico.className
		,type: "get"

		,success : function(aDados)
		{
			if(aFalhas.length != aDados.length){
				location.reload(true); // atualiza pagina inteira
			}	

			for (i = 0; i < aDados.length; i++)
			{
				PER_FALHAS = document.getElementById(aDados[i].MAQUINA + "_" + aDados[i].FALHA.toString() + "_" + "PER_FALHAS");
				
				//carrega dados
				PER_FALHAS.innerHTML    = aDados[i].PER_FALHAS    + '%'; 
				if(aDados[i].PER_PARADA > 0) {
					PER_PARADA.innerHTML    = aDados[i].PER_PARADA 	  + '%'; 
				}
				PER_DESLIGADA.innerHTML = aDados[i].PER_DESLIGADA + '%'; 
			}
		}
	});
}

function Status()
{
	$.ajax(
	{
		url: '/Fabrica/TearesPlanos/Info/' + TPSintetico.className
		,type: "get"

		,success : function(aDados)
		{
			for (i = 0; i < aDados.length; i++)
			{	
				if(aDados[i].EFICIENCIA>94)
				{
					document.getElementById(aDados[i].MAQUINA + "_Eficiencia").style.color          = 'GREEN'; 
				} else { if(aDados[i].EFICIENCIA>85)
						{
							document.getElementById(aDados[i].MAQUINA + "_Eficiencia").style.color  = 'YELLOW';
						} else {
							document.getElementById(aDados[i].MAQUINA + "_Eficiencia").style.color  = 'RED';    
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
function LoadGraf03(){}

// aguarda 1 segundo e carrega dados
var n = 0    
setInterval(function () {
    if(n==0) {
		LoadGraf01()
		LoadGraf02()
		LoadGraf03()
		LoadFalhas()
		Status()
		n++
    }
}, 1000);
    