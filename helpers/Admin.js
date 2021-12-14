module.exports = {
    Admin: function(req, res, next) {
        if(req.isAuthenticated() && req.user.Admin == 1){
            return next();
        }

        req.flash("error_msg", "Usuário sem permissão para acessar essa sessão")
        res.redirect("/")
    }
}