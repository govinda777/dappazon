const { ethers } = require("ethers");

class util {

    static isGreaterThan(bn1, bn2) {
        return ethers.BigNumber.from(bn1).gt(ethers.BigNumber.from(bn2));
    }

    static getEvents(receipt, eventName) {
        return receipt.events.find(event => event.event === eventName);
    }

    static tokens(n) {
        return ethers.utils.parseUnits(n.toString(), 'ether');
    }
}

module.exports = util;