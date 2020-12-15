require('dotenv').config();

const axios = require('axios');
const { Client, WebhookClient} = require('discord.js');
const client = new Client();
const PREFIX = "$";
const webhookClient = new WebhookClient(
    process.env.WEBHOOK_ID,
    process.env.WEBHOOK_TOKEN
);

client.on('ready', () =>{
    console.log(`${client.user.username} is logged in.`);
})

client.on('message', async message => {
    if (message.author.bot) return;
    if (message.content.startsWith(PREFIX)) {
        const [COMMAND, ...args] = message.content
        .trim()
        .substring(PREFIX.length)
        .split(/\s+/);

        
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
        }
        
    };
    
})

client.login(process.env.BOT_TOKEN)