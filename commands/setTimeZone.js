const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timezone')
    .setDescription('Set your Timezone!~'),
  async execute(interaction) {
    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('select')
          .setPlaceholder('Select your timezone')
          .addOptions(
            {
              label: 'Pacific Time',
              description: 'For all of you California and other coastal people!',
              value: -8,
            },
            {
              label: 'Mountain Time',
              description: 'The Rockies, The Desert, and the Salty Lake',
              value: -7,
            },
            {
              label: 'Central Time',
              description: 'I don\'t think I know anyone here',
              value: -6,
            },
            {
              label: 'Eastern Time',
              description: 'For all of those fancy city slickers in the East',
              value: -5,
            },
          ),
      );
    await interaction.reply({content: 'Please set your timezone~', components: [row], ephemeral: true});
  }
}