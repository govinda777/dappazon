const { ethers } = require("hardhat");

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

    /**
     * Executa uma função que retorna uma Promise (como uma chamada de método de contrato) e retorna os eventos emitidos.
     *
     * @param {Function} promiseFunction - Uma função que retorna uma Promise.
     * @param {string} [eventName] - O nome do evento a ser retornado. Se não for fornecido, todos os eventos serão retornados.
     * @returns {Promise<Array|Object>} Uma Promise que resolve para o evento especificado, ou todos os eventos se nenhum nome de evento for fornecido.
     *
     * @example
     * const ProductUpdated = await util.safExecution(() => product.update(1, productDataUpdate), 'ProductUpdated');
     */
    static async safExecution(promiseFunction, eventName) {
        const tx = await promiseFunction();
        const receipt = await tx.wait();
    
        return eventName ? util.getEvents(receipt, eventName) : receipt.events;
    }
}

module.exports = util;