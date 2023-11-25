const { ethers } = require('ethers');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

async function sendToken() {
  try {
    const privateKey = process.env.PRIVATE_KEY;
    const fromAddress = process.env.FROM_ADDRESS;
    const toAddress = process.env.TO_ADDRESS;
    const contractAddress = process.env.CONTRACT_ADDRESS;

    const provider = new ethers.providers.JsonRpcProvider(`https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`);
    const wallet = new ethers.Wallet(privateKey, provider);

    const abi = JSON.parse(process.env.CONTRACT_ABI);
    const womTokenContract = new ethers.Contract(contractAddress, abi, wallet);

    // Số lượng token muốn gửi (20,000 Wom)
    const amountToSend = ethers.utils.parseUnits('1', 'ether'); // Thay đổi số lượng token chuyển đi

    // Kiểm tra số dư để đảm bảo đủ token để gửi
    const balance = await womTokenContract.balanceOf(fromAddress);
    if (balance.lt(amountToSend)) {
      console.error('Không đủ token để gửi.');
      return;
    }

    // Tăng gasPrice để giao dịch được xử lý nhanh hơn
    const gasPrice = ethers.utils.parseUnits('100', 'gwei'); // Thay đổi giá trị gasPrice theo ý muốn của bạn

    // Gửi token đến địa chỉ đích với gasPrice tăng lên
    const tx = await womTokenContract.transfer(toAddress, amountToSend, { gasPrice });
    const receipt = await tx.wait();
    
    console.log(`Đã gửi ${ethers.utils.formatUnits(amountToSend, 'ether')} Wom từ ${fromAddress} đến ${toAddress}`);
    console.log('Transaction Receipt:', receipt);
  } catch (error) {
    console.error('Lỗi khi gửi token:', error.message);
  }
}

// Gọi hàm để thực hiện gửi token
sendToken();
