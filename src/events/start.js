const { Events, REST, Routes, EmbedBuilder, Colors } = require('discord.js');
const { token, id, channelId, iconURL, text } = require('../config.json');
const fs = require('fs');
const path = require('path');

const rest = new REST({ version: '10' }).setToken(token);
const filePath = path.join(__dirname, '../../quickdb.json');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		 /** @type {import('../typings/leaderboard').default[] | undefined} */
     const leadboard = await client.db.get('leaderboard');
     if (!leadboard) await client.db.set('leaderboard', []);

		 fs.watchFile(filePath, async (curr, prev) => {
			 /** @type {import('../typings/leaderboard').default[]} */
			 const db = await client.db.get('leaderboard');

			 /** @type {import('discord.js').TextChannel} */
			 const channel = client.channels.cache.get(channelId);
			 const message = channel.lastMessage;
			 
			 const leadboard = db.sort((a, b) => b.messageSize - a.messageSize)
			 	.map((leader, index) => `\`${++index}\` - Kullanıcı: <@${leader.userId}> - Mesajı sayısı: \`${leader.messageSize}\``)

			const embed = new EmbedBuilder()
				.setColor(Colors.Blue)
				.setTitle('En çok mesajı olan kullanıcılar')
				.setDescription(leadboard.join('\n'))
				.setFooter({ text, iconURL })
				.setTimestamp()

			 if (message && message.author.id === client.user.id) {
				message.edit({ embeds: [embed] });
			 } else {
				channel.send({ embeds: [embed] })
			 }
		 });

    await rest.put(Routes.applicationCommands(id), {
      body: client.commands.toJSON().map((command) => command.data),
    });
	},
};