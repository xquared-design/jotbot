// Run dotenv
require('dotenv').config();

const puppeteer = require('puppeteer');

let pBrowser = undefined;
let pPage = undefined;

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);

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
    receivedMessage.channel.send("try appending a valid url, eg. `!tko https://jackbox.tv/somegiberish")
    return
   }  
  //try {
    pBrowser = await puppeteer.launch();
    pPage = await pBrowser.newPage();
    
    await pPage.goto(arguments).then(() => console.log('loaded page:' + arguments));
    await pPage.waitForTimeout(3000)
    .then(() => console.log('Waited a second!'));;
  //} catch (error){console.error()};

  if (primaryCommand === "tko") {
        elemClass = "shirt"
        //try {
          await processShirt(pPage,receivedMessage,elemClass)
        //} catch (error) {
        //  console.error();          
        //}
  } else if (primaryCommand === "patents") {
        elemClass = "ps"
        try {
          await processPSWC(pPage,receivedMessage,elemClass)
        } catch(error){console.error();}
  } else if (primaryCommand === "champd") {
      elemClass = "wc"
      try {
        await processPSWC(pPage,receivedMessage,elemClass)
      } catch(error){console.error();} 
      
    
    //await pPage.screenshot({path: 'full.png', fullPage: true});
  } else if (primaryCommand === "brack") {
      elemClass = "brk"
      try {
          await processBrack(pPage,receivedMessage,elemClass)
      } catch(error){console.error();} 
    
  
  //await pPage.screenshot({path: 'full.png', fullPage: true});
} else {
    receivedMessage.channel.send("I don't understand the command. Try `!tko`, `!champd` or `!patents`")  
  }



  console.log(`Command received: ${primaryCommand}`)
  //console.log("Link: " + arguments) // There may not be any arguments
  console.log("Type: " + elemClass) // There may not be any arguments

  await pBrowser.close();

}

 async function processPSWC(page,receivedMessage,elemClass){
  receivedMessage.channel.send("Type: " + elemClass)
  const divsSelector=`div.${elemClass}-share-container`;
  const resultsSelector = `div.${elemClass}-captioned-image.open`;
  console.log(divsSelector);
  const divHandles =  await page.$$(divsSelector);
  let URLs = [];
  //console.log(divHandles);
  for (const divHandle in divHandles){
    await divHandles[divHandle].click();
    await page.waitForSelector(resultsSelector);
    console.log("clicked" + divHandle)
    URLs[divHandle]=await divHandles[divHandle].$eval(`img.${elemClass}-image`, imgH=>imgH.src);
    const exampleEmbed = new Discord.MessageEmbed()
                        //.setTitle(imgHandles[Handle].split(`\t`)[0])// need to make title the name of creator
                        .setImage(URLs[divHandle]);
                    //console.log(imgs.src);
                    receivedMessage.channel.send(exampleEmbed);
  }
  console.log(URLs)
} 

async function processShirt(page, receivedMessage, elemClass){

    //receivedMessage.channel.send("Link: " + arguments)
    receivedMessage.channel.send("Type: " + elemClass)
 
    const resultsSelector="img." + elemClass + "-image[src]";
    try{await page.waitForSelector(resultsSelector);}catch(error){console.error();}
    page.waitForTimeout(3000);
  
    const imgHandles = await page.$$eval(resultsSelector, (imgs) => {
       return imgs.map((img)=>{
        console.log(`div.shirt-title`)
        const title = img.nextSibling.querySelector(`div.shirt-title`).innerHTML;
        return `${title}\t${img.src}`
      })

    })

   
    console.log(imgHandles);
    for (const Handle in imgHandles){
      const exampleEmbed = new Discord.MessageEmbed()
                        .setTitle(imgHandles[Handle].split(`\t`)[0])// need to make title the name of creator
                        .setImage(imgHandles[Handle].split(`\t`)[1]);

                    receivedMessage.channel.send(exampleEmbed);
    }
    await pPage.screenshot({path: 'shirt.png', fullPage: true});

}

async function processBrack(page, receivedMessage, elemClass){

  //receivedMessage.channel.send("Link: " + arguments)
  receivedMessage.channel.send("Type: " + elemClass)

  const resultsSelector="img." + elemClass + "-image[src]";
  try{await page.waitForSelector(resultsSelector);}catch(error){console.error();}
  page.waitForTimeout(3000);

  const imgHandles = await page.$$eval(resultsSelector, (imgs) => {
     return imgs.map((img)=>{
     
      return `${img.src}`
    })

  })

 
  console.log(imgHandles);
  for (const Handle in imgHandles){
    const exampleEmbed = new Discord.MessageEmbed()
                      .setImage(imgHandles[Handle]);

                  receivedMessage.channel.send(exampleEmbed);
  }
  await pPage.screenshot({path: 'brack.png', fullPage: true});

}

function validateURL(urlStr) {
    var urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return urlregex.test(urlStr);
}

client.login(process.env.DISCORD_TOKEN);