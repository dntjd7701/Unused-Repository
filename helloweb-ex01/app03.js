const connect = require("connect");
const serverStatic = require("serve-static");
// use가 들어가면 미들웨어 사용하는 것.

const port = 8080;
const app = connect();
app.use(serverStatic(__dirname + "/public"));
app.listen(port, function () {
  console.log(`Http Server running on port ${port}`);
});
