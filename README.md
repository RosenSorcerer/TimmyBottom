# TimmyBottom
Discord Bot that automatically converts messages containing statements of time to a format that shows viewers the time adjusted to their timezone. 

This bot is setup to communicate with a postgres database to store timezone information for users. There is an .sql file and a communication template in the db folder for setup.

To install slash commands use the command "node deploy-commands.js"
To run the bot, use the command "node index.js"


Available slash commands are as follows
/ping -- the bot will reply to your message with "Pong!" if the bot is running correctly.
/timezone -- the bot will respond with a dropdown menu for you to input your timezone.

Otherwise the bot will read all messages looking for a time to convert. Times will only be recognized as one or two numbers, a colon, followed by two additional numbers. AM and PM (as well as variations in capitalization and punctuation) will be taken into account. 

As it is typical for users to be speaking about the afternoon in small servers, if a time does not include AM or PM, it will be assumed to be referring to PM. 
