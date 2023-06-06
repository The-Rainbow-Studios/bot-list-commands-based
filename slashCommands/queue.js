const { EmbedBuilder } = require("discord.js");
const config = require("../botconfig/config.js");
const ee = require("../botconfig/embed.js");
const settings = require("../botconfig/settings.js");
module.exports = {
  name: "queue", //the command name for the Slash Command
  category: "botlist",
  description: "Add your bot to shadow studio's", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [
    //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
    //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ]
    // {
    //   String: {
    //     name: "bot_id",
    //     description: "The ID of the bot you want to add?",
    //     required: true,
    //   },
    // }, //to use in the code: interacton.getInteger("ping_amount")
    // {
    //   String: {
    //     name: "prefix",
    //     description: "If it's command based bot, what's the prefix?",
    //     required: true,
    //   },
    // }, //to use in the code: interacton.getString("ping_amount")
    // //{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
    // //{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
    // //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
    // //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
    // {
    //   StringChoices: {
    //     name: "slash_commands",
    //     description: "What Ping do you want to get?",
    //     required: false,
    //     choices: [
    //       ["Yes", "true"],
    //       ["No", "false"],
    //     ],
    //   },
    // }, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
  ],
  run: async (client, interaction) => {
    try {
      //things u can directly access in an interaction!
      const {
        member,
        channelId,
        guildId,
        applicationId,
        commandName,
        deferred,
        replied,
        ephemeral,
        options,
        id,
        createdTimestamp,
      } = interaction;
      const { guild } = member;
      let obj = await client.db.get(`serverData.${guildId}.botsData`) || {}

	  let veri = Object.keys(obj).map(botID => {
		return {
		  ID: botID,
		  status: obj[botID].status
		};
	  }).filter(data => data.status == "pending")
	  if(veri.length <= 0) {
        return interaction.reply({
            ephemeral: true,
            embeds: [
                new EmbedBuilder()
                    .setTitle("Error")
                    .setDescription("There are no bots waiting for approval!")
                    .setColor("Red")
                    .setTimestamp()
            ]
        })
      } 
	  return interaction.reply({
            ephemeral: false,
            embeds: [
                new EmbedBuilder()
                    .setTitle("Success")
                    .setDescription(`System Now Total **${veri.length}** Bot Approval Pending! \n\n`+
                    veri.map(data => `(**${data.ID}**) | [Invite Link](https://discord.com/oauth2/authorize?client_id=${data.ID}&permissions=0&scope=bot%20applications.commands)) `).join("\n"))
                    .setColor("Green")
                    .setTimestamp()
                ]
      })

    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};
