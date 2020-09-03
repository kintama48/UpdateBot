# Repository update bot for Discord
A simple Discord bot for notifiying about commits in a Github repository by utilizing Github webhooks
## Environment variables
| Variable | Type    | Description                                                                                          |
| -------- | ------- | ---------------------------------------------------------------------------------------------------- |
| TOKEN    | string  | Your Discord bot token                                                                               |
| PORT     | integer | Web server port (default: 4567)                                                                      |
| PAYLOAD  | string  | Payload path (default: /payload)                                                                     |
| PING     | string  | The role or the person to ping without @, the bot doesn't ping anyone if the variable is not defined |
## Usage 
First of all you need to add a webhook yo your repository, its content type should be JSON and the push event should trigger the webhook.
To make the bot send notifications in your Discord channel you need to set the notification channel by using the command `.setUpdateChannel <channel_id>`.
The command `.removeUpdateChannel` is used to stop the bot from sending notifications in your server.
## Announcement example
![](https://github.com/FeckingPotato/UpdateBot/blob/master/example.jpg?raw=true)