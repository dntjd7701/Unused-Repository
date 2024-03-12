/**
 *  Server가 시작될 때, 이게 실행되는 이유(Controller로 인해 실행이 된다.)
 *  일단, 이게 매번 실행되게 할 순 없다. 
 *  그러니까, User와 같이 직접적으로 실행되는 걸 제외하고는 
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


// sequelize 중 아래 두 데이터를 아래와 같은 이름으로 받음 
const {Sequelize, DataTypes} = require('sequelize');
module.exports = function(sequelize){
    // column 속성 
    return  sequelize.define('User', {
    // Mapping
    // 이렇게 정의를 하면 query를 사용해 변경 사항이 있을 때 sequelize가 알아서 mapping 해서 처리 
    // 객체 속성 정의 
    no: {
        // table의 물리적 속성 
        filed: 'no',
        type: DataTypes.BIGINT(11),
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        filed: 'name',
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    email: {
        filed: 'email',
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    password: {
        filed: 'password',
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    gender: {
        filed: 'gender',
        type: DataTypes.ENUM(['female', 'male']),
        allowNull: false,
    },
    role: {
        filed: 'role',
        type: DataTypes.ENUM(['ADMIN', 'USER']),
        allowNull: true,
        defaultValue: 'USER'
    }
}, { // 객체 설정
    underscored: true,
    freezeTableName: true,
    timestamps: true,
    createdAt: false,
    updatedAt: false,
    tableName: 'user'
}
);
}
