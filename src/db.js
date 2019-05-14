
'use strict';



class Database {
    constructor({ logger = () => {}, connUri } = {}) {
        Object.assign(this, { logger, connUri });
    }

    async init() {
        return;
    }
}

module.exports = Database;
