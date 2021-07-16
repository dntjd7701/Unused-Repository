const {Sequelize} = require('sequelize');

module.exports = {
    index: async function(req, res){
        try {
            res.render('gallery/index');
        } catch (error) {
            next(error);
        }
    },
}
