process.env.NODE_ENV = 'test'

require('../app/models/user.model')
require('../app/models/state.model')
const User = require('mongoose').model('User')
const State = require('mongoose').model('State')

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const should = chai.should()
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.use(chaiHttp)

describe('User', () => {
    beforeEach((done) => {
        User.remove({}, (err) => {
            done()
        })
    })
    describe('/GET leaderboard', () => {
        it('it should GET all the users', (done) => {
            var request1 = {
                user: 'test1',
                win: 5,
                lose: 2,
                draw: 2,
                blackjack: 0,
                winRatio: 0.5556
            }
            var request2 = {
                user: 'test2',
                win: 1,
                lose: 1,
                draw: 1,
                blackjack: 1,
                winRatio: 0.3333
            }
            var user1 = new User(request1)
            var user2 = new User(request2)
            var state1 = new State()
            var state2 = new State()
            user1.state = state1
            user2.state = state2
            user1.save()
                .then(() => {
                    return user2.save()
                })
                .then(() => {
                    chai.request(server)
                        .get('/api/leaderboard')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('array');
                            res.body.length.should.be.eql(2)
                            res.body[0].winRatio.should.be.eql(0.5556)
                            done()
                        })
                })
                .catch((err) => {
                    done(err)
                })
        })
    })
    describe('/POST user', () => {
        it('it should not POST to start without user field', (done) => {
            var user = {}
            chai.request(server)
                .post('/api/start')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('user');
                    res.body.errors.user.should.have.property('kind').eql('required');
                    done()
                })
        })
        it('it POST with user field to start get 2 card from deck', (done) => {
            var request = {
                user: 'test'
            }
            chai.request(server)
                .post('/api/start')
                .send(request)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('userCards');
                    res.body.userCards.should.be.a('array')
                    res.body.userCards.length.should.be.eql(2)
                    done()
                })
        })
        it('it POST in 10 seconds interval after same user POST', (done) => {
            var request = {
                user: 'test'
            }
            var user = new User({user: 'test'})
            var state = new State()
            user.state = state
            user.save()
                .then((user) => {
                    chai.request(server)
                        .post('/api/start')
                        .send(request)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('error').eql('User\'s currently playing')
                            done()
                        })
                })
                .catch((err) => {
                    console.log(err)
                    done(err)
                })
        })
        it('it POST after 10 seconds interval after same user POST', (done) => {
            var request = {
                user: 'test'
            }
            var user = new User({user: 'test'})
            var state = new State()
            user.state = state
            user.save()
                .then((user) => {
                    setTimeout(function () {
                        chai.request(server)
                            .post('/api/start')
                            .send(request)
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.should.be.a('object');
                                res.body.should.have.property('userCards');
                                res.body.userCards.should.be.a('array')
                                res.body.userCards.length.should.be.eql(2)
                                done()
                            })
                        }, 10000);
                })
                .catch((err) => {
                    console.log(err)
                    done(err)
                })
        })

    })
})