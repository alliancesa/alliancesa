const { Client, Intents } = require('discord.js');
const config = require("./config.json");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
const db2    = require('../models/db2');

const prefix = "!";

    client.on("message", function(message) { 
        if (message.author.bot) return;
        if (!message.content.startsWith(prefix)) return;

        const commandBody = message.content.slice(prefix.length);
        const args = commandBody.split(' ');
        const command = args.shift().toLowerCase();        
        
        if (command === "ping") {
            const timeTaken = Date.now() - message.createdTimestamp;
            message.reply(`Pong! Sua mensagem teve uma latência de ${timeTaken}ms.`);
        } else if (command === "rank") {
            cQry  = " SET @nItem    = 1.5;                             \n "  
            cQry += " SET @nLevel   = 6;                               \n "
            cQry += " SET @nPoder   = 3;                               \n "
            cQry += " SET @nPesoIV  = 16;                              \n "
            cQry += " SET @nPesoIII = 8;                               \n "
            cQry += " SET @nPesoII  = 4;                               \n "
            cQry += " SET @nPesoI   = 1;                               \n "
                               
            cQry += " SELECT                                           \n "
            //cQry += "   @nLevel    * NIVEL                              "
            //cQry += "   ,@nPoder   * PODER                              "
            //cQry += "   ,@nPesoIV  * TIERIV                             "
            //cQry += "   ,@nPesoIII * TIERIII                            "
            //cQry += "   ,@nPesoII  * TIERII                             "
            //cQry += "   ,@nPesoI   * TIERI                              "
            cQry += "   PER.id                                         \n "
            cQry += "   ,TIPO                                          \n "
            cQry += "   ,NICK                                          \n "
            cQry += "   ,ID_CLAN                                       \n "
            cQry += "   ,CLA.NOME CLAN                                 \n "
            cQry += "   ,ID_CLASSE                                     \n "
            cQry += "   ,CLAS.NOME CLASSE                              \n "
            cQry += "   ,NIVEL                                         \n "
            cQry += "   ,PODER                                         \n "
            cQry += "   ,(@nPesoIV*TIERIV)+(@nPesoIII*TIERIII)+(@nPesoII*TIERII)+(@nPesoI*TIERI) ITEM  \n "
            cQry += "   ,TIERI                                         \n "
            cQry += "   ,TIERII                                        \n "
            cQry += "   ,TIERIII                                       \n "
            cQry += "   ,TIERIV                                        \n "
            cQry += "   ,ROUND((@nLevel*NIVEL)+(@nPoder*PODER)+(@nItem*((@nPesoIV*TIERIV)+(@nPesoIII*TIERIII)+(@nPesoII*TIERII)+(@nPesoI*TIERI))), 0) _RANK \n "
            cQry += " FROM                                             \n "
            cQry += "   Personagens PER                                \n "
            cQry += "   INNER JOIN USUARIOs USU ON                     \n "
            cQry += "      USU.id = ID_USUARIO                         \n "
            cQry += "   INNER JOIN Clans CLA ON                        \n "
            cQry += "      CLA.id = ID_CLAN                            \n "
            cQry += "   INNER JOIN Classes CLAS ON                     \n "
            cQry += "      CLAS.id = ID_CLASSE                         \n "
            //cQry += " WHERE                                             "
            //cQry += "   ID_USUARIO = 4                                  "
            cQry += " ORDER BY                                         \n "
            cQry += "   _RANK DESC                                     \n "
            cQry += "   ,NIVEL                                         \n "
            cQry += "   ,PODER                                         \n "
            cQry += "   ,ITEM                                          \n "
            cQry += "   ,NICK                                          \n "

            if(args == "top3"){
                cQry += "   LIMIT 3                                       "
            }
            
            db2.query(cQry, function (err, result, fields) {
                if(err){
                    console.log(err)    
                } else {
                    var b      = 0
                    var cTexto = ""

                    if(args == "top3"){
                        cTexto += "                                   \n\n"
                        cTexto += ":eyes: :loudspeaker:               \n\n"
                        cTexto += ":star2: Rank Alliance TOP 3 :star2:\n\n"
                    }

                    for (let i = 0; i < result[7].length; i++) {
                       b++

                       cTexto += (b).toString()
                       cTexto += "º  Rank:  "   + result[7][i]._RANK 
                       cTexto += " - Nível: "   + result[7][i].NIVEL 
                       cTexto += " - Poder: "   + result[7][i].PODER 
                       cTexto += " - CLAN:  "   + result[7][i].CLAN 
                       cTexto += " - Nick:  "   + result[7][i].NICK + "\n"                
                    }
                    
                    cTexto += "                                      \n\n"
                    cTexto += " :horse_racing: :horse_racing: :horse_racing: \n\n"
                    
                    message.reply(cTexto)   
                }
            });
        } else if (command === "Wb") {
            



        }

    });      


client.login(config.BOT_TOKEN);