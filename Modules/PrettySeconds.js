// Format a number of seconds nicely
module.exports = seconds => {
    var numyears = Math.floor(seconds / 31536000);
    var numdays = Math.floor((seconds % 31536000) / 86400);
    var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    var numseconds = Math.round((((seconds % 31536000) % 86400) % 3600) % 60);

    var str = "";
    if(numyears>0) {
        str += numyears + " year" + (numyears==1 ? "" : "s") + " ";
    }
    if(numdays>0) {
        str += numdays + " day" + (numdays==1 ? "" : "s") + " ";
    }
    if(numhours>0) {
        str += numhours + " hour" + (numhours==1 ? "" : "s") + " ";
    }
    if(numminutes>0) {
        str += numminutes + " minute" + (numminutes==1 ? "" : "s") + " ";
    }
    if(numseconds>0) {
        str += numseconds + " second" + (numseconds==1 ? "" : "s") + " ";
    }
    return str;
}