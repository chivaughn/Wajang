require('dotenv').config();

const axios = require('axios');
const { Client, WebhookClient} = require('discord.js');
const client = new Client();
const PREFIX = "$";
const { Player } = require("discord-player");
const player = new Player(client);
client.player = player;
const webhookClient = new WebhookClient(
    process.env.WEBHOOK_ID,
    process.env.WEBHOOK_TOKEN
);

client.player.on('trackStart', (message, track) => message.channel.send(`Now playing ${track.title}...`))


client.on('ready', () =>{
    console.log(`${client.user.username} is logged in.`);
})

client.on('message', async message => {
    if (message.author.bot) return;
    if (message.content.startsWith(PREFIX)) {
        const [COMMAND, ...args] = message.content
        .trim()
        .substring(PREFIX.length)
        .split(/ +/g);
    const COMMAND = args.shift().toLowerCase();

        
        if (COMMAND == 'kick') {
            const tag = `<@${message.member.id}>`;
            if (message.member.hasPermission('KICK_MEMBERS') ||
                message.member.hasPermission('ADMINISTRATOR')){
                const target = message.mentions.users.first();
                if (target) {
                    const targetMember = message.guild.members.cache.get(target.id);
                    targetMember.kick();
                    message.channel.send(`${target.username} has been kicked.`);
                } else {
                    message.channel.send(`${tag} Please specify someone to kick.`);
                }   
            } else {
                message.channel.send(`${tag} You do not have permissions to kick.`)
            }
            
        } else if (COMMAND == 'ban') {
            const tag = `<@${message.member.id}>`;
            if (message.member.hasPermission('BAN_MEMBERS') ||
                message.member.hasPermission('ADMINISTRATOR')){
                const target = message.mentions.users.first();
                if (target) {
                    const targetMember = message.guild.members.cache.get(target.id);
                    targetMember.ban();
                    message.channel.send(`${target.username} has been banned.`);
                } else {
                    message.channel.send(`${tag} Please specify someone to banned.`);
                }   
            } else {
                message.channel.send(`${tag} You do not have permissions to ban.`)
            }
        } else if (COMMAND == 'fortune') {
            
            let getJoke = async () => {
                let response = await axios.get('https://api.ef.gy/fortune');
                let fortune = response.data;
                return fortune;
            }

            let fortuneCookie = await getJoke();
            webhookClient.send(fortuneCookie);
        } else if (COMMAND == 'play'){
            let track = await client.player.play(message.member.voice.channel, args[0],message.member.user.tag);
            message.channel.send(`Currently playing ${track.name}! - Requested by ${track.requestedBy}`);
        } else if (COMMAND == 'stop') {
            let track = await client.player.stop(message.guild.id);
            message.channel.send(`STOPPED`);
        }
        
    };
    
})

client.login(process.env.BOT_TOKEN)