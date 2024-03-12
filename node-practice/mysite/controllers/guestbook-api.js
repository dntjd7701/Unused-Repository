const models = require('../models');
const {Sequelize, Op} = require('sequelize');

module.exports = {
    read: async function(req, res, next) {
        try {
            const startNo = req.query.no || 0;
            const results = await models.Guestbook.findAll({
                attributes: ['no', 'name','password', 'message'],
                where: (startNo > 0) ? {no : {[Op.lt]: startNo}} : {},
                order: [['no', 'DESC']],
                limit: 3
            })
            res.status(200).send({
                result: "success",
                data: results,
                message: null
            })
        } catch (error) {
            next(error);
        }
    },
    create: async function(req, res, next) {
        try {
            const results = await models.Guestbook.create(req.body)
            res.status(200).send({
                result: 'success',
                data: Object.assign(req.body, {
                    password: '',
                }),
                message: null
            });
        } catch (error) {
                next(error);
        }
    },
    delete: async function(req, res, next) {
        // sql delete
        await models.Guestbook.destroy({
            where: {
                no: req.params.no,
                password: req.body.password
            }
        });
        res.status(200).send({
            result: 'success',
            data: req.params.no,
            message: null
        });
    }
}