const mysql = require("mysql2");
const dbconn = require("./dbconn");
const util = require("util");

module.exports = {
    findAll: async function(){
        const conn = dbconn();
        const query = util.promisify(conn.query).bind(conn);
        try {
             return await query(
                 "select no, name, password, message, date_format(reg_date, '%Y/%m/%d') as regDate from guestbook order by no desc",
                 []
             );
        } catch (error) {
            console.log(`findAll error : ${error}`)
        } finally {
            conn.end();
        }
    },

    add: async function(guestbooklist){
        const conn = dbconn();
        const query = util.promisify(conn.query).bind(conn);
        console.log(Object.values(guestbooklist));
        try {
            return await query(
                "insert into guestbook(no, name, password, message, reg_date) values(null, ?, ?, ?, now())",
                Object.values(guestbooklist)
                )
        } catch (error) {
            console.log(`insert error : ${error}`);
        } finally{
            conn.end();
        }
    },

    delete: async function(data){
        console.log(data);
        const conn = dbconn();
        const query = util.promisify(conn.query).bind(conn);
        try {
            await query(
                "delete from guestbook where no=?"
                ,[data.no]
                )
        } catch (error) {
            console.log(`delete error : ${error}`);
        } finally {
            conn.end();
        }
    }

}

