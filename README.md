# Thủy Sơn — Landing page

Trang giới thiệu Công ty TNHH phát triển thương mại và dịch vụ Thủy Sơn (máy in, đổ mực, phần cứng).

## Chạy local

Cần Node.js **18+** (khuyến nghị 20).

```bash
cd thuyson
npm install
npm run dev
```

## Build

```bash
npm run build
```

Kết quả trong thư mục `dist/`. Mở `dist/index.html` hoặc `npm run preview`.

## GitHub Pages

### Monorepo **amim** (folder `thuyson` trong repo này)

1. **Settings → Pages → Build and deployment**: chọn nguồn **GitHub Actions**.
2. Workflow: [`.github/workflows/deploy-thuyson-pages.yml`](../.github/workflows/deploy-thuyson-pages.yml) — chạy khi có thay đổi dưới `thuyson/`.
3. URL project page: `https://<user>.github.io/amim/` — trong [`vite.config.js`](vite.config.js) đã dùng `base: './'` để asset tương đối, hoạt động với đường dẫn con.

### Repo riêng (chỉ chứa landing)

1. Copy toàn bộ nội dung folder `thuyson` làm **root** repo.
2. Dùng file mẫu [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): sửa thành `npm ci` / `npm run build` ở root, `path: dist` cho upload artifact (bỏ `working-directory` và tiền tố `thuyson/`).
3. Với project page, nếu cần có thể đặt `base: '/<tên-repo>/'` trong `vite.config.js`.

## Ghi chú

- Ảnh hero/dịch vụ tải từ Unsplash (CDN).
- Zalo: `https://zalo.me/0975655744`
