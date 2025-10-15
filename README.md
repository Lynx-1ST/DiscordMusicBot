---
# DiscordMusicBot 🎶

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **An Vietnamese-Translated Music Bot for Discord – Educational Purpose only**  
> **Tác giả:** Lynx_1ST  
> **Yêu cầu Lavalink V3 để hoạt động!**  
> Có thể **tùy chỉnh ngôn ngữ thủ công** trong mã nguồn.  
> ⚠️ *Bot hiện không còn được cập nhật – đang trong quá trình nâng cấp lên Lavalink V4.*

---

## 🧠 Giới thiệu

**DiscordMusicBot** là một bot phát nhạc cho **Discord**, được phát triển cho **mục đích học tập**.  
Bot sử dụng **Lavalink v3** để xử lý và stream nhạc từ YouTube, Spotify hoặc các nguồn tương thích khác.  
Dự án này được thực hiện bởi **Lynx_1ST**, và có thể được sử dụng để nghiên cứu cách xây dựng bot âm thanh trên Discord.

---

## 🧰 Yêu cầu hệ thống

Trước khi chạy bot, bạn cần chuẩn bị:

- **Lavalink v3** (chạy trên máy hoặc server riêng)
- **Token Discord Bot** (tạo tại [Discord Developer Portal](https://discord.com/developers/applications))
- **Python 3.9+** hoặc **Node.js** 
- **FFmpeg** (xử lý âm thanh)

Cài đặt thư viện cần thiết:

```bash
pip install -r requirements.txt
# hoặc
npm install
````

---

## ⚙️ Cấu hình

Tạo hoặc chỉnh sửa file `settings.yml` để cấu hình bot:

```yaml
token: "YOUR_DISCORD_BOT_TOKEN"
prefix: "!"
lavalink:
  host: "127.0.0.1"
  port: 2333
  password: "youshallnotpass"
```

> 💡 **Lưu ý:**
>
> * Thay `"YOUR_DISCORD_BOT_TOKEN"` bằng token thật của bot.
> * Không chia sẻ token cho người khác hoặc commit lên GitHub.
> * Cần đảm bảo **Lavalink v3** đang chạy trước khi khởi động bot.

---

## 🚀 Cách chạy bot

1. Chạy Lavalink trước (thông qua `java -jar Lavalink.jar`)

2. Khởi động bot:

   ```bash
   node src/index.js
   ```

3. Mời bot vào server Discord của bạn và đảm bảo bot có quyền:

   * Kết nối và nói (Connect / Speak)
   * Gửi tin nhắn (Send Messages)

---

## 🎧 Các lệnh cơ bản

| Lệnh                       | Mô tả                                      |
| -------------------------- | ------------------------------------------ |
| `!play <url hoặc từ khóa>` | Phát nhạc từ YouTube, Spotify,...          |
| `!pause` / `!resume`       | Tạm dừng / tiếp tục phát nhạc.             |
| `!skip`                    | Bỏ qua bài hát hiện tại.                   |
| `!stop`                    | Dừng phát và xóa hàng đợi.                 |
| `!queue`                   | Hiển thị danh sách bài hát trong hàng đợi. |
| `!repeat`                  | Lặp lại bài hát hoặc toàn bộ danh sách.    |
| `!volume <mức>`            | Điều chỉnh âm lượng phát nhạc.             |
| `!leave`                   | Bot rời kênh thoại.                        |

> Danh sách lệnh có thể khác nhau tùy theo phiên bản mã nguồn hiện tại.

---

## 📁 Cấu trúc thư mục

```
.
├─ src/                     # Thư mục chứa mã nguồn chính (cogs, events, bot)
├─ settings.yml             # File cấu hình Lavalink + token Discord
├─ requirements.txt / package.json
├─ Procfile                 # Dùng cho triển khai Heroku (tùy chọn)
├─ LICENSE                  # Giấy phép MIT
└─ README.md
```

---

## ⚠️ Ghi chú & Lưu ý

* Bot **chỉ dành cho mục đích học tập**, không khuyến khích sử dụng công khai.
* Phiên bản hiện tại **chỉ tương thích Lavalink V3**.
* **Phiên bản Lavalink V4** đang được phát triển.
* Nếu bot không phát nhạc, hãy kiểm tra:
* 
  * FFmpeg đã cài đúng chưa.
  * Lavalink đang chạy ổn định.
  * Mật khẩu / host / port trong `settings.yml` chính xác chưa.

---

## 🤝 Đóng góp

Nếu bạn muốn đóng góp cho dự án:

1. **Fork** repo về tài khoản của bạn.
2. Tạo branch mới để phát triển hoặc sửa lỗi.
3. Commit thay đổi với mô tả rõ ràng.
4. Tạo **Pull Request** về repo chính.

> Mọi đóng góp, chỉnh sửa, bản dịch và tối ưu hiệu suất đều được hoan nghênh!

---

## 📄 Giấy phép

Dự án được phát hành theo **Giấy phép MIT**.
Xem chi tiết tại [LICENSE](LICENSE).

---

© 2025 – Phát triển bởi **Lynx_1ST**


---


