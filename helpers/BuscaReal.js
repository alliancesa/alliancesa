
module.exports = {
    BuscaReal: function(req, res, next) {
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error_msg", "Necessário um usuário conectado para acessar essa sessão")
        res.redirect("/Usuarios/Login")
    }
}