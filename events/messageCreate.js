const { Events } = require('discord.js');
const database = require('../db');
const db = database.db;
const botTZ = -7;


timestampRecurse = (str, adjustment) => {
  let result = '';

  //Search for presence of a time format
  let regexIndex = str.search(/\d+[:]\d\d/);

  if (regexIndex > -1) {

    //Initialize time
    let hour = 0;
    let min = 0;

    //Split strings at timestamp
    if (/\d\d[:]\d\d/.test(str)) {
      var firstHalf = str.slice(0, regexIndex);
      var replacement = str.slice(regexIndex, regexIndex + 5);
      var secondHalf = str.slice(regexIndex + 5);
      hour = parseInt(replacement.slice(0, 2));
      min = replacement.slice(3);
    } else {
      var firstHalf = str.slice(0, regexIndex);
      var replacement = str.slice(regexIndex, regexIndex + 4);
      var secondHalf = str.slice(regexIndex + 4);
      hour = parseInt(replacement.slice(0, 1));
      min = replacement.slice(2);
    }

    //adjust for PM -- Assume PM unless stated otherwise
    if (!(-1 < secondHalf.search(/[Aa].?[Mm]/) && secondHalf.search(/[Aa].?[Mm]/) < 5) || hour > 12) {
      hour = hour + 12;
    }

    //Factor in timezone adjustment
    hour += adjustment;

    //Strip redundant AM and PM usage
    secondHalf = secondHalf.replace(/[PpAa].?[Mm]/, '');

    //convert time into ms since epoch
    let schedule = new Date();
    schedule.setHours(hour, min, 0, 0);
    let converted = schedule.getTime();
    //time needs to be in Seconds since epoch, so dividing result by 1000. Must be in <t:{seconds}:t> format for appropriate display in discord message.
    replacement = `<t:${converted/1000}:t>`;

    if (/\d+[:]\d\d/.test(secondHalf)) {
      secondHalf = timestampRecurse(secondHalf);
    }
  }

  result = firstHalf + replacement + secondHalf;
  return result;
}

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
  if (!message.author.bot) {
      let str = message.content;

    //If message contains a time format, send it to the recursive helper
      if (/\d+[:]\d\d/.test(str)) {
        //fetch timezone from db
        var userTZ;
        await db.query(`SELECT timezone FROM users WHERE user_id = $1`, [message.author.id])
        .then((res) => {
          if(res.rows[0]) {
            userTZ = res.rows[0].timezone;
          }
        })

        if (userTZ) {
          await message.reply(timestampRecurse(str, botTZ - userTZ ));
        } else {

          try {
            await message.author.send("Sorry! It seems your timezone hasn't been set! To set it, you can use the /timezone command right here~");
          } catch (error) {
            console.error(error.rawError.message);
            await message.reply("Sorry! It seems your timezone hasn't been set! To set it, you can use the /timezone command right here~");
          }

        }
      }
    }
  }
}