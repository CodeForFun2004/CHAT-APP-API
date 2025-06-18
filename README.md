### Import dependencies
npm init -y
npm install express mongoose socket.io cors dotenv
npm install --save-dev nodemon
npm install bcrypt
npm install jsonwebtoken    // tạo token
npm install passport passport-google-oauth20    // oauth gg



"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
### HTTP
PATCH là một HTTP method được dùng để cập nhật một phần tài nguyên (partial update), không phải toàn bộ như PUT.


### Web Socket
npm install socket.io

### Nếu chưa có giao diện để test web socket thì dùng: WebSocket Test Client, Node.js client, Insomnia Pro



### Test OAuth GG
http://localhost:3000/api/auth/google




