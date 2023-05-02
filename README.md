# TimmyBottom
Discord Bot that automatically converts messages containing statements of time to a format that shows viewers the time adjusted to their timezone. 

This bot is setup to communicate with a postgres database to store timezone information for users. There is an .sql file and a communication template in the db folder for setup.

### Installation
To install discord server commands use the command "node deploy-commands.js"
To run the bot, use the command "node index.js"

### Available Discord Commands
/ping -- the bot will reply to your message with "Pong!" if the bot is running correctly.
/timezone -- the bot will respond with a dropdown menu for you to input your timezone. 

### Usage
TimmyBottom will read all messages in a discord server. If a time is identified, the bot will respond to this message with a universal time or a request to set your timezone.

Times will only be recognized as one or two numbers, a colon, followed by two additional numbers. AM and PM (as well as variations in capitalization and punctuation) will be taken into account. As it is typical for users to be speaking about the afternoon in small servers, if a time does not include AM or PM, it will be assumed to be referring to PM. 

As such, this bot will interpret 8:30, 08:30, 8:30PM, 08:30 p.m. and 20:30 as the same time. It will interpret 8:30 am as 12 hours earlier, and it will not identify 8:3 as a time at all. 
