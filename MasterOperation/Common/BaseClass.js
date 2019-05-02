"use strict";

var logger = require("./Logger");

class BaseClass {
    constructor() {
        this.logger = new logger.Logger();
    }

    info(message) {
        this.logger.info(message);
    }

    warn(message) {
        this.logger.warn(message);
    }

    error(message, err = null) {
        this.logger.error(message, err);
    }
}

module.exports.BaseClass = BaseClass;