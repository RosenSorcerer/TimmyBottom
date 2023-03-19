const { Events } = require('discord.js');
const database = require('../db');
const db = database.db;
const botTZ = -7;


timestampRecurse = (str, adjustment) => {
  let result = str;


  //Search for presence of a time format
  let regexIndex = str.search(/\d?\d[:]\d\d/);

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
    if (!(-1 < secondHalf.search(/[Aa].?[Mm]/) && secondHalf.search(/[Aa].?[Mm]/) < 2) || hour > 12) {
      hour = hour + 12;
    }

    //Strip redundant AM and PM usage
    if (-1 < secondHalf.search(/[PpAa].?[Mm]/) &&secondHalf.search(/[PpAa].?[Mm]/) < 2) {
      secondHalf = secondHalf.replace(/[PpAa].?[Mm]/, '');
    }


    //Factor in timezone adjustment
    hour += adjustment;

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
 if (firstHalf) {
  result = firstHalf + replacement + secondHalf;
 }
  return result;
}

timestampShorthandRecurse = (str, adjustment) => {
  let result = '';

  //Search for presence of a time format
  let regexIndex = str.search(/\d?\d[ ]?[PpAa].?[Mm]/);

  if (regexIndex > -1) {

    //Initialize time
    let hour = 0;

    //Split strings at timestamp
    if (str.search(/\d\d[ ]?[PpAa].?[Mm]/) == regexIndex) {
      var firstHalf = str.slice(0, regexIndex);
      hour = str.slice(regexIndex, regexIndex + 2);
      var secondHalf = str.slice(regexIndex + 2);

    } else {
      var firstHalf = str.slice(0, regexIndex);
       hour = str.slice(regexIndex, regexIndex + 1);
      var secondHalf = str.slice(regexIndex + 1);


    }

    //adjust for PM -- Assume PM unless stated otherwise
    if (!(-1 < secondHalf.search(/[Aa].?[Mm]/) && secondHalf.search(/[Aa].?[Mm]/) < 2) || hour > 12) {
      hour = hour + 12;
    }

    //Strip redundant AM and PM usage
    if (-1 < secondHalf.search(/[PpAa].?[Mm]/) &&secondHalf.search(/[PpAa].?[Mm]/) < 2) {
      secondHalf = secondHalf.replace(/[PpAa].?[Mm]/, '');
    }


    //Factor in timezone adjustment
    hour += adjustment;

    //convert time into ms since epoch
    let schedule = new Date();
    schedule.setHours(hour, 0, 0, 0);
    let converted = schedule.getTime();
    //time needs to be in Seconds since epoch, so dividing result by 1000. Must be in <t:{seconds}:t> format for appropriate display in discord message.
    var replacement = `<t:${converted/1000}:t>`;

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
      console.log("Message Recieved!");
      let str = message.content;

    //If message contains a time format, send it to the recursive helper
      if (/\d+[:]\d\d/.test(str) || /\d+[ ]?[PpAa].?[Mm].test(str)/) {
        console.log("It's go time!~");
        //fetch timezone from db
        var userTZ;
        await db.query(`SELECT timezone FROM users WHERE user_id = $1`, [message.author.id])
        .then((res) => {
          if(res.rows[0]) {
            userTZ = res.rows[0].timezone;
          }
        })

        if (userTZ) {
          var reply = timestampRecurse(str, botTZ - userTZ);
          reply = timestampShorthandRecurse(reply, botTZ - userTZ);
          await message.reply(reply);
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