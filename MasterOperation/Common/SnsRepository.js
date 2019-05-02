'use strict';

var AWS = require('aws-sdk');
var BaseC = require("./BaseClass");

class SnsRepositpry extends BaseC.BaseClass {
    constructor() {
        super();
        this.init();
    }

    init() {
        try {
            //設定の読み込み
            var fs = require('fs');
            var json = JSON.parse(fs.readFileSync('./config.json', 'utf8').trim());

            this.sns = new AWS.SNS({ region: json.region });

        } catch (e) {
            this.error("init fail", e);
        }
    }

    sendNotify(title, message, arn, callback) {
        const param = {
            Message: message,
            Subject: title,
            TopicArn: arn
        };
        this.sns.publish(param, (err,data) => {
            if (err) {
                this.error("send sns is fail", err);
                callback(err, data);
            } else {
                this.info("send sns is success");
                callback(err, data);
            }
        }); 
    }
}

module.exports.SnsRepositpry = SnsRepositpry;