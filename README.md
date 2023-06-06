# Discord.js v14 Bot List commands Based

## Can I use this bot?

> Sure you can! But do not tell you made it, just add a line or don't remove footer

#### For People making a youtube video on it

> There should be a line in your video description <br>

```
Credits to visa2code - https://youtube.com/@visa2code
His discord server - https://discord.gg/rainbow-studios-free-codes-869916537610448897
```

> Any video not following this will be taken down!<br>

## Setup this sweet handler

- Step 1 <br>
  Create a `.env` file with this template

```
TOKEN=secret
```

Fore replit users<br>
[click here](https://replit.com/github/The-Rainbow-Studios/bot-list-commands-based) <br>

- Step 2 <br>
  Fill `./botconfig/config.js` file with this template

```js
module.exports = {
  "token": process.env.TOKEN,
  "dbType": "", //quick.db OR MONGO
  "MONGOtype": "", //quickmongo OR MONGOOSE
  "MongoURL": "", //if dbType = MONGO, this is required else skip
  "loadSlashsGlobal": true,
  "dirSetup": [{
    "Folder": "Info", "CmdName": "info",
    "CmdDescription": "Grant specific Information about something!"
  }]
}

```

Tip: [How to get a mongodb URL?](https://www.youtube.com/watch?v=RQMWKRlMtH0 "YouTube Video") <br>


- Step 3 
  Now te final step. Run `npm install` and it will install all necessary packages. At last run `npm run start` or `node .`
  
  **And your bot should be up and running!**<br>
**For Emojis [Click here](https://discord.gg/programmers "Shadow Studios")**

## Problems? or cant host it?

You can ask help in my support server by clicking [here](https://discord.gg/programmers "Shadow Studios")

## Contributing

Steps to contribute:<br>

![Contirbute](https://i.imgur.com/qN2RoJF.png)<br>

That's it Thanks for contributing!<br>

# License

Apache 2.0

# Support

For support join our [discord support server](https://discord.gg/programmers).

# Authors

- [@TejasLamba2006](https://github.com/TejasLamba2006)
