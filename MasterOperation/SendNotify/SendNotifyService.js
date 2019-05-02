'use strict';

var apiRes = require("../Common/ApiResultBase");
var BaseC = require("../Common/BaseClass");
var sRepository = require("./SendNotifyRepository");
var dFormatter = require("../Common/DateFormatter");

class SendNotifyService extends BaseC.BaseClass {
    constructor() {
        super();
        this.repository = new sRepository.SendNotifyRepository();
    }

    async sendNotify(input, callback) {

        if (!input.userId) {
            let msg = "userId is undefined:" + JSON.stringify(input);
            this.error(msg);
            callback(new Error(msg), null);
        }
        if (!input.arn) {
            let msg = "arn is undefined:" + JSON.stringify(input);
            this.error(msg);
            callback(new Error(msg), null);
        }
        if (!input.notifyInfoList) {
            let msg = "notifyInfoList is undefined:" + JSON.stringify(input);
            this.error(msg);
            callback(new Error(msg), null);
        }

        if (input.notifyInfoList.length <= 0) {
            let msg = "notifyInfoList is empty:" + JSON.stringify(input);
            this.error(msg);
            callback(new Error(msg), null);
        }
        //送信用のメッセージを作成
        var msg = this.makeMessage(input.notifyInfoList);

        try {
            //通知
            await this.sendNotifyRaw("通知", msg, input.arn);
            //送付後にアラートログをを更新
            await this.putAlertLog(input.userId, input.notifyInfoList);

            let aRes = new apiRes.ApiResultBase();
            aRes.setIsSuccess(true);
            callback(null, aRes);

        } catch (e) {
            let aRes = new apiRes.ApiResultBase();
            aRes.setIsSuccess(false);
            this.error("通知失敗:" + JSON.stringify(e));
            callback(e, aRes);
        }

    }
    // 通知リストからメッセージを送付
    makeMessage(notifyList) {
        var msg = "指定値よりも安くなりました。\n\n";

        notifyList.forEach((item) => {
            var tMsg = "商品名:" + item.itemName + "\n";
            tMsg = tMsg + "現在価格:" + item.price + " 円\n";
            tMsg = tMsg + "設定価格:" + item.threshold + " 円\n";
            tMsg = tMsg + "URL:" + "https://www.amazon.co.jp/dp/" + item.itemId;
            msg = msg + tMsg + "\n\n\n";
        });

        return msg;
    }

    async putAlertLog(userId, notifyList) {
        return new Promise((resolve, reject) => {
            var itemList = notifyList.map((item) => {
                return {
                    itemId: item.itemId,
                    price: item.price
                }
            });
            var nowStr = dFormatter.DateFormatter.formatDateToString(new Date(), "yyyyMMdd");
            this.repository.putAlertLog(userId, nowStr, itemList, (err, res) => {
                if (err) {
                    reject(err);
                } else if (res.isSuccess) {
                    resolve(res.data);
                } else {
                    reject(new Error("putAlertLog is fail"));
                }
            });
        });
    }

    // 通知を送付
    sendNotifyRaw(title, message, arn) {
        return new Promise((resolve, reject) => {
            if (!title) {
                reject(new Error("title is error"));
            }
            if (!message) {
                reject(new Error("message is error"));
            }
            if (!arn) {
                reject(new Error("arn is error"));
            }

            this.repository.sendNotify(title, message, arn, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });

    }
}

module.exports.SendNotifyService = SendNotifyService;