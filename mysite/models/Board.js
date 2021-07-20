const {Sequelize, DataTypes, Date} = require('sequelize');
module.exports = function(sequelize){
    return  sequelize.define('Board', {
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
    title: {
        filed: 'title',
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    contents: {
        filed: 'contents',
        type: DataTypes.TEXT,
        allowNull: false,
    },
    regDate: {
        filed: 'reg_date',
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
        //defaultValue: DataTypes.DATE or NOW
    },
    hit: {
        filed: 'hit',
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    groupNo: {
        filed: 'group_no',
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    orderNo: {
        filed: 'order_no',
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    depth: {
        filed: 'depth',
        type: DataTypes.INTEGER,
        allowNull: true,
    },
// 객체 설정
}, { 
    underscored: true,
    freezeTableName: true,
    timestamps: true,
    createdAt: false,
    updatedAt: false,
    tableName: 'board'
    }
);
}