'use strict';
require('dotenv').config();
const discord = require('discord.js');
const express = require("express");
const bodyParser = require("body-parser");
const fs = require('fs');

const token = process.env.TOKEN;
const port = process.env.PORT || 4567;
const payload_path = process.env.PAYLOAD || '/payload';
const ping = process.env.PING;
console.log(payload_path);

const discord_client = new discord.Client();
const app = express();

if (!fs.existsSync('data.json')) fs.writeFileSync('data.json', '{}');

app.use(bodyParser.json());
app.listen(port, () => console.log(`Server listening for connections on port ${port}`));

discord_client.login(token);
discord_client.on('ready', () => console.log('Discord bot working'));
discord_client.on('message', (msg) => {
  let command = msg.content.split(' ')[0]
  if ((command === '.setUpdateChannel') && msg.member.hasPermission('ADMINISTRATOR')) {
    let data = JSON.parse(fs.readFileSync('data.json'));
    let guild_id = msg.guild.id;
    let channel_id = msg.channel.id;
    if (msg.guild.channels.cache.get(channel_id) === undefined) msg.channel.send('Wrong channel ID')
    else {
      data[guild_id] = channel_id;
      fs.writeFileSync('data.json', JSON.stringify(data));
      msg.channel.send('Notification channel set');
    };
  }
  else if ((command === '.removeUpdateChannel') && msg.member.hasPermission('ADMINISTRATOR')) {
    let data = JSON.parse(fs.readFileSync('data.json'));
    let guild_id = msg.guild.id;
    if (data[guild_id] === undefined) {
      msg.channel.send('There is no notification channel');
    }
    else {
      delete data[guild_id];
      fs.writeFileSync('data.json', JSON.stringify(data));
      msg.channel.send('Notification channel removed');
    };
  };
});

app.post(payload_path, (req, res) => {
  let data = JSON.parse(fs.readFileSync('data.json'))
  for (let i = 0; i < Object.keys(data).length; i++) {
    let guild_id = Object.keys(data)[i];
    if (data[guild_id] !== undefined) {
      let guild = discord_client.guilds.cache.get(guild_id);
      if (guild === undefined) {
        delete data[guild_id];
        fs.writeFileSync('data.json', JSON.stringify(data));
      }
      else {
        let channel = guild.channels.cache.get(data[guild_id]);
        if (channel === undefined) {
          delete data[guild_id];
          fs.writeFileSync('data.json', JSON.stringify(data));
        }
        else if (req.body.commits !== undefined) {
          let message
          if (ping === undefined) message = `${req.body.repository.name} got updated:\n`;
          else message = `@${ping_role} ${req.body.repository.name} got updated:\n`;
          for (let i = 0; i < req.body.commits.length; i++) message = message + `${i + 1}. ${req.body.commits[i].message}\n`;
          channel.send(message);
        };
      };
    };
  };
  res.status(200).end();
});

