/* CÁCH DÙNG:
   1. Nếu ảnh đặt tên 1.jpg, 2.jpg... -> Dùng cách 1 (tự sinh).
   2. Nếu tên ảnh lộn xộn -> Dùng cách 2 (nhập tay).
*/

// --- CÁCH 1: TỰ SINH (Bỏ comment nếu dùng) ---

const COUNT = 54; // Số lượng ảnh
const EXT = ".jpg"; // Đuôi ảnh
window.AODO_IMAGES = [];
for(let i=1; i<=COUNT; i++) {
    window.AODO_IMAGES.push(i + EXT);
}


// // --- CÁCH 2: THỦ CÔNG (Đang dùng mặc định) ---
// window.AODO_IMAGES = [
//   "1.jpg",
//   "2.jpg",
//   "img_vui.png",
//   // Thêm tên file của bạn vào đây
// ];
