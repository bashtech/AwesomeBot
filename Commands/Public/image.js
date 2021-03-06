const giSearch = require("./../../Modules/GoogleImageSearch.js");

module.exports = (bot, db, config, winston, userDocument, serverDocument, channelDocument, memberDocument, msg, suffix, commandData) => {
	if(suffix) {
		var start;
		if(suffix.substring(suffix.lastIndexOf(" ")+1).toLowerCase()=="random" && suffix.substring(0, suffix.lastIndexOf(" "))) {
            suffix = suffix.substring(0, suffix.lastIndexOf(" "));
            start = getRandomInt(0, 19);
        }

        giSearch(serverDocument, suffix, serverDocument.config.moderation.isEnabled && serverDocument.config.moderation.filters.nsfw_filter.isEnabled && serverDocument.config.moderation.filters.nsfw_filter.disabled_channel_ids.indexOf(msg.channel.id)==-1, start, url => {
        	if(url==403) {
        		msg.channel.createMessage("Looks like we've hit the daily Google Image Search API rate limit, folks! Sorry about that."); // TODO: link to wiki here
    		} else if(url) {
    			msg.channel.createMessage(url);
        	} else {
	            winston.warn("No images found for '" + suffix + "'", {svrid: msg.guild.id, chid: msg.channel.id, usrid: msg.author.id});
	            msg.channel.createMessage("Couldn't find anything, sorry 😧");
	        }
        });
	} else {
        winston.warn("Parameters not provided for " + commandData.name + " command", {svrid: msg.guild.id, chid: msg.channel.id, usrid: msg.author.id});
        msg.channel.createMessage(msg.author.mention + " I don't know what image to get... 😯");
    }
};