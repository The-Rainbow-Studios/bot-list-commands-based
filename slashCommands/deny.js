const { EmbedBuilder } = require("discord.js");
const config = require("../botconfig/config.js");
const ee = require("../botconfig/embed.js");
const settings = require("../botconfig/settings.js");
module.exports = {
  name: "deny", //the command name for the Slash Command
  category: "botlist",
  description: "Deny the bot", //the command description for Slash Command Overview
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
    },
    {
      String: {
        name: "reason",
        description: "The reason for denying the bot",
        required: true,
      },
    },
    //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
  ],
  run: async (client, interaction) => {
    try {
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
      const reason = options.getString("reason");
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

      if (bot_member.status == "Denied") {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setDescription(`:x: | The bot you provided is already denied!`)
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
              .setDescription(`:x: | The bot you provided is approved try using \`/delete\`!`)
              .setColor(ee.wrongcolor)
              .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
          ],
        });
      }
      if(!interaction.guild.members.cache.get(bot_member.owner)) {
        await client.delete(`serverData.${guildId}.botsData.${bot_id}`)
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
      
       if(bot_member.status == "Pending")  db.subtract(`serverData.${guildId}.waitSize`, 1)
       await client.db.add(`serverData.${guildId}.redSize`, 1);
       await client.db.set(`serverData.${guildId}.botsData.${botID}.status`, "Denied")
       await client.db.set(`serverData.${guildId}.botsData.${botID}.redReason`, reason)
      interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `:x: | ${bot.tag} has been denied! Reason: ${reason}`
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
              `:x: | ${bot.tag} has been denied!`
            )
            .setColor(`Yellow`)
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
                name: "Denied At",
                value: `<t:${String(Math.floor(Date.now() / 1000))}:R>`,
                inline: true,
              },
              {
                name: "Reason",
                value: `${reason}`,
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
