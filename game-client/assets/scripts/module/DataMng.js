var gDataDict = {};
var exp = module.exports;

exp.getUserID = function() {
	return gDataDict.userID;
};

exp.setUserID = function(uid) {
	gDataDict.userID = uid;
};