/**
    module.exports 보다는 exports를 사용하는게 원래의 구조에 더 적합하지만
    코드를 구조상으로 보이게 하기 위해 module.exports를 사용한다. 
 */
// exports.index = function (req, res) {};
// exports.form = function (req, res) {};
// exports.add = function (req, res) {};
const model = require("../models/emaillist"); //model 받아오기

module.exports = {
  index: async function (req, res) {
    // res.send("<h1>index</h1>");
    // index.js에서 views로 잡아놨음. 경로 지정시 views 폴더로 rendering됌
    const results = await model.findAll();
    res.render("index", {
      list: results || [],
    });
  },
  form: function (req, res) {
    res.render("form");
  },
  add: function (req, res) {
    console.log(req.body); // post형식의 들어오는 데이터 확인
    res.redirect("/"); // DB에 넣을 때 redirect를 해야된다. 맞지맞지
  },
};
