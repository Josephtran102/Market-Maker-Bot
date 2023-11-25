const { ethers } = require('ethers');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const privateKey = process.env.PRIVATE_KEY;
const fromAddress = process.env.FROM_ADDRESS;
const toAddress = process.env.TO_ADDRESS;
const contractAddress = process.env.CONTRACT_ADDRESS;

// Sử dụng InfuraProvider với WebSocket thay vì InfuraWebSocketProvider
const provider = new ethers.providers.JsonRpcProvider(`https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`);
const wallet = new ethers.Wallet(privateKey, provider);

const abi = JSON.parse(process.env.CONTRACT_ABI); // Thay thế với ABI của hợp đồng Wom token
const womTokenContract = new ethers.Contract(contractAddress, abi, wallet);

// Function để chuyển Wom tới một địa chỉ khác
async function transferWom(amount, to) {
  try {
    const tx = await womTokenContract.transfer(to, amount);
    const receipt = await tx.wait();
    console.log('Transfer Transaction Receipt:', receipt);
  } catch (error) {
    console.error('Error during transfer:', error.message);
  }
}

// Lắng nghe sự kiện chuyển Wom token đến địa chỉ được giám sát
const filter = womTokenContract.filters.Transfer(fromAddress, null, null);
womTokenContract.on(filter, async (from, to, amount, event) => {
  if (to.toLowerCase() === fromAddress.toLowerCase()) {
    // Wom token nhận được tại địa chỉ được giám sát, chuyển nó tới địa chỉ đích
    const balance = await womTokenContract.balanceOf(fromAddress);
    if (balance.gt(0)) {
      // Chuyển toàn bộ Wom tới địa chỉ chỉ định
      await transferWom(balance, toAddress);
      console.log(`Transferred ${balance} Wom from ${fromAddress} to ${toAddress}`);
      console.log('Private Key:', privateKey);
      console.log('Wallet Address:', wallet.address);
    }
  }
});

console.log('Đang lắng nghe sự kiện chuyển Wom token...');
