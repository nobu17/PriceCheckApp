'use strict';

const AWS = require('aws-sdk');
const BaseC = require("./BaseClass");
//const path = require('path');
//Lambda 呼び出し
class LambdaRepository extends BaseC.BaseClass {
    constructor() {
        super();
        this.init();
    }

    init() {
        try {
            //configから設定読み込み
            var fs = require('fs');
            var json = JSON.parse(fs.readFileSync('./config.json', 'utf8').trim());
            //var filePath = path.resolve(process.env.LAMBDA_TASK_ROOT, '', process.env.AWS_LAMBDA_FUNCTION_NAME, './aws_config.json')
            //var json = JSON.parse(fs.readFileSync(filePath, 'utf8').trim());
            // 設定の取得
            this.region = json.region;
        } catch (e) {
            this.error("init fail", e);
        }
    }
    // LambdaからLambda呼び出し
    callLambdaWithinLambda(inputObj, funcName, callback) {

        var lambda = new AWS.Lambda({
            region: this.region
        });
        var params = {
            FunctionName: funcName, // the lambda function we are going to invoke
            InvocationType: 'RequestResponse',
            LogType: 'Tail',
            Payload: JSON.stringify(inputObj)
        };

        lambda.invoke(params, (error, data) => {
            if (error) {
                this.error(funcName + " is call failed.", error);
                callback(error, null);
            } else {
                this.info(funcName + " is success.");
                callback(null, JSON.parse(data.Payload));
            }
        });
    }
}

module.exports.LambdaRepository = LambdaRepository;