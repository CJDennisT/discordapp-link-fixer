// Config file
const config = require('./config.js')
// DiscordJS
const { Intents, Client } = require('discord.js')
// Discord Client
const discordClient = new Client({
  intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES ]
})

// Global variables
const badLink = 'https://media.discordapp.net/'
const goodLink =  'https://cdn.discordapp.com/'

// Extension variables
const exts = [ '.mp4','.mov','.webm', ]

// Checks if bot is online
discordClient.on('ready', () => {
  console.log('Bot is Online')
})

// Checks if a message was created
discordClient.on('messageCreate', (message) => {
  // Checks if message author is a bot
  if (message.author.bot) return

  // Checks if the message starts with a bad discord media link
  if (message.content.startsWith(badLink)) {
    // Local variables
    let e = false
    let i = 0
    // Loop to check if link ends with bad extension
    while (!e && i < exts.length) {
      // If message ends with bad extension
      if (message.content.endsWith(exts[i])) {
        // Console log
        console.log(`Bad ${exts[i]} link DETECTED`)
        // Extension is true
        e = true
      } else {
        // Iterate and continue loop
        i++
      }
    }
    // If extension is true
    if (e) {
      // Slices message to remove the bad link
      var slice = message.content.slice(badLink.length).split(/ +/)
      // Creates a message with the good link
      var newLink = goodLink + slice
      // Sends / deletes a temporary message then sends webhook message
      message.channel.send('Bad link detected! Loading new link!')
      .then (async (msg) => {
        // Deletes the temporary message
        msg.delete()
        // Replies with a fixed link
        message.reply({
          // Creates content for message
          content: newLink
        })
        // Log when a bad link is fixed
        console.log('Bad link FIXED')
      })
    }
  }

  // Classic Ping Pong Test
  if (message.content === 'ping!') {
    // Log when ping! is detected
    console.log('ping!')
    // Creates a message to measure round trip ms
    message.channel.send('Loading data').then (async (msg) => {
      // Deletes the message
      msg.delete()
      // Replies to sender with information
      message.reply({
        // Creates content for message
        content: `pong!`
        // Compares messages timestamps to calculate ms
        + `\n:wave: ${msg.createdTimestamp - message.createdTimestamp}ms.`
        // Sends API ms
        + `\n:computer: ${Math.round(discordClient.ws.ping)}ms`
      })
      // Log when pong! is sent
      console.log('pong!')
    })
  }
})

// Logs in with API token 
discordClient.login(config.DISCORD_TOKEN)