const { Events } = require('discord.js');
const database = require('../db');
const db = database.db;

setTimezone = (id, value) => {
	db.query(`INSERT INTO users(user_id, timezone) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET timezone = $2`, [id, parseInt(value)], (err, result) => {
    if (err) {
      console.error(err);
      return err;
    }
		return;
  })
return;
}

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
			}
		}

		if(interaction.isStringSelectMenu()) {
			let err = setTimezone(interaction.user.id, interaction.values[0])
			if (err) {
				await interaction.update({content: 'Something went wrong!', components: [], ephemeral: true});
			}
			await interaction.update({content: 'Timezone Set! Thank you~', components: [], ephemeral: true});
		}
	},
};