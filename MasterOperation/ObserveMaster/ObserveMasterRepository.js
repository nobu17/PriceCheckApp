'use strict';

var repository = require("../Common/DynamoRepository");

class ObserveMasterRepository extends repository.DynamoRepository {
    constructor() {
        super();
    }
    // 監視対象の一覧を取得
    getObserveTargetList(userId, groupId, callback) {
        this.getObservMasterTable(userId, groupId, (err, data) => {
            if(!err) {
                callback(err, data.Items);
            } else {
                callback(err, null);
            }
        });
    }
    // ユーザIDに紐づくグループID一覧取得
    getGroupIdList(userId, callback) {
        this.getSpecifyGroupId(userId, (err, data) => {
            if (!err) {
                //groupIDののみを取り出す
                var m = [];
                data.Items.forEach((item) => {
                    if (m.indexOf(item.GroupId) == -1) {
                        m.push(item.GroupId)
                    }
                });

                var res = {
                    "userId": userId,
                    "groupIdList": m
                }

                callback(err, res);
            } else {
                callback(err, null);
            }
        });
    }

    // アイテムの登録
    putObserveItem(userId, itemId, addDate, groupId, itemName, threshold, callback) {
        const params = {
            "TableName": 'ObserveMaster',
            "Item": {
                "UserId": userId,
                "ItemId": itemId,
                "AddDate": addDate,
                "GroupId": groupId,
                "ItemName": itemName,
                "Threshold": threshold
            }
        };
        this.put(params, (err, res) => {
            callback(err, res);
        });
    }

    getObservMasterTable(userId, groupId, callback) {
        var params = {
            "TableName": 'ObserveMaster',
            "ExpressionAttributeNames": { '#u': 'UserId', '#g': 'GroupId' },
            "ExpressionAttributeValues": { ':val': userId, ':gval': groupId },
            "KeyConditionExpression": '#u = :val',//検索対象が満たすべき条件を指定
            "FilterExpression":'#g = :gval'//主キー以外
        };
        this.query(params, (err, res) => {
            callback(err, res);
        });
    }

    getSpecifyGroupId(userId, callback) {
        var params = {
            "TableName": 'ObserveMaster',
            "ProjectionExpression": "#u, GroupId",//選択するのは主キーとGroupIDのみ
            "ExpressionAttributeNames": { '#u': 'UserId' },
            "ExpressionAttributeValues": { ':val': userId },
            "KeyConditionExpression": '#u = :val',//検索対象が満たすべき条件を指定           
        };
        this.query(params, (err, res) => {
            callback(err, res);
        });
    }
}

module.exports.ObserveMasterRepository = ObserveMasterRepository;