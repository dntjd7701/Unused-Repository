/**
 *  Server가 시작될 때, 이게 실행되는 이유(Controller로 인해 실행이 된다.)
 *  일단, 개별적으로 Sequelize 매번 실행되게 할 순 없다. 
 *  그러니까, User와 같이 controller에 의해 직접적으로 실행되는 걸 제외하고는 
 *  DB의 초기화를 별개로 실행해야한다는 것이다. 
 * 
 *  문제는 route controller랑 연결되어 실행되고있지만(User) 연결되어 있지 않은
 *  경우에는 어떻게 처리를 할 것인가이다. 
 * 
 *  그러므로 DB의 초기화는 model들을 쭉 만들어 놓고
 *  이 전체적인 것을 포함하는 model를 controller에 export 시킨다. 
 *  그 model폴더의 index.js에 아래의 DB연결 정보를 입력시킨다.
 *  즉, 초기화 작업은 index에서만 하는 것이다. 다른 테이블의 정보를 
 *  index.js로 모아 index.js가 한번에 실행되도록 한다. 
 *  (sync 작업 포함)
 *  
 */

/**
 *  설정은 각 model에서 정의하고
 *  그 모델들을 불러와
 *  초기화 작업을 index.js에서 한번에 실행한다. 
 */


const {Sequelize, DataTypes} = require('sequelize');
// DB정보를 받아 객체 생성 
const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        timezone: "+09:04",
        dialect: 'mysql'
    }
);
// User 받아오기 
const User = require('./User')(sequelize);
const Guestbook = require('./Guestbook')(sequelize);
const Gallery = require('./Gallery')(sequelize);
const Site = require('./Site')(sequelize);

User.sync({
    // table이 없을때 만들어 !
    force: process.env.TABLE_CREATE_ALWAYS === 'true', // drop시키고 만들기  // 항상 DB를 새롭게 만드는 것. 
    alter: process.env.TABLE_ALTER_SYNC === 'true' // 데이터가 변경되면 alter table link가 날라가게 한다.  // table의 변경 (true) //개발 중엔 보통 true
})

Guestbook.sync({
    force: process.env.TABLE_CREATE_ALWAYS === 'true',
    alter: process.env.TABLE_ALTER_SYNC === 'true' 
})

Gallery.sync({
    force: process.env.TABLE_CREATE_ALWAYS === 'true',
    alter: process.env.TABLE_ALTER_SYNC === 'true' 
})

Site.sync({
    force: process.env.TABLE_CREATE_ALWAYS === 'true',
    alter: process.env.TABLE_ALTER_SYNC === 'true' 
})
module.exports = { User, Guestbook, Gallery, Site } 