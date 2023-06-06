module.exports = async (client, member) => {
    member.guild.members.cache.filter(async (s) => await client.db.get(`serverData.${member.guild.id}.botsData.${s.id}`)).forEach(async(x) => {
        let bot = await client.db.get(`serverData.${member.guild.id}.botsData.${x.id}`);
        if(bot){
        if(bot.owner == member.id){
               member.guild.bans.create(x, {reason: "Owner Left Server."})
           await client.db.set(`serverData.${member.guild.id}.botsData.${x.id}.status`, "Denied")
          await client.db.set(`serverData.${member.guild.id}.botsData.${x.id}.redReason`, "Owner Left Server.")
        }
      }
    })
}