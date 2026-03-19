const { Client, GatewayIntentBits, EmbedBuilder, ActivityType } = require('discord.js');
const express = require('express');
const app = express();

// Render uyanık tutma sistemi
app.get('/', (req, res) => res.send('RayzelNW 7/24 Aktif!'));
app.listen(process.env.PORT || 3000);

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent 
    ] 
});

let xpData = {}; // Basit XP deposu

client.on('ready', () => {
    console.log(`${client.user.tag} girişi yapıldı!`);
    client.user.setActivity('play.rayzelnw.com', { type: ActivityType.Playing });
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    
    // XP Sistemi
    if (!xpData[message.author.id]) xpData[message.author.id] = { xp: 0, level: 1 };
    xpData[message.author.id].xp++;

    if (xpData[message.author.id].xp >= 50) {
        xpData[message.author.id].level++;
        xpData[message.author.id].xp = 0;
        message.reply(`🎊 **Tebrikler ${message.author.username}!** RayzelNW'de Seviye Atladın: **Level ${xpData[message.author.id].level}**`);
    }
});

// Komutlar (Slash komutlarını Discord portalından veya kodla kaydedebilirsin)
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'istatistik') {
        const data = xpData[interaction.user.id] || { xp: 0, level: 1 };
        const embed = new EmbedBuilder()
            .setTitle('📊 RayzelNW İstatistikleri')
            .setColor(0x3498db)
            .addFields(
                { name: '✨ Seviye', value: `${data.level}`, inline: true },
                { name: '📈 XP', value: `${data.xp}/50`, inline: true }
            )
            .setFooter({ text: 'play.rayzelnw.com' });
        
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
});

client.login(process.env.TOKEN);
