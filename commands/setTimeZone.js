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
              label: 'Hawaii Time',
              description: 'Insert Generic Surfing Reference Here',
              value: '-10',
            },
            {
              label: 'Alaska',
              description: 'Home of the Alaskan Bullworm. It\'s big, scary, and pink!',
              value: '-9',
            },
            {
              label: 'Pacific Time',
              description: 'For all of you Californians and other coastal people!',
              value: '-8',
            },
            {
              label: 'Mountain Time',
              description: 'The Rockies, The Desert, and the Salty Lake',
              value: '-7',
            },
            {
              label: 'Central Time',
              description: 'Ope! \'Scuse me! It\'s the Midwest!',
              value: '-6',
            },
            {
              label: 'Eastern Time',
              description: 'For all of those fancy city slickers in the East',
              value: '-5',
            },
            {
              label: 'Outside of the US',
              description: 'List timezones by their adjustment to Greenwhich Mean Time.',
              value: 'Global',
            },
          ),
      );
    await interaction.reply({content: 'Please set your timezone~', components: [row], ephemeral: true});
  }
}