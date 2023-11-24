const Table = require('cli-table');

// Khởi tạo bảng
const table = new Table({
  head: ["name", "age", "city"],
  colWidths: [20, 20, 20] // Độ rộng của từng cột
});

// Thêm dữ liệu vào bảng
table.push(["John", 30, "New York"]);
table.push(["Alice", 25, "Los Angeles"]);
table.push(["Bob", 35, "Chicago"]);

// In bảng
console.log(table.toString());
