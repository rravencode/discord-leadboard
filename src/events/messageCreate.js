const { Events } = require('discord.js');

module.exports = {
	name: Events.MessageCreate,
  /** @param {import('discord.js').Message} message */
	async execute(message) {
		 /** @type {import('discord.js').Client} */
     const bot = message.client;

     /** @type {import('quick.db').QuickDB} */
     const db = message.client.db;
     
     /** @type {import('../typings/leaderboard').default[] | undefined} */
     const leadboard = await db.get('leaderboard');
     if (!leadboard) {
      return await db.set('leaderboard', []);
     }

     if (message.author.bot || !message.guild || !message.channel.isTextBased() || message.webhookId) return;

     const userData = leadboard.find((leader) => leader.userId === message.author.id);

     if (!userData) {
      await db.push('leaderboard', {
        userId: message.author.id,
        dateNow: message.createdTimestamp,
        messageSize: 1,
      });
      return;
     }

     await db.set('leaderboard', leadboard.filter((leader) => leader !== userData));
     await db.push('leaderboard', {
      userId: message.author.id,
      dateNow: message.createdTimestamp,
      messageSize: userData.messageSize + 1,
     });
	},
};