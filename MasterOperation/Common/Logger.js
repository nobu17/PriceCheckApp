/* eslint no-console: 0 */
"use strict";
class Logger {

    info(message) {
        console.log("info:" + message);
    }

    warn(message) {
        console.log("warn:" + message);
    }

    error(message, err = null) {
        console.log("error:" + message);

        if (err)
            console.log(JSON.stringify(err));
    }
}

module.exports.Logger = Logger;