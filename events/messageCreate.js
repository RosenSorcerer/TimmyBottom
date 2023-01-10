const { Events } = require('discord.js');


//Improvement idea -- search for multiple using recursion.

timestampRecurse = (str) => {
  let result = '';

  //Search for presence of a time format
  let regexIndex = str.search(/\d+[:]\d\d/);

  if (regexIndex > -1) {

    //fetch timezone from db
    // let timezoneAdjust = -7;

    //Initialize time
    let hour = 0;
    let min = 0;

    //Split strings at timestamp
    if (/\d\d[:]\d\d/.test(str)) {
      var firstHalf = str.slice(0, regexIndex);
      var replacement = str.slice(regexIndex, regexIndex + 5);
      var secondHalf = str.slice(regexIndex + 5);
      hour = replacement.slice(0, 2);
      min = replacement.slice(3);
    } else {
      var firstHalf = str.slice(0, regexIndex);
      var replacement = str.slice(regexIndex, regexIndex + 4);
      var secondHalf = str.slice(regexIndex + 4);
      hour = replacement.slice(0, 1);
      min = replacement.slice(2);
    }

    //adjust for PM if necessary
    if (0 < secondHalf.search(/[Pp].?[Mm]/) && secondHalf.search(/[Pp].?[Mm]/) < 5) {
      hour = parseInt(hour) + 12;
    }

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
        timestampRecurse(str);
        await message.reply(timestampRecurse(str));
      }
    }
  }
}