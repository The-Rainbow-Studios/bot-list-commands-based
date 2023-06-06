const { EmbedBuilder } = require("discord.js");
const config = require("../botconfig/config.js");
const ee = require("../botconfig/embed.js");
const settings = require("../botconfig/settings.js");
module.exports = {
  name: "profile", //the command name for the Slash Command
  category: "botlist",
  description: "Add your bot to shadow studio's", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
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
    } //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
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
      const bot_id = options.getString("bot_id") 
      let bot_member
      try {
      bot_member = await client.users.fetch(bot_id, { force: true });
      } catch (e) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setDescription(`:x: | The user doesnt exist!`)
              .setColor(ee.wrongcolor)
              .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
          ],
        });
      }
	  if(!bot_member) {
		return interaction.reply({
			ephemeral: true,
			embeds: [
				new EmbedBuilder()
					.setDescription(`:x: | The user doesnt exist!`)
					.setColor(ee.wrongcolor)
					.setFooter({ text: ee.footertext, iconURL: ee.footericon }),
			],
		})
	  }
	  
      if (!bot_member.bot) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setDescription(`:x: | The user you provided is not a bot!`)
              .setColor(ee.wrongcolor)
              .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
          ],
        });
      }
      let bot = await client.db.get(`serverData.${guildId}.botsData.${bot_id}`);
      if (!bot) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setDescription(`:x: | The bot you provided is not in the list!`)
              .setColor(ee.wrongcolor)
              .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
          ],
        });
      }
      let ownerName = await client.users.fetch(bot.owner);
      let check = await interaction.guild.members.fetch(bot_id)
      interaction.reply({
        ephemeral: false,
        embeds: [
          new EmbedBuilder()
            .setColor(`Green`)
            .setImage(`https://api.tejas404.xyz/image/profileimage?key=y02dy1c6r25kv6snyW0ZCOM7d&userid=${bot_id}&badgesFrame=true&createdDate=true`)
            .addFields({
              name: `Bot Name/ID`,
              value: `\`${bot_member.username}\`(**${bot_member.id}**)`,
              inline: true
            },
            {
              name: `Bot Owner`,
              value: `\`${ownerName.username}\`(**${ownerName.id}**)`,
            },
            {
              name: `Bot Status`,
              value: bot.status == "Approved" && !check 
              ? "Approved (Not invited on Server!)" 
              : bot.status == "Denied" && check  
              ? "Denied (invited on Server)"  
              : bot.status == "Pending"  && check
              ? "Pending (invited on Server)"
              : bot.status

            }, {
              name: `Denied Why`,
              value: `\`${bot.redReason || `No Reason Provided or Not Denied!`}\``,
              inline: false
            })
            .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
        ],
      });
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};
