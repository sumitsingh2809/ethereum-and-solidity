require('dotenv').config();
const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');

const { abi, evm } = require('./compile');
const { MNEMONIC_PHRASE, PROVIDER_OR_URL } = process.env;

const provider = new HDWalletProvider(MNEMONIC_PHRASE, PROVIDER_OR_URL);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(abi)
        .deploy({ data: evm.bytecode.object, arguments: ['Hi there!'] })
        .send({ gas: '1000000', from: accounts[0] });

    console.log('Contract deployed to', result.options.address);
    provider.engine.stop();
};

deploy();
