const discord = require('discord.js')

const { prefix } = require('./config.json');
const { token } = require('./api_keys.json');

const {getAccs, postAcc, updateAcc} = require('./googlesheets');

const client = new discord.Client();

var accs;

client.on('message', async message => {

    if (message.content.toLowerCase() === prefix + ' help'){
        fields = [
                {name: "Valorant Accounts In One Rank", value: "!val -rank [rank]"},
                {name: "Valorant Accounts With Agent", value: "!val -agent [agent]"},
                    ]
        embed = new discord.MessageEmbed()
            .setTitle("Val Commands")
            .addFields(fields)
        message.channel.send(embed)
    } else if (message.content.toLowerCase().startsWith(prefix + ' rank')){
        if(!message.member.roles.cache.has('861115857810489365')){
            return message.channel.send("You don't have permission to use this.")
        }
        var input = message.content.toLowerCase().substr(10).replace(/\s/g, '');
        let targetRank

        switch(input){
            case "iron":
                targetRank = "iron"
                break;
            case "bronze":
                targetRank = "bronze"
                break;
            case "silver":
                targetRank = "silver"
                break;
            case "gold":
                targetRank = "gold"
                break;
            case "platinum":
            case "plat":
                targetRank = "platinum"
                break;
            case "diamond":
            case "dia":
                targetRank = "diamond"    
                break;
            case 'immortal':
            case "immo":
            case "imm":
                targetRank = "immortal"
                break;
            default:
                message.reply("Invalid Command")
                return
        }
        
        message.reply("Finding account...").then(msg => {
            setTimeout(() => msg.delete(), 5000)
        })

        // Call google sheets data to get latest acc info
        getAccs().then( (accs) => {
            // Filter for target rank
            var targetAccounts = accs.filter((acc) => {
                return acc.rank === targetRank
            })

            // Check if an account was found
            if(targetAccounts.length == 0){
                message.reply("No Accounts with that rank found.")
                return
            }

            // Sort by last played
            targetAccounts.sort( function(a,b){
                return a.date_used - b.date_used;
            })
            
            // DM user
            let account = targetAccounts[0]
            message.author.send("\nAccount: " + account.display_name +  "\nUser: " + account.user + "\npass: " + account.password
                + "\nLast Played: " + account.last_played + "\n\n*** Deleting in 2 minutes ***")
                .then(msg => {
                    setTimeout(() => msg.delete(), 120000)
                })
            message.reply("Found account, check DMs")
            // Push to google API
            updateAcc(message.author.username, new Date(), account.display_name).then((return_vale) => {
                console.log("Updated Sheets")
            })
        });
    } 
})
  
client.login(token)