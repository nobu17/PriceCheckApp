'use strict';

var repository = require("../Common/DynamoRepository");

class UserMasterRepository extends repository.DynamoRepository {
    constructor() {
        super();
    }
    // 監視対象の一覧を取得
    getUserInfo(userId, callback) {
        // groupIdはインデックスを振らないと使えないので現在は未使用
        var params = {
            "TableName": 'UserMaster',
            "ExpressionAttributeNames": { '#u': 'UserId' },
            "ExpressionAttributeValues": { ':val': userId },
            "KeyConditionExpression": '#u = :val'//検索対象が満たすべき条件を指定
        };
        this.query(params, (err, data) => {
            callback(err, data.Items);
        });
    }
}

module.exports.UserMasterRepository = UserMasterRepository;