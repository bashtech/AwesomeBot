const ModLog = require("./../../Modules/ModerationLogging.js");

module.exports = (bot, db, config, winston, userDocument, serverDocument, channelDocument, memberDocument, msg, suffix, commandData) => {
	if(suffix) {
		if(suffix.indexOf("|")>-1 && suffix.length>3) {
			var member = bot.memberSearch(suffix.substring(0, suffix.indexOf("|")).trim(), msg.guild);
			var reason = suffix.substring(suffix.indexOf("|")+1).trim();
		} else {
			var member = bot.memberSearch(suffix, msg.guild);
			var reason;
		}

		if(member) {
			member.ban(1).then(() => {
				msg.channel.createMessage("Bye-bye **@" + bot.getName(msg.guild, serverDocument, member) + "** 🔨");
				ModLog.create(msg.guild, serverDocument, "Ban", member, msg.member, reason);
			}).catch(err => {
				winston.error("Failed to ban member '" + member.user.username + "' from server '" + msg.guild.name + "'", {svrid: msg.guild.name, usrid: member.id}, err);
				msg.channel.createMessage("I couldn't ban **@" + bot.getName(msg.guild, serverDocument, member) + "** 🍇");
			});
		} else {
			msg.channel.createMessage("I couldn't find a matching member on this server.");
		}
	} else {
		msg.channel.createMessage("Do you want me to ban you? 😮");
	}
};