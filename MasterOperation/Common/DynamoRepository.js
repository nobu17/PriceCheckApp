'use strict';

var AWS = require('aws-sdk');
var BaseC = require("./BaseClass");

// DynamoDB
class DynamoRepository extends BaseC.BaseClass {

    constructor() {
        super();
        this.batchRetryCount = 2;
        this.retryTimeSpanMillSec = 500;
        this.currentRetryCount = 0;
        this.init();
    }
    //初期化
    init() {
        try {
            //設定の読み込み
            var fs = require('fs');
            var json = JSON.parse(fs.readFileSync('./config.json', 'utf8').trim());
            //var filePath = path.resolve(process.env.LAMBDA_TASK_ROOT, '', process.env.AWS_LAMBDA_FUNCTION_NAME, './aws_config.json')
            //var json = JSON.parse(fs.readFileSync(filePath, 'utf8').trim());

            this.docClient = new AWS.DynamoDB.DocumentClient({ region: json.region });

        } catch (e) {
            this.error("init fail", e);
        }
    }
    // get
    get(params, callback) {
        this.docClient.get(params,(err, data) => {
            if (err) {
                this.error("get fail", err);
                callback(err, null);
            } else {
                super.info("get success");
                this.info(JSON.stringify(data));
                callback(null, data);
            }
        });
    }

    //put
    put(params, callback) {
        this.docClient.put(params,(err, data) => {
            if (err) {
                this.error("put fail", err);
                callback(err, null);
            } else {
                this.info("put success");
                this.info(JSON.stringify(data));
                callback(null, data);
            }
        });
    }
    //update
    update(params, callback) {
        this.docClient.update(params, (err, data) => {
            if (err) {
                this.error("update fail", err);
                callback(err, null);
            } else {
                this.info("update success");
                this.info(JSON.stringify(data));
                callback(null, data);
            }
        });
    }

    //delete
    delete(params, callback) {
        this.docClient.delete(params,(err, data) => {
            if (err) {
                this.error("delete fail", err);
                callback(err, null);
            } else {
                this.info("delete success");
                this.info(JSON.stringify(data));
                callback(null, data);
            }
        });
    }

    //query
    query(params, callback) {
        this.docClient.query(params,(err, data) => {
            if (err) {
                this.error("query fail", err);
                this.error("params=" + params);
                callback(err, null);
            } else {
                this.info("query success");
                this.info(JSON.stringify(data));
                callback(null, data);
            }
        });
    }

    
    //batchWrite
    batchWrite(params, callback) {
        this.docClient.batchWrite(params, (err, data) => {
            if (err) {
                this.error("batchWrite fail", err);
                this.error("params=" + params);
                this.currentRetryCount = 0;
                callback(err, null);
            } else {
                this.info("batchWrite success");
                this.info(JSON.stringify(data));
                let itemsLost = data.UnprocessedItems;
                if (itemsLost.constructor === Object && Object.keys(itemsLost).length === 0) {
                    this.info("no fail items exit");
                    this.currentRetryCount = 0;
                    callback(null, data);
                } else {
                    // リトライ
                    if (this.currentRetryCount <= this.batchRetryCount) {
                        this.currentRetryCount = this.currentRetryCount + 1;
                        this.info("some items are failed. retrying");
                        setTimeout(() => {
                            let params = {};
                            params.RequestItems = itemsLost;
                            this.batchWrite(params, callback);
                        }, this.retryTimeSpanMillSec);
                    } else {
                        this.info("retry over");
                        callback(new Error("Retry is over"), null);
                    }
                }
            }
        });
    }
}

module.exports.DynamoRepository = DynamoRepository;