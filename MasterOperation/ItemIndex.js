'use strict';

var service = require("./Item/ItemService");

exports.handler = function (event, context, callback) {

    context.callbackWaitsForEmptyEventLoop = false;

    var oServ = new service.ItemService();

    if (event.method == "putMaster") {
        let input = {
            "userId": event.userId,
            "groupId": event.groupId,
            "itemId": event.itemId,
            "threshold": event.threshold
        };
        oServ.addObserveItem(input, callback);
    } else {
        callback(new Error("no method param"), null);
    }

};  