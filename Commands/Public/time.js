const moment = require("moment-timezone");
const fetch = require("node-fetch");

module.exports = (bot, db, config, winston, userDocument, serverDocument, channelDocument, memberDocument, msg, suffix, commandData) => {
	if(suffix) {
		if(suffix.indexOf("<@")==0) {
			var member = bot.memberSearch(suffix, msg.guild);

			if(member) {
				locateUser(member.id, location => {
					getTime(location || suffix, member);
				});
				return;
			}
		} else if(suffix.indexOf("in ")==0) {
			suffix = suffix.slice(3);
		}
		getTime(suffix);
	} else {
		locateUser(msg.author.id, location => {
			getTime(location, msg.member);
		});
	}

  async function getTime(location, member) {
    if (location) {
      try {
        var geopath = 'http://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(location)
        var geocode = await fetch(geopath).then(res => res.json())
        var tzpath = `https://maps.googleapis.com/maps/api/timezone/json?location=${geocode.results[0].geometry.location.lat},${geocode.results[0].geometry.location.lng}&timestamp=0&sensor=false`
        var timezone = (await fetch(tzpath).then(res => res.json())).timeZoneId

        msg.channel.createMessage(`🕐 It's ${moment.tz(Date.now(), timezone).format(config.moment_date_format)} ${member ? `for @${bot.getName(msg.guild, serverDocument, member)}` : `in ${timezone}`}`)
      } catch (err) {
        msg.channel.createMessage(msg.author.mention + " A little birdie told me that place doesn't exist 😉");
      }

    } else {
      winston.warn("Parameters not provided for '" + commandData.name + "' command", {svrid: msg.guild.id, chid: msg.channel.id, usrid: msg.author.id});
      msg.channel.createMessage(msg.author.mention + " I don't have a default location set for you. PM me `profile location|<your city>` to set one ⌚️");
    }
  }

	function locateUser(usrid, callback) {
		db.users.findOne({_id: usrid}, (err, userDocument) => {
			if(!err && userDocument && userDocument.location) {
				callback(userDocument.location);
			} else {
				callback();
			}
		});
	}
};