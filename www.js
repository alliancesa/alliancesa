// Carregando módulos
    const express    = require('express');
    const app        = express();
    const port       = '8383';

    const handlebars = require('express-handlebars');
    const bodyParser = require('body-parser');
    const path       = require("path");
    const session    = require("express-session")
    const flash      = require("connect-flash")

    const Principal  = require("./routes/Principal");
    const Admin      = require("./routes/Admin");
    const Usuarios   = require("./routes/Usuarios")

    const passport = require("passport")
    require("./config/auth")(passport)

// Configurações
    // Session
        app.use(session({
            secret: "@ll1@nc3S@",
            resave: true,
            saveUninitialized: true
        }))
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())

    // Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
            res.locals.user = req.user || null
            next()
        })
        
    // Body Parser
        app.use(bodyParser.json({limit: '50mb'}));
        app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

     // HandleBars
        // helpers
        var hbs = handlebars.create({
            //helpers: require('./handlers/handlebars'),
            helpers: {
                if_eq: function (a, b, opts) { 
                    if (a == b) {
                        return opts.fn(this);
                    } else {
                        return opts.inverse(this);
                    }
                 }

                ,foreach: function(arr,options) {
                    if(options.inverse && !arr.length)
                        return options.inverse(this);
                
                    return arr.map(function(item,index) {
                        item.$index = index;
                        item.$first = index === 0;
                        item.$between = index > 0;
                        item.$last  = index === arr.length-1;
                        return options.fn(item);
                    }).join('');
                }
            }
            ,defaultLayout: 'main'
            //,extname:'.hbs'
        });
        
        app.engine('handlebars', hbs.engine);
        app.set('view engine', 'handlebars');
        
     // www
        app.use(express.static(path.join(__dirname, "www")));

// Rotas
    app.use('/', Principal)
    app.use('/Admin', Admin)
    app.use('/Usuarios', Usuarios)


//Outros
    app.listen(port, function(){
        console.log("Servidor Rodando na url http://localhost:" + port)
    })
    