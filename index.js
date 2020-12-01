// Run dotenv
require('dotenv').config();

const puppeteer = require('puppeteer');

let pBrowser = undefined;
let pPage = undefined;

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  try {
    pBrowser = await puppeteer.launch();
    pPage = await pBrowser.newPage();
  } catch (error){console.error()};
});

client.on('message', async msg => {
   // Prevent bot from responding to any other bots' messages, or its own for that matter
   if (msg.author.bot) {
    return
   }  
   if (msg.content.startsWith("!")) {
    processCommand(msg)
   }
});

async function processCommand(receivedMessage) {
  const fullCommand = receivedMessage.content.substr(1) // Remove the leading exclamation mark
  const splitCommand = fullCommand.split(" ") // Split the message up in to pieces for each space
  const primaryCommand = splitCommand[0].toLowerCase() // The first word directly after the exclamation is the command
  const arguments = splitCommand.slice(1)[0] // All other words are arguments/parameters/options for the command
  
  let elemClass = ""
  let channelName = ""
  
  if(!validateURL(arguments)){
    console.log("ERR: url not valid");
    return
   }  

  if (primaryCommand === "tko") {
        elemClass = "shirt-image"
  } else if (primaryCommand === "patents") {
        elemClass = "ps-image"
  } else if (primaryCommand === "champd") {
        elemClass = "wc-image"
  } else {
      receivedMessage.channel.send("I don't understand the command. Try `!tko`, `!champd` or `!patents`")
  }

  if (arguments.length > 0) {
    //receivedMessage.channel.send("Link: " + arguments)
    receivedMessage.channel.send("Type: " + elemClass)
    await pPage.goto(arguments)
    const resultsSelector="img." + elemClass;
    await pPage.waitForSelector(resultsSelector);
    
  
        const imgs = await pPage.evaluate(resultsSelector => {
            const anchors = Array.from(document.querySelectorAll(resultsSelector));
            return anchors.map(anchors=>{
            return `${anchors.src}`;
            })  }, resultsSelector);
            console.log(imgs.join('\n'));
            for (const src in imgs){
                const exampleEmbed = new Discord.MessageEmbed()
                    .setTitle('tshirt')// need to make title the name of creator
                    .setImage(imgs[src]);

                receivedMessage.channel.send(exampleEmbed);

            }    
        }
   else {
    receivedMessage.channel.send("try appending a valid url, eg. `!tko https://jackbox.tv/somegiberish")
}

  console.log(`Command received: ${primaryCommand}`)
  console.log("Link: " + arguments) // There may not be any arguments
  console.log("Type: " + elemClass) // There may not be any arguments

}



function validateURL(urlStr) {
    var urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return urlregex.test(urlStr);
}

client.login(process.env.DISCORD_TOKEN);