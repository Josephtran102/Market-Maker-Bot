# Hướng dẫn chạy đoạn code gửi token sử dụng ethers.js

Đây là hướng dẫn cài đặt và chạy đoạn mã JavaScript sử dụng thư viện ethers.js để gửi token trên blockchain Ethereum.

## Bước 1: Chuẩn bị môi trường

1. Cài đặt [Node.js](https://nodejs.org/) nếu chưa có.
2. Clone dự án từ GitHub hoặc tạo thư mục mới và tạo file JavaScript (ví dụ: `send.js`).
3. Mở terminal và di chuyển đến thư mục dự án của bạn.

## Bước 2: Cài đặt thư viện

Chạy lệnh sau để cài đặt các thư viện cần thiết:

npm init -y
npm install ethers dotenv


## Bước 3: Cấu hình .env file
Tạo một file có tên .env trong thư mục dự án và cung cấp các biến môi trường như sau:

PRIVATE_KEY=your_private_key
FROM_ADDRESS=your_from_address
TO_ADDRESS=your_to_address
CONTRACT_ADDRESS=your_contract_address
INFURA_API_KEY=your_infura_api_key
CONTRACT_ABI=your_contract_abi

## Bước 4: Chạy đoạn code
Mở terminal và chạy lệnh sau để thực hiện gửi token:
node send.js




# Web3tool
