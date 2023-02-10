const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
  async execute(interaction) {
    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('select')
          .setPlaceholder('Select your timezone')
          .addOptions(
            {
              label: '-12:00',
              description: '-12:00 UTC Offset',
              value: '-12',
            },
            {
              label: '-11:00',
              description: '-11:00 UTC Offset',
              value: '-11',
            },
            {
              label: '-10:00',
              description: '-12:00 UTC Offset',
              value: '-10',
            },
            {
              label: '-09:00',
              description: '-9:00 UTC Offset',
              value: '-9',
            },
            {
              label: '-08:00',
              description: '-8:00 UTC Offset',
              value: '-8',
            },
            {
              label: '-07:00',
              description: '-7:00 UTC Offset',
              value: '-7',
            },
            {
              label: '-06:00',
              description: '-6:00 UTC Offset',
              value: '-6',
            },
            {
              label: '-05:00',
              description: '-5:00 UTC Offset',
              value: '-5',
            },
            {
              label: '-04:00',
              description: '-4:00 UTC Offset',
              value: '-4',
            },
            {
              label: '-03:00',
              description: '-3:00 UTC Offset',
              value: '-3',
            },
            {
              label: '-02:00',
              description: '-2:00 UTC Offset',
              value: '-2',
            },
            {
              label: '-01:00',
              description: '-1:00 UTC Offset',
              value: '-1',
            },
            {
              label: '+00:00',
              description: '0:00 UTC Offset',
              value: '0',
            },
            {
              label: '+01:00',
              description: '1:00 UTC Offset',
              value: '1',
            },
            {
              label: '+02:00',
              description: '2:00 UTC Offset',
              value: '2',
            },
            {
              label: '+03:00',
              description: '3:00 UTC Offset',
              value: '3',
            },
            {
              label: '+04:00',
              description: '4:00 UTC Offset',
              value: '4',
            },
            {
              label: '+05:00',
              description: '5:00 UTC Offset',
              value: '5',
            },
            {
              label: '+06:00',
              description: '6:00 UTC Offset',
              value: '6',
            },
            {
              label: '+07:00',
              description: '7:00 UTC Offset',
              value: '7',
            },
            {
              label: '+08:00',
              description: '8:00 UTC Offset',
              value: '8',
            },
            {
              label: '+09:00',
              description: '9:00 UTC Offset',
              value: '9',
            },
            {
              label: '+10:00',
              description: '10:00 UTC Offset',
              value: '10',
            },
            {
              label: '+11:00',
              description: '11:00 UTC Offset',
              value: '11',
            },
            {
              label: '+12:00',
              description: '12:00 UTC Offset',
              value: '12',
            }
          ),
      );
    await interaction.update({content: 'Please set your timezone~', components: [row], ephemeral: true});
  }
}