const { Sequelize, DataTypes } = require('sequelize');

module.exports = function(sequelize){
    const module = sequelize.define('Site', {
        no : {
            filed: "no",
            type: DataTypes.INTEGER(11),
            primaryKey: true,
        },
        title: { 
            filed: "title",
            type: DataTypes.STRING(50),
            allowNull: false
        },
        welcome: {
            filed: "welcome",
            type: DataTypes.STRING(200),
            allowNull: false
        },
        profile: {
            filed: "profile",
            type: DataTypes.STRING(200),
            allowNull: false
        },
        description: {
            filed: "description",
            type: DataTypes.TEXT,
            allowNull: false
        },
    }, {
        underscored: true,
        freezeTableName: true,
        timestamps: true,
        createdAt: false,
        updatedAt: false,
        tableName: 'site'

    });
    module.removeAttribute('id');
    return module;
    
}