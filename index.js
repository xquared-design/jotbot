// Run dotenv
require('dotenv').config();

const puppeteer = require('puppeteer');

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
   // Prevent bot from responding to its own messages
   if (msg.author == client.user) {
    return
   }  
   if (msg.content.startsWith("!")) {
    processCommand(msg)
   }
});

function processCommand(receivedMessage) {
  let fullCommand = receivedMessage.content.substr(1) // Remove the leading exclamation mark
  let splitCommand = fullCommand.split(" ") // Split the message up in to pieces for each space
  let primaryCommand = splitCommand[0] // The first word directly after the exclamation is the command
  let arguments = splitCommand.slice(1) // All other words are arguments/parameters/options for the command
  
  console.log("Command received: " + primaryCommand)
  console.log("Arguments: " + arguments) // There may not be any arguments

  if (primaryCommand == "TKO") {
      tkoCommand(arguments, receivedMessage)
  } else if (primaryCommand == "patent") {
      patentCommand(arguments, receivedMessage)
  } else if (primaryCommand == "champ") {
      champCommand(arguments, receivedMessage)
  } else {
      receivedMessage.channel.send("I don't understand the command. Try `!TKO` or `!patent`")
  }

  
}

function tkoCommand(arguments, receivedMessage) {
  if (arguments.length > 0) {
      receivedMessage.channel.send("link: " + arguments)
      
  } else {
      receivedMessage.channel.send("`!TKO [link]`")
  }
}

function patentCommand(arguments, receivedMessage) {
  if (arguments.length > 0) {
    receivedMessage.channel.send("link: " + arguments)
  } else {
    receivedMessage.channel.send("`!patent [link]`")
    }
}

function patentCommand(arguments, receivedMessage) {
    if (arguments.length > 0) {
      receivedMessage.channel.send("link: " + arguments)
  } else {
      receivedMessage.channel.send("`!patent [link]`")
  }
}
client.login(process.env.DISCORD_TOKEN);