require('dotenv').config();
const Web3 = require('web3');

// Khởi tạo provider từ Infura và Web3
const provider = new Web3.providers.HttpProvider(`https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`);
const web3 = new Web3(provider);

// Lấy thông tin từ file .env
const privateKey = process.env.PRIVATE_KEY;
const walletAddress = process.env.WALLET_ADDRESS;

// Contract Addresses
const wethAddress = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6';
const usdcAddress = '0x07865c6E87B9F70255377e024ace6630C1Eaa37F';
const routerAddress = '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD';

// Tạo một hàm để thực hiện swap
async function swapTokens() {
  const amountIn = web3.utils.toWei('0.001', 'ether'); // 0.001 WETH

  const path = [wethAddress, usdcAddress];
  const to = walletAddress;
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now

  const nonce = await web3.eth.getTransactionCount(walletAddress);
  const data = web3.eth.abi.encodeFunctionCall({
    name: 'execute',
    type: 'function',
    inputs: [
      { type: 'bytes', name: 'data' },
      { type: 'bytes[]', name: 'dataArr' },
      { type: 'uint256', name: 'deadLine' }
    ],
  }, [
    '0x',
    [
      web3.eth.abi.encodeParameters(['address', 'address[]', 'uint256[]', 'uint256[]', 'bytes'], [
        walletAddress,
        path,
        [amountIn, '0'],
        [deadline, nonce],
        '0x',
      ]),
    ],
    '0',
  ]);

  const signedTx = await web3.eth.accounts.signTransaction(
    {
      to: routerAddress,
      data: data,
      gas: 300000, // You may need to adjust the gas value
      nonce: nonce,
    },
    privateKey
  );

  const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log('Transaction Hash:', txReceipt.transactionHash);
}

// Gọi hàm swapTokens để thực hiện swap
swapTokens().catch((err) => console.error(err));
