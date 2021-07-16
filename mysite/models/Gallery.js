const {Sequelize, DataTypes, Date} = require('sequelize');
module.exports = function(sequelize){
    return  sequelize.define('Gallery', {
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
    comment: {
        filed: 'comment',
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    url: {
        filed: 'url',
        type: DataTypes.STRING(200),
        allowNull: false,
        //defaultValue: DataTypes.DATE or NOW
    },
// 객체 설정
}, { 
    underscored: true,
    freezeTableName: true,
    timestamps: true,
    createdAt: false,
    updatedAt: false,
    tableName: 'gallery'
    }
);
}