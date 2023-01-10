const { Events } = require('discord.js');


//Improvement idea -- search for multiple using recursion.
module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
  if (!message.author.bot) {
      let str = message.content;

      //Search for presence of a time format
      regexIndex = str.search(/\d+[:]\d\d/);

      if (regexIndex > -1) {

      //fetch timezone from db
        let timezoneAdjust = -7;
        let botTZ = -7;
        let hour = 0;
        let min = 0;

        //Split strings at timestamp
        if (/\d\d[:]\d\d/.test(str)) {
          firstHalf = str.slice(0, regexIndex);
          replacement = str.slice(regexIndex, regexIndex + 5);
          secondHalf = str.slice(regexIndex + 5);
          hour = replacement.slice(0, 2);
          min = replacement.slice(3);
        } else {
          firstHalf = str.slice(0, regexIndex);
          replacement = str.slice(regexIndex, regexIndex + 4);
          secondHalf = str.slice(regexIndex + 4);
          hour = replacement.slice(0, 1);
          min = replacement.slice(2);
        }


        //adjust for PM if necessary
        if (0 < secondHalf.search(/[Pp].?[Mm]/) && secondHalf.search(/[Pp].?[Mm]/) < 5) {
          hour = parseInt(hour) + 12;
          console.log(secondHalf);
        }

        //Strip redundant AM and PM usage
        secondHalf = secondHalf.replace(/[PpAa].?[Mm]/, '');
        //convert time into MS since epoch
        console.log(hour,min);
        let schedule = new Date();
        console.log(schedule);
        schedule.setHours(hour, min, 0, 0);
        console.log(schedule);
        let converted = schedule.getTime();
        let reconverted = new Date(converted);
        console.log(reconverted);
        replacement = `<t:${converted/1000}:t>`;
        console.log(converted);


          await message.reply(firstHalf + replacement + secondHalf);

      }
    }
  }
}