const { Colors, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { iconURL, text } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leadboard')
		.setDescription('En çok mesaj yazan kullanıcıları listeleyebilirsin.'),
  /** @param {import('discord.js').ChatInputCommandInteraction} interaction */
	async execute(interaction) {

    /** @type {import('discord.js').Client} */
    const bot = interaction.client;

    /** @type {import('quick.db').QuickDB} */
		const db = interaction.client.db;
    
    /** @type {import('../../typings/leadboard').default[]} */
    const leadboard = await db.get('leaderboard') ?? [];

    if (!leadboard || !leadboard.length) {
      return interaction.reply({
        embeds: [{ color: Colors.Red, description: '❌ **|** Liderlik tablosu daha aktif olmamış, tekrardan deneyin.' }]
      });
    }

    const lb = leadboard.sort((a, b) => b.messageSize - a.messageSize)
      .map((leader, index) => `\`${++index}\` - Kullanıcı: <@${leader.userId}> - Mesajı sayısı: \`${leader.messageSize}\``)

   const embed = new EmbedBuilder()
      .setColor(Colors.Blue)
      .setTitle('En çok mesajı olan kullanıcılar')
      .setDescription(lb.join('\n'))
      .setFooter({ text, iconURL })
      .setTimestamp()

    await interaction.reply({ embeds: [embed] });
	},
};