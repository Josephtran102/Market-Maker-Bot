require('dotenv').config(); // Load biến môi trường từ file .env
const Web3 = require('web3');

const web3 = new Web3('https://goerli.infura.io/v3/' + process.env.INFURA_API_KEY);

const fromAddress = process.env.FROM_ADDRESS;
const privateKey = process.env.PRIVATE_KEY;
const toAddress = process.env.TO_ADDRESS;

const transferAmount = web3.utils.toWei('0.001', 'ether');
const gasPrice = web3.utils.toWei('20', 'gwei');
const gasLimit = 21000;

const txObject = {
  from: fromAddress,
  to: toAddress,
  value: transferAmount,
  gasPrice: gasPrice,
  gas: gasLimit
};
console.log(`Đã gửi ${web3.utils.fromWei(transferAmount, 'ether')} ETH từ địa chỉ ${fromAddress} đến địa chỉ ${toAddress}`);

web3.eth.accounts.signTransaction(txObject, privateKey)
  .then(signedTx => {
    return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  })
  .then(receipt => {
    console.log('Transaction hash:', receipt.transactionHash);
    console.log('Transaction receipt:', receipt);
  })
  .catch(err => {
    console.error('Error:', err);
  });
