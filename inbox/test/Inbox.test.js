const Web3 = require('web3');
const assert = require('assert');
const ganache = require('ganache-cli');
const { interface, bytecode } = require('../compile');

const web3 = new Web3(ganache.provider());

let inbox;
let accounts;
const INITIAL_STRING = 'Hi There!';
beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();

    // use one of those accounts to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface)) // gets method of inbox contract
        .deploy({ data: bytecode, arguments: [INITIAL_STRING] }) // creates object to be deployed on network
        .send({ from: accounts[0], gas: '1000000' }); // triggers transaction
});

describe('Inbox', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address);
    });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, INITIAL_STRING);
    });

    it('can change the message', async () => {
        await inbox.methods.setMessage('bye').send({ from: accounts[0] });
        const message = await inbox.methods.message().call();
        assert.equal(message, 'bye');
    });
});
