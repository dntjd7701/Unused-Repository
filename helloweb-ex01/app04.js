const connect = require("connect");
const serverStatic = require("serve-static");
// Java에서의 Mapping과 비슷
const connectRoute = require("connect-route");

const port = 8080;
const app = connect();
app.use(serverStatic(__dirname + "/public"));
// url과 함수를 Mapping -> router
app.use(
  connectRoute(function (router) {
    router.get("/", function (req, resp) {
      resp.writeHead(200, {
        "Content-Type": "text/html",
      });
      resp.end("<h1>main</h1>");
    });

    router.get("/guestbook", function (req, resp) {
      resp.writeHead(200, {
        "Content-Type": "text/html",
      });
      resp.end("<h1>Guestbook</h1>");
    });

    router.get("/board", function (req, resp) {
      resp.writeHead(200, {
        "Content-Type": "text/html",
      });
      resp.end("<h1>Board</h1>");
    });
    router.get("/board/:no", function (req, resp) {
      resp.writeHead(200, {
        "Content-Type": "text/html",
      });
      resp.end("<h1>Board(" + req.params.no + ")</h1>");
    });
  })
);
app.listen(port, function () {
  console.log(`Http Server running on port ${port}`);
});
