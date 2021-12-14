
//Impressao
function Imprimir(dImpressao , cImpressao) {
    if(dImpressao != "") { 
        var conteudo = dImpressao.innerHTML
        tela_impressao = window.open('about:blank');

        tela_impressao.document.write(conteudo);
        tela_impressao.window.print();
        tela_impressao.window.close();
    } else {
        var conteudo = document.getElementsByClassName(cImpressao)[0].innerHTML
        tela_impressao = window.open('about:blank');

        tela_impressao.document.write(conteudo);
        tela_impressao.window.print();
        tela_impressao.window.close();
    }
}

//Exportar Excel
function ExportarExcel(dImpressao, cTitulo) {
    $(document).ready(function () {
        $("#dImpressao").btechco_excelexport({
            containerid: "dImpressao"
            , datatype: $datatype.Table
            , filename: cTitulo
        });
    });
}


var cData = new Date();
var cHora = Date().substring(16, 21)

// Guarda cada pedaço em uma variável
var cDia       = cData.getDate();                                       // 1-31
var cMes       = cData.getMonth();                                      // 0-11 (zero=janeiro)
var cMesAnt    = cData.getMonth()-1;                                    // 0-11 (zero=janeiro)
var cAno4      = cData.getFullYear();                                   // 4 dígitos
var cUltDiaMes = new Date(cData.getFullYear(), cData.getMonth() + 1, 0);  // Ultimo dia Mes

// Formata a data e a hora (note o mês + 1)
if (cDia < 10) { cDia = '0' + cDia }
if (cMes < 9 ) { cMes = '0' + (cMes + 1) } else { cMes = (cMes + 1).toString() }
if (cMesAnt < 9 ) { cMesAnt = '0' + (cMesAnt + 1) } else { cMesAnt = (cMesAnt + 1).toString() }

var cDataAtual = cDia + '/' + cMes + '/' + cAno4;
var cMesDe     = '01/' + cMes + '/' + cAno4;
var cMesAte    = cUltDiaMes.getDate() + '/' + cMes + '/' + cAno4;
var cAnoDe     = '01/01/' + cAno4
var cAnoAte    = '31/12/' + cAno4

var cMesDe2  = cAno4 + cMes + '01'
var cMesAte2 = cAno4 + cMes + cUltDiaMes.getDate()
var cAnoDe2  = cAno4 + '0101'
var cAnoAte2 = cAno4 + '1231'

function adicionarDiasData(dias){
    var hoje        = new Date();
    var dataVenc    = new Date(hoje.getTime() + (dias * 24 * 60 * 60 * 1000));
    var cDiaN    = ''
    var cMesN    = ''

    if((dataVenc.getDate()).toString().length == 1) {
        cDiaN = '0' + (dataVenc.getDate() )
    } else {
        cDiaN = (dataVenc.getDate() )
    }

    if((dataVenc.getMonth() + 1).toString().length == 1) {
        cMesN = '0' + (dataVenc.getMonth() + 1)
    } else {
        cMesN = (dataVenc.getMonth() + 1)
    }

    return cDiaN + "/" + cMesN + "/" + dataVenc.getFullYear();
}


/// Função de tela de carregando
function Loading(Carregando, nX, nTipo) {
    if(nTipo == 1 || nTipo == undefined) {
        Carregando.style.width = nX + '%'
        Carregando.innerHTML   = nX + '%'
        Carregando.innerTEXT   = nX + '%'
    } else if(nTipo == 2) {
        Carregando.style.width = nX + '%'    
        Carregando.innerHTML   = ''
        Carregando.innerTEXT   = ''
    }
}

// Função para buscar dados em Banco de Dados
var request
function BuscaDados(cUrl, aArray) {
    if(aArray.length < 20) {
        var aTotal = aArray.length - 20
        for (i = 0; i < aTotal.length; i++) {
            aArray.push("")
        }
    }
    request = $.ajax({
        url: cUrl
        ,type: "post"
        ,error: function(error) { 
            var cMsg  = ''

            console.log("")
            console.log('URL      : ' + cUrl                )
            console.log('PARAMETRO: ' + aArray[0]           )
            console.log('ERRO     : ' + error.responseText  )
            console.log(error                               )
            console.log("") 
            
            cMsg  = 'ERRO AO CARREGAR DADOS \n\n'
            cMsg += 'URL            : ' + cUrl                  + '\n'
            cMsg += 'PARAMETRO: ' + aArray[0]                   + '\n'
            cMsg += 'ERRO           : ' + error.responseText
            alert(cMsg); 

            window.location.reload()
        }
        ,data: { 
            cParam1  : aArray[0]     //00
            ,cParam2 : aArray[1]     //01
            ,cParam3 : aArray[2]     //02
            ,cParam4 : aArray[3]     //03
            ,cParam5 : aArray[4]     //04
            ,cParam6 : aArray[5]     //05
            ,cParam7 : aArray[6]     //06
            ,cParam8 : aArray[7]     //07
            ,cParam9 : aArray[8]     //08
            ,cParam10: aArray[9]     //09
            ,cParam11: aArray[10]    //10
            ,cParam12: aArray[11]    //11
            ,cParam13: aArray[12]    //12
            ,cParam14: aArray[13]    //13
            ,cParam15: aArray[14]    //14
            ,cParam16: aArray[15]    //15
            ,cParam17: aArray[16]    //16
            ,cParam18: aArray[17]    //17
            ,cParam19: aArray[18]    //18
            ,cParam20: aArray[19]    //19
        }   
    })
}

// Função para postar atravez de um form
function PostForm(cDiv, cUrl, aDados, cUpload) {
    var x = document.getElementById(cDiv)                
    var form = document.createElement('form'            )
    form.setAttribute('id'  , cDiv + "_Form"            )
    form.setAttribute('action'  , cUrl                  )
    form.setAttribute('method'  , "POST"                )
    x.appendChild(form)

    for (i = 0; i < aDados.length; i++) {
        x = document.getElementById(cDiv + "_Form"      )
        var input = document.createElement('input'      )
        input.setAttribute('type', 'hidden'             )
        input.setAttribute('name', 'cParam' + (i+1)     )
        input.setAttribute('id'  , 'cParam' + (i+1)     )
        input.value = aDados[i]
        x.appendChild(input)
    }

    if(cUpload != "" && cUpload != undefined) {
        document.getElementById(cDiv + "_Form").setAttribute("enctype", "multipart/form-data")

        var input = document.createElement('input')
        var span = document.createElement('span')
        
        span.setAttribute('id', 'Area2')        
        //input.setAttribute('type', 'hidden')
        input.setAttribute('name', 'upload')
        input.setAttribute('type', 'file')
        input.setAttribute('id'  , 'file')

        span.appendChild(input)

        x.appendChild(span)
        
        var clone = $('#file2').clone();
        clone.attr('id', 'file');
        $('#Area2').html(clone);
        file.setAttribute('name', 'upload')
        file.setAttribute("hidden", true);
    }
}

// Valida formulario para postagem
function ValidaForm(aDados) {
    for (i = 0; i < aDados.length; i++) {
        if(document.getElementById(aDados[i]).value == "") {
            document.getElementById(aDados[i]).setAttribute('class', 'form-control alert-danger')
        } else {
            document.getElementById(aDados[i]).setAttribute('class', 'form-control')
        }
    }
    if(document.querySelectorAll(".alert-danger").length > 0) {
        return false
    } else {
        return true
    }
}

// Função para criar cores aleatorias aleatória em hexadecimal
function GeraCor() {
    var hexadecimais = '0123456789ABCDEF';
    var cor = '#';

    // Pega um número aleatório no array acima
    for (var i = 0; i < 6; i++) {
        //E concatena à variável cor
        cor += hexadecimais[Math.floor(Math.random() * 16)];
    }
    return cor;
}

// Função para verificar qual Empresa esta bucando dados
function BuscaEmpresas() {
    var cFilial = ""

    if(typeof(cEmp_010101) != "undefined") {
        if(cEmp_010101.checked) { 
            cFilial = cEmp_010101.value 
        }
    }   
    if(typeof(cEmp_01) != "undefined") {
        if(cEmp_01.checked) { 
            cFilial = cEmp_01.value 
        }
    }
    if(typeof(cEmp_020101) != "undefined") {
        if(cEmp_020101.checked) { 
            cFilial = cEmp_020101.value 
        }
    }
    if(typeof(cEmp_030101) != "undefined") {
        if(cEmp_030101.checked) { 
            cFilial = cEmp_030101.value 
        }
    }
    if(typeof(cEmp_030102) != "undefined") {
        if(cEmp_030102.checked) { 
            cFilial = cEmp_030102.value 
        }
    }
    if(typeof(cEmp_040101) != "undefined") {
        if(cEmp_040101.checked) { 
            cFilial = cEmp_040101.value 
        }
    }
    return cFilial
}

// Função para verificar qual Familia esta selecionada
function BuscaFamilias() {
    var cFamilia = ""

    if(typeof(cFamilias_00) != "undefined") {
        if(cFamilias_00.checked) { 
            cFamilia = cFamilias_00.value 
        }
    }   
    if(typeof(cFamilias_01) != "undefined") {
        if(cFamilias_01.checked) { 
            cFamilia = cFamilias_01.value 
        }
    }
    if(typeof(cFamilias_02) != "undefined") {
        if(cFamilias_02.checked) { 
            cFamilia = cFamilias_02.value 
        }
    }
    if(typeof(cFamilias_03) != "undefined") {
        if(cFamilias_03.checked) { 
            cFamilia = cFamilias_03.value 
        }
    }
    if(typeof(cFamilias_04) != "undefined") {
        if(cFamilias_04.checked) { 
            cFamilia = cFamilias_04.value 
        }
    }
    if(typeof(cFamilias_05) != "undefined") {
        if(cFamilias_05.checked) { 
            cFamilia = cFamilias_05.value 
        }
    }
    if(typeof(cFamilias_06) != "undefined") {
        if(cFamilias_06.checked) { 
            cFamilia = cFamilias_06.value 
        }
    }
    if(typeof(cFamilias_07) != "undefined") {
        if(cFamilias_07.checked) { 
            cFamilia = cFamilias_07.value 
        }
    }    
    if(typeof(cFamilias_08) != "undefined") {
        if(cFamilias_08.checked) { 
            cFamilia = cFamilias_08.value 
        }
    }
    if(typeof(cFamilias_09) != "undefined") {
        if(cFamilias_09.checked) { 
            cFamilia = cFamilias_09.value 
        }
    }
    if(typeof(cFamilias_10) != "undefined") {
        if(cFamilias_10.checked) { 
            cFamilia = cFamilias_10.value 
        }
    }
    if(typeof(cFamilias_11) != "undefined") {
        if(cFamilias_11.checked) { 
            cFamilia = cFamilias_11.value 
        }
    }
    if(typeof(cFamilias_12) != "undefined") {
        if(cFamilias_12.checked) { 
            cFamilia = cFamilias_12.value 
        }
    }     

    return cFamilia
}


function StatusPV(cStatus) {
    var cHTML = ''
    if(cStatus==' '){
        return ' <div class="circulo _P" title="Liberação Vendas I"></div> '
    } else if(cStatus=='A'){
        return ' <div class="circulo AP" title="Romaneio em Aberto"></div> ' 
    } else if(cStatus=='B'){
        return ' <div class="circulo BP" title="Aprovação Cliente"></div> ' 
    } else if(cStatus=='C'){
        return ' <div class="circulo CP" title="Liberação Vendas II"></div> '
    } else if(cStatus=='D'){    
        return ' <div class="circulo DP" title="Liberação Entrega Romaneio"></div> '
    } else if(cStatus=='E'){    
        return ' <div class="circulo EP" title="Encerrado"></div> '
    } else if(cStatus=='F'){    
        return ' <div class="circulo FP" title="Financeiro"></div> '
    } else if(cStatus=='G'){    
        return ' <div class="circulo GP" title="Romaneio Aguardando Lib. Faturamento"></div> '
    } else if(cStatus=='H'){    
        return ' <div class="circulo HP" title="Restrição Financeira (RISCO)"></div> '
    } else if(cStatus=='I'){    
        return ' <div class="circulo IP" title="Liberação Remessa"></div> '
    } else if(cStatus=='J'){
        return ' <div class="circulo JP" title="Rejeitado Financeiro"></div> '
    } else if(cStatus=='K'){
        return ' <span class="circulo KP" title="Aprovação Arte"></span> '
    } else if(cStatus=='L'){
        return ' <div class="circulo LP" title="Liberado OP"></div> '
    } else if(cStatus=='M'){
        return ' <div class="circulo MP" title="Aguardando Faturamento"></div> '
    } else if(cStatus=='N'){
        return ' <div class="circulo NP" title="Romaneio Aguardando Faturamento"></div> '
    } else if(cStatus=='O'){
        return ' <div class="circulo OP" title="Financeiro OP"></div> '
    } else if(cStatus=='P'){
        return ' <div class="circulo PP" title="Preço/Prazo"></div> '
    } else if(cStatus=='Q'){    
        return ' <div class="circulo QP" title="Financeiro Produção"></div> '
    } else if(cStatus=='R'){    
        return ' <div class="circulo RP" title="Financeiro Romaneio"></div> '
    } else if(cStatus=='S'){    
        return ' <div class="circulo SP" title="Liberado sem OP"></div> '
    } else if(cStatus=='T'){
        return ' <div class="circulo TP" title="Aguardando Frete"></div> '
    } else if(cStatus=='U'){
        return ' <div class="circulo UP" title="Qualidade Garantia"></div> '
    } else if(cStatus=='V'){
        return ' <div class="circulo VP" title="Pré Venda"></div> '
    } else if(cStatus=='W'){
        return ' <div class="circulo WP" title="Liberado Garantia"></div> '
    } else if(cStatus=='Y'){
        return ' <div class="circulo YP" title="Qualidade Romaneio"></div> '
    }
    return cHTML
}

//Marca Empresa Padrao
function EmpresaPadao() {
    if(typeof(Checked) != "undefined") {
        if(typeof(cEmp_010101) != "undefined") {
            if(Checked.value == cEmp_010101.value) { cEmp_010101.checked = true } else { cEmp_010101.checked = false }
        }
        if(typeof(cEmp_020101) != "undefined") {
            if(Checked.value == cEmp_020101.value) { cEmp_020101.checked = true } else { cEmp_020101.checked = false }
        }
        if(typeof(cEmp_030101) != "undefined") {
            if(Checked.value == cEmp_030101.value) { cEmp_030101.checked = true } else { cEmp_030101.checked = false }
        }
        if(typeof(cEmp_030102) != "undefined") {
            if(Checked.value == cEmp_030102.value) { cEmp_030102.checked = true } else { cEmp_030102.checked = false }
        }
    }
}

// Alerta flutuante
function Alerta(cTitulo, cTexto, nTipo, cTheme, nTempo) {
    $(function(){
        $.jGrowl.defaults.closerTemplate = '<div class="alert alert-info">Fechar Tudo</div>';

        if(nTipo == 1) {
            $('#jGrowl1').jGrowl(cTexto, { 
                header: cTitulo
                ,message: cTexto
                ,group: cTheme
                ,life: 5000
            });

        } else if(nTipo == 2) {
            $('#jGrowl2').jGrowl({
                header:  cTitulo
                ,message: cTexto
                ,group: cTheme
                ,life: 5000
            });
        } else if(nTipo == 3) {
            $('#jGrowl1').jGrowl({
                header:  cTitulo
                ,message: cTexto
                ,group: cTheme
                ,life: nTempo*1000
            });            
        }
    })    
}

//Arredondamento decimal.
(function () {
    /**
    * Decimal adjustment of a number.
    *
    * @param	{String}	type	The type of adjustment.
    * @param	{Number}	value	The number.
    * @param	{Integer}	exp		The exponent (the 10 logarithm of the adjustment base).
    * @returns	{Number}			The adjusted value.
    */
    function decimalAdjust(type, value, exp) {
        // If the exp is undefined or zero...
        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // If the value is not a number or the exp is not an integer...
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return 0;
        }
        // Shift
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }

    // Decimal round
    if (!Math.round10) {
        Math.round10 = function (value, exp) {
            return decimalAdjust('round', value, exp);
        };
    }
    // Decimal floor
    if (!Math.floor10) {
        Math.floor10 = function (value, exp) {
            return decimalAdjust('floor', value, exp);
        };
    }
    // Decimal ceil
    if (!Math.ceil10) {
        Math.ceil10 = function (value, exp) {
            return decimalAdjust('ceil', value, exp);
        };
    }

})();


/// Cria copia charts      -     showAllTooltips: true
function showAllTooltips() {
    Chart.pluginService.register({
        beforeRender: function (chart) {
            if (chart.config.options.showAllTooltips) {
                // create an array of tooltips
                // we can't use the chart tooltip because there is only one tooltip per chart
                chart.pluginTooltips = [];
                chart.config.data.datasets.forEach(function (dataset, i) {
                    chart.getDatasetMeta(i).data.forEach(function (sector, j) {
                        chart.pluginTooltips.push(new Chart.Tooltip({
                            _chart: chart.chart,
                            _chartInstance: chart,
                            _data: chart.data,
                            _options: chart.options.tooltips,
                            _active: [sector]
                        }, chart));
                    });
                });

                // turn off normal tooltips
                chart.options.tooltips.enabled = false;
            }
        },
        afterDraw: function (chart, easing) {
            if (chart.config.options.showAllTooltips) {
                // we don't want the permanent tooltips to animate, so don't do anything till the animation runs atleast once
                if (!chart.allTooltipsOnce) {
                    if (easing !== 1)
                        return;
                    chart.allTooltipsOnce = true;
                }

                // turn on tooltips
                chart.options.tooltips.enabled = true;
                Chart.helpers.each(chart.pluginTooltips, function (tooltip) {
                    tooltip.initialize();
                    tooltip.update();
                    // we don't actually need this since we are not animating tooltips
                    tooltip.pivot();
                    tooltip.transition(easing).draw();
                });
                chart.options.tooltips.enabled = false;
            }
        }
    })
}



// Sons Paineis
var AudioOK1 = new Audio('/Sons/OK1.wav');
var AudioOK2 = new Audio('/Sons/OK2.wav');
var AudioOK3 = new Audio('/Sons/OK3.wav');
var AudioError1 = new Audio('/Sons/Error1.wav');
var AudioError2 = new Audio('/Sons/Error2.wav');
var AudioError3 = new Audio('/Sons/Error3.wav');

function _Alertas(_nSom, _cTitulo, _cMsg, _nTempo, _cCampo, _cTela, _cStyle, nReload){

    document.getElementById(_cTela).setAttribute("title", "")
    _cCampo.setAttribute("disabled", "")

    if(_nSom == 1) {
        AudioOK1.play()
    } else if(_nSom == 2) {
        AudioOK2.play()
    } else if(_nSom == 3) {
        AudioOK3.play()
    } else if(_nSom == 11) {
        AudioError1.play()  
    } else if(_nSom == 12) {
        AudioError2.play()  
    } else if(_nSom == 13) {
        AudioError3.play()  
    }

    var cMsg2 
    
    cMsg2 = " </br></br>                                                                         "
    cMsg2 += " <p style='font-size: 8px; color: red'>                                            "
    cMsg2 += "   * Essa tela se fechará automaticamente em                                       "
    cMsg2 += "   <span id='delayTime'></span>                                                    "
    cMsg2 += "   segundos                                                                        "
    cMsg2 += " </p>                                                                              "   
    
    document.getElementById(_cTela).setAttribute("title", _cTitulo)
    document.getElementById(_cTela).innerHTML = _cMsg + cMsg2

    $("#" + _cTela).dialog({
        modal: true
        ,resizable: false
        ,height: "auto"
        ,width: 500
        ,open: function() {
            if(_cStyle != ""){
                var _cTituloDialog = document.getElementsByClassName("ui-dialog-titlebar")

                for (let i = 0; i < _cTituloDialog.length; i++) {
                    _cTituloDialog[i].setAttribute("class", "ui-dialog-titlebar " + _cStyle + " ui-corner-all ui-helper-clearfix ui-draggable-handle")                    
                }
            }

            var counter = _nTempo;
            $('#delayTime').text(counter);  
            var intID = setInterval(function() {
                counter--;
                $('#delayTime').text(counter);

                if (counter == 0) {
                    clearInterval(intID)                   
                    if(nReload == undefined){
                        _cCampo.value = ''
                        _cCampo.disabled = false
                        _cCampo.setAttribute("class", "form-control-sm")
                        
                        $("#" + _cTela).dialog('close')
                        for (let i = 0; i < _cTituloDialog.length; i++) {
                            _cTituloDialog[i].setAttribute("class", "ui-dialog-titlebar ui-corner-all ui-helper-clearfix ui-draggable-handle")                    
                        }
    
                        for (let i = 0; i < document.querySelectorAll(".alert-danger").length; i++) {
                            if(document.querySelectorAll(".alert-danger")[i].tagName == 'P'){
                                document.querySelectorAll(".alert-danger")[i].setAttribute("class", "")
                            }
                        }                        
                        _cCampo.focus()
                    } else {
                        window.location.reload()
                    }
                }
            }, 1000)
        }
        ,buttons: {
            "Fechar": function () { 
                if(nReload == undefined){
                    _cCampo.value = ''
                    _cCampo.disabled = false
                    _cCampo.setAttribute("class", "form-control-sm")
                    
                    $("#" + _cTela).dialog('close')
                    var _cTituloDialog = document.getElementsByClassName("ui-dialog-titlebar")

                    for (let i = 0; i < _cTituloDialog.length; i++) {
                        _cTituloDialog[i].setAttribute("class", "ui-dialog-titlebar ui-corner-all ui-helper-clearfix ui-draggable-handle")                    
                    }
    
                    for (let i = 0; i < document.querySelectorAll(".alert-danger").length; i++) {
                        if(document.querySelectorAll(".alert-danger")[i].tagName == 'P'){
                            document.querySelectorAll(".alert-danger")[i].setAttribute("class", "")
                        }
                    }
                    _cCampo.focus()
                } else {
                    window.location.reload()
                }
            }
        }
    });
}


    // Exemplo chama autocompletar

    /*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
    //AutoCompletar(document.getElementById("cLocaliz"), _aDados, fCarregaEnd);
    /* --------------------------------------- */ 

    /*Exemplo de funcao para funcao
    
        var fCarregaEnd = (function(){

            return function(x){
               
            }

        })();
    */

/* auto completar funcao */ 
function AutoCompletar(inp, arr, fFuncao) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/

                // valida se campo esta igual ao restorno e fecha autocomplertar
                if(inp.value == arr[i]){
                    closeAllLists();
                    
                    // Chama função passada no paramentro
                    fFuncao(inp.value)  
                }
                
                b.addEventListener("click", function(e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                    
                    // Chama função passada no paramentro
                    fFuncao(inp.value)  
                });
                a.appendChild(b);
            }
        }
    });

    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
                currentFocus++;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 38) { //up
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                currentFocus--;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 13) {
                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                e.preventDefault();
                if (currentFocus > -1) {
                    /*and simulate a click on the "active" item:*/
                    if (x) x[currentFocus].click();
                }
            }
    });

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
            /*start by removing the "active" class on all items:*/
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
                if (currentFocus < 0) currentFocus = (x.length - 1);
                    /*add class "autocomplete-active":*/
                    x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    
    /*execute a function when someone clicks in the document:*/
    /*
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
        //ConfirmaEmail()
        CarregaEnd()
    });
    */
}


// Busca ip internet

//Exemplo
/*
    getIp(function (ip) {
        console.log(ip);
    });
*/

function getIp(callback)
{
    function response(s)
    {
        callback(window.userip);

        s.onload = s.onerror = null;
        document.body.removeChild(s);
    }

    function trigger()
    {
        window.userip = false;

        var s = document.createElement("script");
        s.async = true;
        s.onload = function() {
            response(s);
        };
        s.onerror = function() {
            response(s);
        };

        s.src = "https://l2.io/ip.js?var=userip";
        document.body.appendChild(s);
    }

    if (/^(interactive|complete)$/i.test(document.readyState)) {
        trigger();
    } else {
        document.addEventListener('DOMContentLoaded', trigger);
    }
}

