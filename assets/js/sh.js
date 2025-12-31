// Ví dụ dùng cách tự sinh cho Album SH
const SH_COUNT = 66; 
const SH_EXT = ".jpg";
window.SH_IMAGES = [];
for(let i=1; i<=SH_COUNT; i++) {
    window.SH_IMAGES.push(i + SH_EXT);
}
// Nếu muốn thêm thủ công thì push thêm vào mảng window.SH_IMAGES