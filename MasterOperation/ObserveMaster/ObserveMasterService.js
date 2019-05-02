'use strict';

var oRepository = require("./ObserveMasterRepository");
var apiRes = require("../Common/ApiResultBase");
var BaseC = require("../Common/BaseClass");

class ObserveMasterService extends BaseC.BaseClass {

    constructor() {
        super();
        this.repository = new oRepository.ObserveMasterRepository();
    }
    // 指定されたuserIDとgroupIdの情報を取得
    getObserveTargetList(input, callback) {

        if (!input.userId) {
            let errmsg = "userId is not defined";
            this.error(errmsg);
            callback(new Error(errmsg), null);
        } else if (!input.groupId) {
            let errmsg = "groupId is not defined";
            this.error(errmsg);
            callback(new Error(errmsg), null);
        }

        this.repository.getObserveTargetList(input.userId, input.groupId, (err, res) => {
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
    //指定されたユーザIDのグループID一覧を取得
    getGroupIdList(input, callback) {
        if (!input.userId) {
            let errmsg = "userId is not defined";
            this.error(errmsg);
            callback(new Error(errmsg), null);
        }

        this.repository.getGroupIdList(input.userId, (err, res) => {
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
    // アイテムの追加
    putObserveItem(input, callback) {
        if (!input.userId) {
            let errmsg = "userId is not defined";
            this.error(errmsg);
            callback(new Error(errmsg), null);
        }
        if (!input.itemId) {
            let errmsg = "itemId is not defined";
            this.error(errmsg);
            callback(new Error(errmsg), null);
        }
        if (!input.addDate || isNaN(input.addDate)) {
            let errmsg = "addDate is not defined";
            this.error(errmsg);
            callback(new Error(errmsg), null);
        }
        if (!input.groupId) {
            let errmsg = "groupId is not defined";
            this.error(errmsg);
            callback(new Error(errmsg), null);
        }
        if (!input.itemName) {
            let errmsg = "itemName is not defined";
            this.error(errmsg);
            callback(new Error(errmsg), null);
        }
        if (!input.threshold || isNaN(input.threshold)) {
            let errmsg = "threshold is not defined";
            this.error(errmsg);
            callback(new Error(errmsg), null);
        }

        this.repository.putObserveItem(input.userId, input.itemId,
            input.addDate, input.groupId, input.itemName,
            input.threshold, (err, res) => {
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

}

module.exports.ObserveMasterService = ObserveMasterService;