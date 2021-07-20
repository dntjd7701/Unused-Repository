const dotenv = require('dotenv');
const path = require('path');
const assert = require('assert').strict;

dotenv.config({ path : path.join(path.resolve(__dirname, '..'), 'config/db.env')});

describe('Model User', function(){
    let models = null;
    before(async function(){
        models = require('../models');
        
    });
    it('Fetch User no=9 ', async function(){
        const user = await models.User.findOne({
            where: {
                no: 9
            }
        })

        assert.equal(user.no, 9)
    })

    after(async function(){
    })



})