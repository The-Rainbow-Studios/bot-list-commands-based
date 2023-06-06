const { EmbedBuilder } = require("discord.js");
const config = require("../botconfig/config.js");
const ee = require("../botconfig/embed.js");
const settings = require("../botconfig/settings.js");
module.exports = {
  name: "accept", //the command name for the Slash Command
  category: "botlist",
  description: "Add your bot to shadow studio's", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: ["1107553442270040187"], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [
    //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
    //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ]
    {
      String: {
        name: "bot_id",
        description: "The ID of the bot you want to add?",
        required: true,
      },
    }, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
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
      const bot_id = options.getString("bot_id");

      const bot_member = await client.db.get(`serverData.${guildId}.botsData.${bot_id}`);
      const bot = await client.users.fetch(bot_id);
      if (!bot_member) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setDescription(`:x: | The bot isn't pending approval!`)
              .setColor(ee.wrongcolor)
              .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
          ],
        });
      }

      if (bot_member.status == "Approved") {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setDescription(`:x: | The bot you provided is already added!`)
              .setColor(ee.wrongcolor)
              .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
          ],
        });
      }
      let memberData
      try {
        memberData = await interaction.guild.members.fetch(bot_member.owner)
      } catch(e) {
        await client.db.delete(`serverData.${guildId}.botsData.${bot_id}`)
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setDescription(`:x: | The bot owner is not in the server, so deleting data for this bot!`)
              .setColor(ee.wrongcolor)
              .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
          ],
        })
      }
      memberData.roles.add("1107253437151850548", `Bot Added`)
       if(bot_member.status == "Pending")  db.subtract(`serverData.${guildId}.waitSize`, 1)
       if(bot_member.status == "Denied")  db.subtract(`serverData.${guildId}.redSize`, 1)
       await client.db.add(`serverData.${guildId}.succSize`, 1);
       await client.db.set(`serverData.${guildId}.botsData.${bot_id}.status`, "Approved")
      interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `:white_check_mark: | ${bot.tag} has been added to the list and accepted!`
            )
            .setColor(`Green`)
            .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
        ],
      });
      
      client.channels.cache.get("1107355177134084236").send({
        allowedMentions: { repliedUser: false,
          parse: ["users", "roles", "everyone"] },
        content: `<@${bot_member.owner}>`,
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `:white_check_mark: | ${bot.tag} has been added to the list and accepted!`
            )
            .setColor(`Green`)
            .addFields(
              {
                name: "Bot ID",
                value: String(bot_id),
                inline: true,
              },
              {
                name: "Bot Owner",
                value: String(bot_member.owner),
                inline: true,
              },
              {
                name: "Accepted At",
                value: `<t:${String(Math.floor(Date.now() / 1000))}:R>`,
                inline: true,
              },
              {
                name: "Invite Link",
                value: `[Invite Me!](https://discord.com/oauth2/authorize?client_id=${bot_id}&permissions=0&scope=bot%20applications.commands)`,
              }
            )
            .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
        ],
      });
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};
