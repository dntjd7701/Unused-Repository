const dotenv = require('dotenv');
const path = require('path');
// const assert = require('assert').strict;
const should = require('chai').should();

dotenv.config({ path : path.join(path.resolve(__dirname, '..'), 'config/db.env')});

describe('Model Board', function(){
    let models;
    let user; // test user를 받을 변수 생성

    before(async function(){
        models = require('../models');
        user = await models.User.create({ // testUser 생성 
            name: "testUser",
            email: "testUser@mysite.com",
            password: "1234",
            gender: "male",
        })
    });
    it('Create 3 Board', async function(){ // findAll를 테스트하기 위해 3개 생성 
        let board;

         board = await models.Board.create({
            title: "test",
            contents: "test",
            hit: 0,
  
            userNo: user.no
        });
        board.no.should.not.equal(undefined);

        board = await models.Board.create({
            title: "test",
            contents: "test",
            hit: 0,
  
            userNo: user.no
        });
        board.no.should.not.equal(undefined);

        board = await models.Board.create({
            title: "test",
            contents: "test",
            hit: 0,

            userNo: user.no
        });
        board.no.should.not.equal(undefined);

    })

    it('Fetch Boards by user.no', async function(){
        const results = await models.Board.findAll({
            where:{
                userNo: user.no
            },
            // userNo는 board에 세팅되어있는 상태가 아니기 때문에(model) userNo를 포함해 가져오기 위해 include사용 
            include: {
                model: models.User,
                required: true // left join -> inner join으로 바꿔주기 위해서 required: true로 변경
            }

        })
        results.should.have.lengthOf(3);
    })

    // after(async function(){
    //     await models.Board.destroy({ // 테스트 종류 후 테스트 유저 삭제 
    //         where: {
    //             userNo: user.no
    //         }
    //     })
    //     await models.User.destroy({ // 테스트 종류 후 테스트 유저 삭제 
    //         where: {
    //             no: user.no
    //         }
    //     })
    // })

})