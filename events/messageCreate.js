const { Events } = require('discord.js');
const database = require('../db');
const db = database.db;
const botTZ = -7;
const { token } = require('../config.json');


timestampRecurse = (str, adjustment) => {
  let result = str;

  console.log("Beginning of iteration: " + result);

  //Search for presence of a time format
  let regexIndex = str.search(/\d?\d[:]\d\d/);

  if (regexIndex > -1) {
    console.log("Regex found at index: " + regexIndex);
    //Initialize time
    let hour = 0;
    let min = 0;

    console.log("String: " + str);
    //Split strings at timestamp
    if (/\d\d[:]\d\d/.test(str)) {
      console.log("Regex Test Found result!")
      var firstHalf = str.slice(0, regexIndex);
      var replacement = str.slice(regexIndex, regexIndex + 5);
      var secondHalf = str.slice(regexIndex + 5);
      hour = parseInt(replacement.slice(0, 2));
      min = replacement.slice(3);
    } else {
      console.log("Regex Test Did not Find Result!");
      var firstHalf = str.slice(0, regexIndex);
      var replacement = str.slice(regexIndex, regexIndex + 4);
      var secondHalf = str.slice(regexIndex + 4);
      hour = parseInt(replacement.slice(0, 1));
      min = replacement.slice(2);
    }

    console.log("First Half: " + firstHalf);
    console.log("Replacement: " + replacement);
    console.log("Second Half: " + secondHalf);

    console.log("Preadjusted Hour: " + hour);
    //adjust for PM -- Assume PM unless stated otherwise
    if (!(-1 < secondHalf.search(/[Aa].?[Mm]/) && secondHalf.search(/[Aa].?[Mm]/) < 2) && hour < 12 ) {
      console.log("Afternoon and Less than Twelve!");
      hour = hour + 12;
    }
    //special rule for 12
    if ((-1 < secondHalf.search(/[Aa].?[Mm]/) && secondHalf.search(/[Aa].?[Mm]/) < 2) && hour == 12 ) {
      console.log("Exactly 12 and no AM!");
      hour = hour + 12;
    }

    console.log("Postadjusted Hour: " + hour);

    //Strip redundant AM and PM usage
    if (-1 < secondHalf.search(/[PpAa].?[Mm]/) && secondHalf.search(/[PpAa].?[Mm]/) < 2) {
      secondHalf = secondHalf.replace(/[PpAa].?[Mm]/, '');
    }


    //Factor in timezone adjustment
    hour += adjustment;

    //convert time into ms since epoch
    let schedule = new Date();
    schedule.setHours(hour, min, 0, 0);
    let converted = schedule.getTime();

    console.log("converted: " + converted);

    //time needs to be in Seconds since epoch, so dividing result by 1000. Must be in <t:{seconds}:t> format for appropriate display in discord message.
    replacement = `<t:${converted/1000}:t>`;
    console.log("Adjusted replacement: " + replacement);

    if (/\d+[:]\d\d/.test(secondHalf)) {
      console.log("Substring Detected, recursing!");
      secondHalf = timestampRecurse(secondHalf, adjustment);
    }
  }


  console.log("First Half: " + firstHalf);
  console.log("Replacement: " + replacement);
  console.log("secondHalf: " + secondHalf)
    if (firstHalf != null){
      result = firstHalf + replacement + secondHalf;
    }

  console.log("End of iteration: " + result);
  return result;
}

timestampShorthandRecurse = (str, adjustment) => {
  console.log("Before Shorthand: " + str);
  let result = '';

  //Search for presence of a time format
  let regexIndex = str.search(/\d?\d[ ]?[PpAa].?[Mm]/);

  if (regexIndex > -1) {
    //Initialize time
    let hour = 0;

    //Split strings at timestamp
    if (str.search(/\d\d[ ]?[PpAa].?[Mm]/) == regexIndex) {
      console.log(str);
      var firstHalf = str.slice(0, regexIndex);
      hour = str.slice(regexIndex, regexIndex + 2);
      var secondHalf = str.slice(regexIndex + 2);

      console.log("First Half: " + firstHalf);
      console.log("Hour " + hour);
      console.log("Second Half: " + secondHalf);


    } else {
      console.log(str);
      var firstHalf = str.slice(0, regexIndex);
       hour = str.slice(regexIndex, regexIndex + 1);
      var secondHalf = str.slice(regexIndex + 1);

    }

    //adjust for PM -- Assume PM unless stated otherwise
    if (!(-1 < secondHalf.search(/[Aa].?[Mm]/) && secondHalf.search(/[Aa].?[Mm]/) < 2) || hour > 12) {
      console.log("Add 12 to the hour: " + hour);
      hour = +hour + 12;
      console.log("After addition: " + hour)
    }

    //Strip redundant AM and PM usage
    if (-1 < secondHalf.search(/[PpAa].?[Mm]/) && secondHalf.search(/[PpAa].?[Mm]/) < 2) {
      secondHalf = secondHalf.replace(/[PpAa].?[Mm]/, '');
    }

    console.log("Hour: " + hour);
    console.log("Adjustment: " + adjustment);
    //Factor in timezone adjustment
    hour += adjustment;

    //convert time into ms since epoch
    let schedule = new Date();
    schedule.setHours(hour, 0, 0, 0);
    let converted = schedule.getTime();
    //time needs to be in Seconds since epoch, so dividing result by 1000. Must be in <t:{seconds}:t> format for appropriate display in discord message.
    var replacement = `<t:${converted/1000}:t>`;

    if (/[PpAa].?[Mm]/.test(secondHalf)) {
      secondHalf = timestampShorthandRecurse(secondHalf, adjustment);
    }

    result = firstHalf + replacement + secondHalf;
    console.log("After Shorthand changes: " + str);
    return result;
  }

  console.log("No shorthand changes made!");
  return str;
}

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {

  if (!message.author.bot || /!ignore/.test(message.content) < 1) {
      console.log("Message Recieved!");
      let str = message.content;

    //If message contains a time format, send it to the recursive helper
      if (/\d+[:]\d\d/.test(str) || /\d+[ ]?[PpAa].?[Mm]/.test(str)) {
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
          console.log(reply);

          fetch('https://discord.com/api/channels/732059486449041451/webhooks', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bot ${token}`
            }
          }).then(response => {
            if (!response.ok) {

            }
            return response.json();
          }).then(result => {

            var checkChannel = (webhookChannel) => {
              return (webhookChannel.channel_id === message.channelId && webhookChannel.user.id === '1062231086047952906');
            }

            return result[result.findIndex(checkChannel)]
          }).then(result => {
            console.log(message);
            fetch(result.url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  "content": reply,
                  "username": message.author.username,
                  "avatar_url": `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
              }),
            }).then(response => {
              if (!response.ok) {
                console.log("Error!");
              } else {
                console.log("Success!");
              }
              return response;
            }).then(response => {
              console.log(response);
            })

          })

          // await message.reply(reply);
        } else {

          try {
            await message.author.send("Sorry! It seems your timezone hasn't been set! To set it, you can use the /timezone command right here~");
          } catch (error) {
            console.error(error.rawError.message);
            await message.reply("Sorry! It seems your timezone hasn't been set! To set it, you can use the /timezone command right here~");
          }

        }
      } else {
        console.log("");
      }
    }
  }
}