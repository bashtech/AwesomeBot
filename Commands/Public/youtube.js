const youtube = require("youtube-node");
const auth = require("./../../Configuration/auth.json");

module.exports = (bot, db, config, winston, userDocument, serverDocument, channelDocument, memberDocument, msg, suffix, commandData) => {
	if(suffix) {
		var query = suffix.substring(0, suffix.lastIndexOf(" "));
        var num = suffix.substring(suffix.lastIndexOf(" ")+1);

        if(!query || isNaN(num)) {
            query = suffix;
            num = 1;
        }
        if(num<1 || num>serverDocument.config.command_fetch_properties.max_count) {
            num = 1;
        } else {
            num = parseInt(num);
        }

		var yt = new youtube();
		yt.setKey(serverDocument.config.custom_api_keys.google_api_key || auth.tokens.google_api_key);
		yt.search(query, num, (err, res) => {
			if(err) {
				winston.warn("No YouTube results found for '" + query + "'", {svrid: msg.guild.id, chid: msg.channel.id, usrid: msg.author.id});
				msg.channel.createMessage("📺 Nothing found on YouTube");
			} else {
				bot.sendArray(msg.channel, res.items.map(getUrl));
			}
		});

		function getUrl(item) {
			switch(item.id.kind) {
                case "youtube#playlist":
                    return "http://www.youtube.com/playlist?list=" + item.id.playlistId;
                case "youtube#video":
                    return "http://www.youtube.com/watch?v=" + item.id.videoId;
                case "youtube#channel":
                    return "http://www.youtube.com/channel/" + item.id.channelId;
            }
		}
	} else {
		winston.warn("Parameters not provided for '" + commandData.name + "' command", {svrid: msg.guild.id, chid: msg.channel.id, usrid: msg.author.id});
		msg.channel.createMessage(msg.author.mention + " Please include a query and (optional) number of results to show 💁‍♂️");
	}
};