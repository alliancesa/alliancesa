var dados;
var dados2;
var dados3;
var options;
var options2;
var options3;
var chart;
var chart2;
var chart3;
var Data1 
var Data2

google.charts.load("current", {packages:['corechart', 'bar', 'table', 'gauge'],'language':'pt-BR'});

google.charts.setOnLoadCallback(Capacidade);

function Capacidade() 
{
	// ARRAY PARA MONTAGEM DOS DADOS
	dados = google.visualization.arrayToDataTable([
		['Label', 'Value'],
		['Pressao', 0],	   	
	]);
	
	//opcoes para o grafico barras	
	options = {
			width: 200, height: 185,manual
			greenFrom: 85, greenTo: 100,
			redFrom: 0, redTo: 75,
			yellowFrom:75, yellowTo: 85,
		minorTicks: 10,
		max: 12
	};

	//opcoes carregar os graficos             
	chart = new google.visualization.Gauge(document.getElementById('Capacidade'));
	chart.draw(dados, options);

}

google.charts.setOnLoadCallback(DadosHora);

function DadosHora() {
	dados2 = new google.visualization.DataTable();
	dados2.addColumn('string', 'Horarios');
	dados2.addColumn('number', 'Pressao');
	
	options2 = {
		//title: 'Registros de Pressão dos ultimos 30 minutos',
		hAxis: {title: 'Horários',  titleTextStyle: {color: '#333'}},
		vAxis: {minValue: 0}
	};

	chart2 = new google.visualization.AreaChart(document.getElementById('chart_hora'));
	chart2.draw(dados2, options2);
	
}


function Pressao2()
{
	$.ajax(
	{
		url: '/Fabrica/Pressao/Relogio',
		type: "get",   

		success : function(aDados)
		{
			for (i = 0; i < aDados.length; i++)
			{
				dados.setValue(0, 0, aDados[i].TITULO);
				dados.setValue(0, 1, aDados[i].PRESSAO);
				
				$('#PB').html(aDados[i].PRESSA_MIN);
				$('#PA').html(aDados[i].PRESSAO_MAX);
				$('#PE').html(aDados[i].PRESSAO);
				$('#DT').html(aDados[i].DATA);
					
				//var cMin    = (aDados[i].PRESSA_MIN * 100 / aDados[i].PRESSAO_MAX) ;
				var cMax    = aDados[i].PRESSAO_MAX ;
				var cMin    = aDados[i].PRESSA_MIN ;
				var cStatus = aDados[i].ALARM;

				if(cStatus == 0) {	
					options = { 
								width: 200, height: 185,							 
								greenFrom: parseFloat(cMax*0.85), greenTo: cMax,
								redFrom: 0, redTo: parseFloat(cMin),
								yellowFrom: parseFloat(cMin), yellowTo: parseFloat(cMax*0.85),
								minorTicks: 10,
								max: cMax
								};
				} else	{
					options = {
								width: 200, height: 185,	
								greenFrom: 0, greenTo: 0,
								yellowFrom: 0, yellowTo: 0,
								redFrom: 0, redTo: 200,
								};
				}
				//Cor();
				if(cStatus) {
					document.getElementById("PE").style.backgroundColor = "red"
				} else {
					document.getElementById("PE").style.backgroundColor = "white"				
				}
				chart.draw(dados, options);
			}
			chart.draw(dados, options);
		}	
	});			
	chart.draw(dados, options);
}

function Pressao()
{
	$.ajax(
	{
		url: '/Fabrica/Pressao/Pressao24',
		type: "get",   

		success : function(aDados)
		{
			dados2 = new google.visualization.DataTable();

			dados2.addColumn('string', 'Horarios');
			dados2.addColumn('number', 'Pressao');

			for (i = 0; i < aDados.length; i++)
			{
				dados2.addRows(
					[
						['24:00:00', 0]
					]
				)
			}

			for (i = 0; i < aDados.length; i++)
			{
				dados2.setValue(i, 0, aDados[i].HORA);
				dados2.setValue(i, 1, aDados[i].PRESSAO);
			}
		}
	});
	chart2.draw(dados2, options2);
}



google.charts.setOnLoadCallback(Busca);

function Busca() {
	
	dados3 = new google.visualization.DataTable();
	dados3.addColumn('string', 'Horarios');
	dados3.addColumn('number', 'Pressao');
	
	options3 = {
		//title: 'Registros de Pressão dos ultimos 30 minutos',
		hAxis: {title: 'Horários',  titleTextStyle: {color: '#333'}},
		vAxis: {minValue: 0}
	};

	chart3 = new google.visualization.AreaChart(document.getElementById('manual'));
	chart3.draw(dados3, options3);
	
}

function PressaoManual()
{
	Data1  = DataDe.value.split('/').reverse().join('-')
	Data2  = DataAte.value.split('/').reverse().join('-')
	$.ajax(
	{
		url: '/Fabrica/Pressao/PressaoMan/' + Data1 + '/' + Data2 + '/' + HoraDe.value + '/' + HoraAte.value
		,type: "get"   

		,success : function(aDados)
		{
			dados3 = new google.visualization.DataTable();
		
			dados3.addColumn('string', 'Horarios');
			dados3.addColumn('number', 'Pressao');
		
			for (i = 0; i < aDados.length; i++)
			{
				dados3.addRows(
					[
						['24:00:00', 0]
					]
				)
			}
		
			for (i = 0; i < aDados.length; i++)
			{
				dados3.setValue(i, 0, aDados[i].HORA);
				dados3.setValue(i, 1, aDados[i].PRESSAO);
			}
		}
	})
	chart3.draw(dados3, options3);
}

// aguarda 1 segundo e carrega dados
var n = 0    
setInterval(function () {
    if(n==0) {
		Pressao();
		Pressao2();
		PressaoManual()
		n++
    }
}, 1000);