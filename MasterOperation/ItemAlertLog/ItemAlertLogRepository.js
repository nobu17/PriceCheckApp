'use strict';

var repository = require("../Common/DynamoRepository");

class ItemAlertLogRepository extends repository.DynamoRepository {
    constructor() {
        super();
        this.tableName = "ItemAlertLog";
    }
    //指定したユーザIDの指定した日付以降のアラート一覧を取得
    getAlertedList(userId, lastAlertDate, callback) {
        var params = {
            "TableName": this.tableName,
            "ExpressionAttributeNames": { '#u': 'UserId', '#t': 'LastAlertDate' },
            "ExpressionAttributeValues": { ':val': userId, ':tval': lastAlertDate },
            "KeyConditionExpression": '#u = :val and #t >= :tval'//userIdが一致して指定日付以降
        };
        this.query(params, (err, data) => {
            var res = null;
            if (!err) {
                res = data.Items;
            }
            callback(err, res);
        });
    }

    putAlertLog(userId, lastAlertDate, itemId, price, callback) {
        const params = {
            TableName: this.tableName,
            Item: {
                'UserId': userId,
                'LastAlertDate': lastAlertDate,
                "ItemId":  itemId,
                "Price": price
            }
        };

        this.put(params, (err, res) => {
            callback(err, res);
        });
    }

    // アラート
    putAlertLogList(userId, lastAlertDate, itemIdAndPriceList, callback) {

        var requestArry = [];
        itemIdAndPriceList.forEach((item) => {

            var obj = {
                'UserId': userId,
                'LastAlertDate': lastAlertDate,
                "ItemId": item.itemId,
                "Price": item.price
            }

            var requestObj = {
                PutRequest: {
                    Item: obj //PutRequest > Item の階層にオブジェクトを一つずつ入れていく
                }
            };
            requestArry.push(requestObj);
        });

        var params = {           
            RequestItems: {
                ItemAlertLog: requestArry
            }
        };

        this.batchWrite(params, callback);
    }
}

module.exports.ItemAlertLogRepository = ItemAlertLogRepository;