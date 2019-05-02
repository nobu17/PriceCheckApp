'use strict';

var uRepository = require("./UserMasterRepository");
var apiRes = require("../Common/ApiResultBase");
var BaseC = require("../Common/BaseClass");


class UserMasterService extends BaseC.BaseClass {

    constructor() {
        super();
        this.repository = new uRepository.UserMasterRepository();
    }

    getUserInfo(input, callback) {
        if (!input) {
            let msg = "input is undefined";
            this.error(msg);
            callback(new Error(msg), null);
        }
        if (!input.userId) {
            let msg = "userId is undefined";
            this.error(msg);
            this.error(JSON.stringify(input));
            callback(new Error(msg), null);
        }

        this.repository.getUserInfo(input.userId, (err, res) => {
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

module.exports.UserMasterService = UserMasterService;