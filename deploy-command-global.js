const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');

const commands = [];
// Grab all command files from the commands directory
const commandFiles = fs.readdirSync('./commands-private').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands-private/${file}`);
  commands.push(command.data.toJSON());
}

//Construct and prepare a REST module instance
const rest = new REST({ version: '10' }).setToken(token);

(async() => {
  try {
    console.log(`Started refreshing ${commands.length} application slash commands!`);

    const data = await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands }
    );
    console.log(`Successfully reloaded ${data.length} application slash commands!~`);

  } catch (error) {
    console.error(error);
  }
})();