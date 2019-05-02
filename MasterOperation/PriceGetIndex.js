'use strict';

var service = require("./PriceGet/AmazonProductService");

exports.handler = function (event, context, callback) {

    context.callbackWaitsForEmptyEventLoop = false;

    var aServ = new service.AmazonProductService();
    var input = {
        "method": event.method,
        "itemIdList": event.itemIdList
    };
    if (input.method == "priceGet") {
        aServ.itemLookup(input, (err, data) => {
            if (err) {
                callback(err, data);
            } else {
                callback(null, data);
            }
        });
    } else if (input.method == "itemInfoGet") {
        aServ.itemInfoGet(input, (err, data) => {
            if (err) {
                callback(err, data);
            } else {
                callback(null, data);
            }
        });
    } else {
        callback(new Error("no method param"), null);
    }


};  