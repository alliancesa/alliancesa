
module.exports = {
    AuthUsuarios: function(req, res, next) {
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error_msg", "Necessário um usuário conectado para acessar essa sessão")
        res.redirect("/Usuarios/Login")

    /*            
            res.locals.UserEPR  = req.user.UserERP    

            if(req.user.VENDEDOR == '' || req.user.VENDEDOR == null){ 
                var lOK = false
                var aArray = req._parsedOriginalUrl.pathname.split("/");
                
                var aModulos = []
                var aItens   = []

                // Gera Dados para menus -----------------------------------------------------------------------------------                
                aMenu   = []
                aModulo = []
                aRotina = []
                //Gera Dados para liberações dos menus
                for (let i = 0; i < req.user.Acessos.length; i++) {
                    if(req.user.Acessos[i].TIPO.trim() != 'PORTAL' && req.user.Acessos[i].TIPO.trim() != 'TI' && req.user.Acessos[i].TIPO.trim() != 'Mobile'){
                        if(aMenu.length == 0){
                            aMenu.push(req.user.Acessos[i].TIPO.trim())
                        } else {
                            var lOK = false
                            for (let b = 0; b < aMenu.length; b++) {
                                if(req.user.Acessos[i].TIPO.trim() == ''){
                                    lOK = true     
                                    break
                                } else if(req.user.Acessos[i].TIPO.trim() == aMenu[b] ){
                                    lOK = true 
                                    break
                                }
                            }
                            if(lOK != true){
                                aMenu.push(req.user.Acessos[i].TIPO.trim())
                            }
                        }
                    }
                }
                // Gera Modulos
                var lOK = false
                for (let i = 0; i < aMenu.length; i++) {            
                    for (let b = 0; b < req.user.Acessos.length; b++) {
                        if(aMenu[i] != ""){
                            if(aModulo.length == 0){
                                aModulo.push(aMenu[i] + '_' + req.user.Acessos[b].MODULO.trim())
                            } else {
                                var lOK = false

                                for (let c = 0; c < aModulo.length; c++) {
                                if(aMenu[i] + '_' + req.user.Acessos[b].MODULO.trim() == aModulo[c] ){
                                        lOK = true 
                                        break
                                    }
                                }
                                if(lOK != true){
                                    aModulo.push(aMenu[i] + '_' + req.user.Acessos[b].MODULO.trim())
                                }
                            }
                        }
                    }
                }     
                // Gera Rotinas
                for (let i = 0; i < aMenu.length; i++) {            
                    for (let b = 0; b < req.user.Acessos.length; b++) {
                        if(aMenu[i] == req.user.Acessos[b].TIPO.trim()){
                            aRotina.push(aMenu[i] + '_' + req.user.Acessos[b].ROTINA.trim()) 
                        }
                    }
                }
                // Gera Dados para menus -----------------------------------------------------------------------------------



                // Remove espaços em branco
                for(let i = 1; i < aArray.length; i++) {
                    if(i > 1 && aArray[i] == '')
                        aArray.splice(i, 1)
                }

                // Remove qualquer dados apos campos de Edit, Add, Del
                for(let i = 1; i < aArray.length; i++) {
                    if(aArray[i] == "add"  || aArray[i] == "edit" || aArray[i] == "del"  || aArray[i] == "list" ||
                       aArray[i] == "Add"  || aArray[i] == "Edit" || aArray[i] == "Del"  || aArray[i] == "List") {
                        if(i < aArray.length)
                            aArray.pop();
                    }
                }

                for(let i = 1; i < aArray.length; i++) {
                    //if(aArray[i] != "Fabrica" && aArray[i] != "ERP" && aArray[i] != "PAINEIS" ){
                    if(aArray[i] != "Fabrica" && aArray[i] != "ERP" && aArray[i] != "PAINEIS" && aArray[i] != "RJ" && aArray[i] != "Mobile" ){
                        aItens= []
                        
                        aItens.push(aArray[i])
                        
                        //Verifica se usuario tem permissões de CRUD
                        if(aArray[i] == "add"  || aArray[i] == "edit" || aArray[i] == "del"  || aArray[i] == "list" ||
                        aArray[i] == "Add"  || aArray[i] == "Edit" || aArray[i] == "Del"  || aArray[i] == "List") {
                            for (let b = 0; b < req.user.Acessos.length; b++) {
                                if(aArray[i-1] == req.user.Acessos[b].Modulos) {
                                    if(aArray[i] == "add" && req.user.Acessos[b].Adicionar == "Ativo" ) {
                                        aItens.push(true) 
                                    } else if(aArray[i] == "edit" && req.user.Acessos[b].Alterar == "Ativo") {
                                        aItens.push(true) 
                                    } else if(aArray[i] == "del" && req.user.Acessos[b].Remover == "Ativo") {
                                        aItens.push(true) 
                                    } else if(aArray[i] == "list" && req.user.Acessos[b].Visualizar == "Ativo") {
                                        aItens.push(true) 
                                    } else if(aArray[i] == "Add" && req.user.Acessos[b].Adicionar == "Ativo" ) {
                                        aItens.push(true) 
                                    } else if(aArray[i] == "Edit" && req.user.Acessos[b].Alterar == "Ativo") {
                                        aItens.push(true) 
                                    } else if(aArray[i] == "Del" && req.user.Acessos[b].Remover == "Ativo") {
                                        aItens.push(true) 
                                    } else if(aArray[i] == "List" && req.user.Acessos[b].Visualizar == "Ativo") {
                                        aItens.push(true) 
                                    } else {
                                        aItens.push(false) 
                                    }
                                }             
                            }
                        } else {
                            aItens.push(false)
                        }
                        aModulos.push(aItens)
                    }
                        
                }
                
                // Verifica se esta sendo realizado primeiro logon
                if(aModulos[0][0]!="") {
                    
                    // Verifica se existe acesso ao modulo
                    for (let i = 0; i < req.user.Acessos.length; i++) {
                        for (let b = 0; b < aModulos.length; b++) {
                            if(aModulos[b][0] == req.user.Acessos[i].MODULO) {
                                if(req.user.Acessos[i].VISUALIZAR == 1) {
                                    aModulos[b][1] = true
                                }
                            }
                        }
                    }

                    // Verificar se existe acesso a Relatorios
                    for (let i = 0; i < req.user.Acessos.length; i++) {
                        for (let b = 0; b < aModulos.length; b++) {
                            if(aModulos[b][0] == 'Relatorios' && req.user.Acessos[i].RELATORIO == "S") {
                                if(req.user.Acessos[i].VISUALIZAR == 1) {
                                    aModulos[b][1] = true
                                }
                            }
                        }
                    }
                    
                    // Verificar se existe acesso a rotina
                    for (let i = 0; i < req.user.Acessos.length; i++) {
                        for (let b = 0; b < aModulos.length; b++) {
                            if(aModulos[b][0] == req.user.Acessos[i].ROTINA) {
                                if(req.user.Acessos[i].VISUALIZAR == 1) {
                                    aModulos[b][1] = true
                                }
                            }
                        }
                    }
                    
                    // Valida se usuario tem acesso ao modulos
                    for (let i = 0; i < aModulos.length; i++) {
                        if(!aModulos[i][1] && req.user.Admin != 1) {
                        //if(!aModulos[i][1]) {

                            var cDados = "\n Data: " + Date() + "   |   Usuario: " 
                            cDados += req.user.Nome + "    |   Modulo: " + req.headers.referer + "  |   Acesso Negado: " + aModulos[aModulos.length-1][0]
            
                            GeraLogAcesso(cDados, req.user.Nome.split(" ")[0])

                            console.log("")
                            console.log("Data:    " + Date())
                            console.log("Usuario: " + req.user.Nome)
                            console.log("Endereço:" + req.headers.referer)
                            console.log("Acesso:  " + aModulos[i][0])
                            console.log("Usuário sem permissão para acessar esse modulo! Favor contatar o administrador")
                        
                            req.flash("error_msg", "Usuário sem permissão para acessar esse modulo! Favor contatar o administrador")
                            
                            res.redirect(req.headers.referer)   
                            return  
                        }
                    }
                    lOK = true
                } else {
                    lOK = true
                }

                if(lOK) {
                    var cDados = "\n Data: " + Date() + "   |   Usuario: " 
                    cDados += req.user.Nome + "    |   Modulo: " + req.headers.referer + "  |   Acesso: " + aModulos[aModulos.length-1][0]
                    
                    //if(req.headers.referer.split('/')[3] != "" && req.headers.referer.split('/')[3] != "Usuarios"){
                    if(aArray[1] != ""){
                        var lOK_ = false
                        for (let i = 0; i < req.user.Modulos.length; i++) {                        
                            if(aArray.length == 2){    // TELA PRINCIPAL
                                if(req.user.Modulos[i].ROTINA == aArray[1]){
                                    lOK_ = true
                                    break;
                                }
                            } else if(aArray.length == 3){
                                if(req.user.Modulos[i].TIPO   == aArray[1] &&
                                   req.user.Modulos[i].MODULO == aArray[2] ){
                                    lOK_ = true
                                    break;
                                }
                            } else if(aArray.length == 4){
                                if(req.user.Modulos[i].TIPO    == aArray[1] &&
                                    req.user.Modulos[i].MODULO == aArray[2] &&
                                    req.user.Modulos[i].ROTINA == aArray[3] ){
                                    lOK_ = true
                                    break;
                                }
                            } else if(aArray.length == 5){
                                var cRel = "Relatorios"
                                
                                if(req.user.Modulos[i].RELATORIO == 'N'){ cRel = "" }

                                if(req.user.Modulos[i].TIPO.trim()      == aArray[1] &&
                                   req.user.Modulos[i].MODULO.trim()    == aArray[2] &&
                                   cRel                                 == aArray[3] &&
                                   req.user.Modulos[i].ROTINA.trim()    == aArray[4] ){
                                     lOK_ = true
                                     break;
                                }
                            }
                        }
                    }
                    
                    if(lOK_ == false){
                        console.log("")
                        console.log("|---------------------------------------|")
                        console.log("|  Cadastro de Modulo não encotrado     |")
                        console.log("|                                       |")
                        for (let i = 1; i < aArray.length; i++) {     
                            console.log("| " + aArray[i] + " ".repeat(40-("| " + aArray[i]).length)+'|')
                        }
                        console.log("|                                       |")
                        console.log("|  Favor realizar o cadastro do Modulo  |")
                        console.log("|---------------------------------------|")
                        console.log("")
                    }

                    GeraLogAcesso(cDados, req.user.Nome.split(" ")[0])
                    return next();
                } else {

                    var cDados = "\n Data: " + Date() + "   |   Usuario: " 
                    cDados += req.user.Nome + "    |   Modulo: " + req.headers.referer + "  |   Acesso Negado: " + aModulos[aModulos.length-1][0]

                    GeraLogAcesso(cDados, req.user.Nome.split(" ")[0])

                    console.log("")
                    console.log("Data:    " + Date())
                    console.log("Usuario: " + req.user.Nome)
                    console.log("Endereço:" + req.headers.referer)
                    console.log("Acesso:  " + aModulos[aModulos.length-1][0])
                    console.log("Usuário sem permissão para acessar esse modulo! Favor contatar o administrador")
                
                    req.flash("error_msg", "Usuário sem permissão para acessar esse modulo! Favor contatar o administrador")
                    res.redirect(req.headers.referer)   
                    return       
                }
            } else { // Liberaçao para vendedor
                var aArray = req._parsedOriginalUrl.pathname.split("/")
                if(aArray[1] == "Vendedores" || aArray[1] == "") {
                    var cDados = "\n Data: " + Date() + "   |   Usuario: " 
                    cDados += req.user.Nome + "    |   Modulo: " + req.headers.referer //+ "  |   Acesso: " + aModulos[aModulos.length-1][0]
                    
                    GeraLogAcesso(cDados, req.user.Nome.split(" ")[0])
                    return next();
                } else {
                    var cDados = "\n Data: " + Date() + "   |   Usuario: " 
                    cDados += req.user.Nome + "    |   Modulo: " + req.headers.referer //+ "  |   Acesso Negado: " + aModulos[aModulos.length-1][0]

                    GeraLogAcesso(cDados, req.user.Nome.split(" ")[0])

                    console.log("")
                    console.log("Data:      " + Date())
                    console.log("Usuario:   " + req.user.Nome)
                    console.log("Endereço:  " + req.headers.referer)
                    //console.log("Acesso:  " + aModulos[aModulos.length-1][0])
                    console.log("Usuário sem permissão para acessar esse modulo! Favor contatar o administrador")
                
                    req.flash("error_msg", "URL não encontrada!")
                    res.redirect("/")   
                    return  
                }
            }
        }
        req.flash("error_msg", "Necessário um usuário conectado para acessar essa sessão")
        res.redirect("/Usuarios/Login")
*/        
    }
}



function GeraLogAcesso(cTexto, cUser) {

var data = new Date();

// Guarda cada pedaço em uma variável
var dia     = data.getDate();           // 1-31
var dia_sem = data.getDay();            // 0-6 (zero=domingo)
var mes     = data.getMonth();          // 0-11 (zero=janeiro)
var ano2    = data.getYear();           // 2 dígitos
var ano4    = data.getFullYear();       // 4 dígitos
var hora    = data.getHours();          // 0-23
var min     = data.getMinutes();        // 0-59
var seg     = data.getSeconds();        // 0-59
var mseg    = data.getMilliseconds();   // 0-999
var tz      = data.getTimezoneOffset(); // em minutos

var cData   = ano4 + '-' + (mes+1) + '-' + dia + '//'

var fs           = require('graceful-fs');    
var cNomeArquivo = cUser
var dir = "Logs//" + cData
    
    //verifica se pasta existe, se nao existir cria ela
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    // Grava arquivo como Enviado msg
    fs.appendFile(dir + cNomeArquivo + ".txt", cTexto, function(erro) {
        if(erro) {
            throw erro;
        }
    }); 

}
