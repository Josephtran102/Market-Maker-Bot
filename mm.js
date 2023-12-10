const ethers = require('ethers');
require("dotenv").config();

const wethAddress = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'; // goerli weth
//const wethAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'; // mainnet weth
// const uniAddress = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'; // UNI
const routerAddress = '0xE592427A0AEce92De3Edee1F18E0157C05861564'; // Uniswap Router mainnet: 0xeC8B0F7Ffe3ae75d7FfAb09429e3675bb63503e4
// const quoterAddress = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'; // Uniswap Quoter
const tokenAddress = '0x07865c6e87b9f70255377e024ace6630c1eaa37f'; // goerli USDC - USDT: 0xC2C527C0CACF457746Bd31B2a698Fe89de2b6d49
const fee = 500; // Uniswap pool fee bps 500, 3000, 10000
const buyAmount = ethers.utils.parseUnits('0.00000279148', 'ether');
const targetPrice = BigInt(100); // target exchange rate: *với 0.0000045 
const targetAmountOut = BigInt(buyAmount) * BigInt(targetPrice);
const sellAmount = BigInt(buyAmount) / BigInt(targetPrice);
const tradeFrequency = 3600 * 1000; // ms (once per hour) đơn vị mili giây

// `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`
const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_NODE_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
const account = wallet.connect(provider);

const token = new ethers.Contract(
  tokenAddress,
  [
    'function approve(address spender, uint256 amount) external returns (bool)',
    'function allowance(address owner, address spender) public view returns (uint256)',
  ],
  account
);

const router = new ethers.Contract(
  routerAddress,
  ['function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountOut)'],
  account
);

// const quoter = new ethers.Contract(
//   quoterAddress,
//   ['function quoteExactInputSingle(address tokenIn, address tokenOut, uint24 fee, uint256 amountIn, uint160 sqrtPriceLimitX96) public view returns (uint256 amountOut)'],
//   account
// );

const buyTokens = async () => {
  console.log('Buying Tokens')
  const deadline = Math.floor(Date.now() / 1000) + 600; // Cộng thêm 10 phút tính thời điệm hiện tại
  const tx = await router.exactInputSingle([wethAddress, tokenAddress, fee, wallet.address, deadline, buyAmount, 0, 0], {value: buyAmount});
  await tx.wait();
  console.log(tx.hash);
}

const sellTokens = async () => {
  console.log('Selling Tokens')
  const allowance = await token.allowance(wallet.address, routerAddress);
  console.log(`Current allowance: ${allowance}`);
  if (allowance < sellAmount) {
    console.log('Approving Spend (bulk approve in production)');
    const atx = await token.approve(routerAddress, sellAmount);
    await atx.wait();
  }
  const deadline = Math.floor(Date.now() / 1000) + 600;
  const tx = await router.exactInputSingle([tokenAddress, wethAddress, fee, wallet.address, deadline, sellAmount, 0, 0]);
  await tx.wait();
  console.log(tx.hash);
}

const checkPrice = async () => {
  const amountOut = await quoter.quoteExactInputSingle(wethAddress, tokenAddress, fee, buyAmount, 0);
  console.log(`Current Exchange Rate: ${amountOut.toString()}`);
  console.log(`Target Exchange Rate: ${targetAmountOut.toString()}`);
  if (amountOut < targetAmountOut) buyTokens();
  if (amountOut > targetAmountOut) sellTokens();
}

checkPrice();
setInterval(() => {
  checkPrice();
}, tradeFrequency);
