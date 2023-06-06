const { EmbedBuilder } = require("discord.js");
const config = require("../botconfig/config.js");
const ee = require("../botconfig/embed.js");
const settings = require("../botconfig/settings.js");
module.exports = {
  name: "add", //the command name for the Slash Command
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
    }, //to use in the code: interacton.getInteger("ping_amount")
    {
      String: {
        name: "prefix",
        description: "If it's command based bot, what's the prefix?",
        required: true,
      },
    }, //to use in the code: interacton.getString("ping_amount")
    //{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
    //{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
    //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
    //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
    {
      StringChoices: {
        name: "slash_commands",
        description: "What Ping do you want to get?",
        required: false,
        choices: [
          ["Yes", "true"],
          ["No", "false"],
        ],
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
      if(channelId !== '1107331123031322694') {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setDescription(`:x: | You can't use this command here!`)
              .setColor(ee.wrongcolor)
              .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
          ],
        });
      }
      const prefix = options.getString("prefix");
      const bot_id = options.getString("bot_id") 
      const slash_commands = options.getString("slash_commands") || false
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
      if (await client.db.get(`serverData.${guildId}.botsData.${bot_id}`)) {
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
	  if((await client.db.get(`serverData.${guildId}.botsData.${bot_id}.status`)) === 'pending') {
		return interaction.reply({
			ephemeral: true,
			embeds: [
				new EmbedBuilder()
					.setDescription(`:x: | The bot you provided is already pending!`)
					.setColor(ee.wrongcolor)
					.setFooter({ text: ee.footertext, iconURL: ee.footericon }),
			],
		})
	  }
      await client.db.set(`pending_${bot_id}`, {
        bot_id: bot_id,
        owner_id: member.id,
        prefix: prefix,
        slash_commands: slash_commands,
        added_at: Math.floor(Date.now() / 1000),
      });
      await client.db.add(`serverData.${guildId}.waitSize`, 1)
      await client.db.set(`serverData.${guildId}.botsData.${bot_id}.owner`,  member.id)
      await client.db.set(`serverData.${guildId}.botsData.${bot_id}.status`, "pending")
	  
      let size = await client.db.get(`serverData.${guildId}.waitSize`) || 0;
      interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `:white_check_mark: | Your bot has been added to the list and pending approval!`
            )
            .setColor(ee.color)
            .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
        ],
      });
      client.channels.cache.get("1107355177134084236").send({ 
        allowedMentions: { repliedUser: false,
          parse: ["users", "roles", "everyone"] },
          content: `<@${member.id}>`,
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `:white_check_mark: | ${bot_member.tag} has been added to the list and pending approval! \n The queue size is now: ${size}`
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
                value: String(member.id),
                inline: true,
              },
              {
                name: "Prefix",
                value: String(prefix),
                inline: true,
              },
			  {
				name: "Slash Commands",
				value: String(slash_commands),
				inline: true,
			  },
			  {
				name: "Added At",
				value: `<t:${String(Math.floor(Date.now() / 1000))}:R>`,
				inline: true,
			  },
			  {
				name: "Invite Link",
				value: `[Invite Me!](https://discord.com/oauth2/authorize?client_id=${bot_id}&permissions=0&scope=bot%20applications.commands)`,
			  },
	  ).setFooter({ text: ee.footertext, iconURL: ee.footericon }),
        ],
      });
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};
