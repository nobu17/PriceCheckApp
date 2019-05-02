'use strict';

var iRepository = require("./ItemAlertLogRepository");
var apiRes = require("../Common/ApiResultBase");
var BaseC = require("../Common/BaseClass");

class ItemAlertLogService extends BaseC.BaseClass {

    constructor() {
        super();
        this.repository = new iRepository.ItemAlertLogRepository();
    }
    //指定日付以降のアラート一覧を取得します
    getAlertedList(input, callback) {
        if (!input.userId) {
            let errmsg = "userId is not defined";
            this.error(errmsg);
            callback(new Error(errmsg), null);
        } else if (!input.lastAlertDate) {
            let errmsg = "lastAlertDate is not defined";
            this.error(errmsg);
            callback(new Error(errmsg), null);
        }

        this.repository.getAlertedList(input.userId, input.lastAlertDate, (err, res) => {
            var aRes = new apiRes.ApiResultBase();
            if (err) {
                aRes.setIsSuccess(false);
                callback(err, res);
            } else {
                aRes.setIsSuccess(true);
                aRes.setData(res);
                callback(null, aRes);
            }
        });
    }

    putAlertLog(input, callback) {
        if (!input.userId) {
            let errmsg = "userId is not defined";
            this.error(errmsg);
            callback(new Error(errmsg), null);
        } else if (!input.lastAlertDate) {
            let errmsg = "lastAlertDate is not defined";
            this.error(errmsg);
            callback(new Error(errmsg), null);
        } else if (!input.itemId) {
            let errmsg = "itemId is not defined";
            this.error(errmsg);
            callback(new Error(errmsg), null);
        } else if (!input.price) {
            let errmsg = "price is not defined";
            this.error(errmsg);
            callback(new Error(errmsg), null);
        }

        this.repository.putAlertLog(input.userId, input.lastAlertDate, input.itemId, input.price, (err, res) => {
            var aRes = new apiRes.ApiResultBase();
            if (err) {
                aRes.setIsSuccess(false);
                callback(err, res);
            } else {
                aRes.setIsSuccess(true);
                aRes.setData(res);
                callback(null, aRes);
            }
        });

    }

    // アラート
    putAlertLogList(input, callback) {
        if (!input.userId) {
            let errmsg = "userId is not defined";
            this.error(errmsg);
            callback(new Error(errmsg), null);
        } else if (!input.lastAlertDate) {
            let errmsg = "lastAlertDate is not defined";
            this.error(errmsg);
            callback(new Error(errmsg), null);
        } else if (!input.itemIdAndPriceList) {
            let errmsg = "itemIdAndPriceList is not defined";
            this.error(errmsg);
            callback(new Error(errmsg), null);
        }

        this.repository.putAlertLogList(input.userId, input.lastAlertDate, input.itemIdAndPriceList, (err, res) => {
            var aRes = new apiRes.ApiResultBase();
            if (err) {
                aRes.setIsSuccess(false);
                callback(err, null);
            } else {
                aRes.setIsSuccess(true);
                aRes.setData(res);
                callback(null, aRes);
            }
        });
    }
}

module.exports.ItemAlertLogService = ItemAlertLogService;