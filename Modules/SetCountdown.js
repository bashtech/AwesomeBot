// Set countdown for a server
module.exports = (bot, winston, serverDocument, countdownDocument) => {
	setTimeout(() => {
		var svr = bot.guilds.get(serverDocument._id);
		if(svr) {
			var ch = svr.channels.get(countdownDocument.channel_id);
			if(ch) {
				ch.createMessage("3...2...1...**" + countdownDocument._id + "**");
				countdownDocument.remove();
				winston.info("Countdown '" + countdownDocument._id + "' expired", {svrid: svr.id, chid: ch.id});
				serverDocument.save(err => {
					if(err) {
						winston.info("Failed to save server data for countdown expiry", {svrid: svr.id}, err);
					}
				});
			}
		}
	}, countdownDocument.expiry_timestamp - Date.now());
};