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

describe('User', function() {
    beforeEach(function(done) {
        User.remove({}, (err) => {
            done()
        })
    })
    describe('/GET leaderboard', function() {
        it('it should GET all the users', function(done) {
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
    describe('/PUT stand', function() {
        it('it PUT update result (user win)', function(done) {
            var request = {
                user: 'test'
            }
            var user = new User(request)
            var state = new State() 
            userCards = 
            [
                {
                    cardName: '10'
                },
                {
                    cardName: '10'
                },
            ]
            cpuCards = 
            [
                {
                    cardName: '2'
                },
                {
                    cardName: '3'
                },
            ]
            user.state = state
            user.save()
                .then(() => {
                    return User.findOne({ user: request.user})
                            .then((user) => {
                                user.state.userCards = userCards
                                user.state.cpuCards = userCards
                                user.update()
                            })
                            .catch((err) => {
                                done(err)
                            })
                })
                .then(() => {
                    chai.request(server)
                        .put('/api/stand/' + request.user)
                        .send()
                        .end((err, res) => {
                            console.log(res.body)
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('userCards');
                            res.body.should.have.property('cpuCards');
                            res.body.userCards.should.be.a('array')
                            res.body.cpuCards.should.be.a('array')
                            res.body.should.have.property('message').eql('You are the winner')
                            done()
                        })
                })
        })
        it('it PUT update result (user blackjack)', function(done) {
            var request = {
                user: 'test'
            }
            var user = new User(request)
            var state = new State() 
            user.state = state
            userCards = 
            [
                {
                    cardName: 'A'
                },
                {
                    cardName: '10'
                },
            ]
            cpuCards = 
            [
                {
                    cardName: '2'
                },
                {
                    cardName: '3'
                },
            ]
            user.save()
                .then(() => {
                    return User.findOne({ user: request.user})
                            .then((user) => {
                                user.state.userCards = userCards
                                user.state.cpuCards = userCards
                                user.update()
                            })
                            .catch((err) => {
                                done(err)
                            })
                })
                .then(() => {
                    chai.request(server)
                        .put('/api/stand/' + request.user)
                        .send()
                        .end((err, res) => {
                            console.log(res.body)
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('userCards');
                            res.body.should.have.property('cpuCards');
                            res.body.userCards.should.be.a('array')
                            res.body.cpuCards.should.be.a('array')
                            res.body.should.have.property('message').eql('Blackjack !!!')
                            done()
                        })
                })
        })
        it('it PUT update result (user lose)', function(done) {
            var request = {
                user: 'test'
            }
            var user = new User(request)
            var state = new State() 
            user.state = state
            userCards = 
            [
                {
                    cardName: '3'
                },
                {
                    cardName: '10'
                },
                {
                    cardName: 'K'
                },
            ]
            cpuCards = 
            [
                {
                    cardName: '2'
                },
                {
                    cardName: '3'
                },
            ]
            user.save()
                .then(() => {
                    return User.findOne({ user: request.user})
                            .then((user) => {
                                user.state.userCards = userCards
                                user.state.cpuCards = userCards
                                user.update()
                            })
                            .catch((err) => {
                                done(err)
                            })
                })
                .then(() => {
                    chai.request(server)
                        .put('/api/stand/' + request.user)
                        .send()
                        .end((err, res) => {
                            console.log(res.body)
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('userCards');
                            res.body.should.have.property('cpuCards');
                            res.body.userCards.should.be.a('array')
                            res.body.cpuCards.should.be.a('array')
                            res.body.should.have.property('message').eql('You lose')
                            done()
                        })
                })
        })
        it('it PUT update result (draw)', function(done) {
            var request = {
                user: 'test'
            }
            var user = new User(request)
            var state = new State() 
            user.state = state
            userCards = 
            [
                {
                    cardName: '10'
                },
                {
                    cardName: 'A'
                }
            ]
            cpuCards = 
            [
                {
                    cardName: '10'
                },
                {
                    cardName: 'A'
                },
            ]
            user.save()
                .then(() => {
                    return User.findOne({ user: request.user})
                            .then((user) => {
                                user.state.userCards = userCards
                                user.state.cpuCards = userCards
                                user.update()
                            })
                            .catch((err) => {
                                done(err)
                            })
                })
                .then(() => {
                    chai.request(server)
                        .put('/api/stand/' + request.user)
                        .send()
                        .end((err, res) => {
                            console.log(res.body)
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('userCards');
                            res.body.should.have.property('cpuCards');
                            res.body.userCards.should.be.a('array')
                            res.body.cpuCards.should.be.a('array')
                            res.body.should.have.property('message').eql('Draw')
                            done()
                        })
                })

        })
        it('it PUT but user is not found', function(done) {
            var request = {
                user: 'test'
            }
            chai.request(server)
                .put('/api/stand/' + request.user)
                .send()
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error').eql('User not found.')
                    done()
                })
        })
        it('it PUT but user is inactive', function(done) {
            var request = {
                user: 'test'
            }
            var user = new User(request)
            var state = new State() 
            state.active = false
            user.state = state
            user.save()
                .then(() => {
                    chai.request(server)
                        .put('/api/stand/' + request.user)
                        .send()
                        .end((err, res) => {
                            res.should.have.status(422);
                            res.body.should.be.a('object');
                            res.body.should.have.property('error').eql('User is inactive.')
                            done()
                        })
                })

        })
    })
    describe('/PUT hit', function() {
        it('it PUT card from deck to userCards field', function(done) {
            var request = {
                user: 'test'
            }
            var user = new User(request)
            var state = new State() 
            user.state = state
            user.save()
                .then(() => {
                    chai.request(server)
                        .put('/api/hit/' + request.user)
                        .send()
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('userCards');
                            res.body.userCards.should.be.a('array')
                            res.body.userCards.length.should.be.above(2)
                            done()
                        })
                })
        })
        it('it PUT but user is not found', function(done) {
            var request = {
                user: 'test'
            }
            chai.request(server)
                .put('/api/hit/' + request.user)
                .send()
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error').eql('User not found.')
                    done()
                })
        })
        it('it PUT but user is inactive', function(done) {
            var request = {
                user: 'test'
            }
            var user = new User(request)
            var state = new State() 
            state.active = false
            user.state = state
            user.save()
                .then(() => {
                    chai.request(server)
                        .put('/api/hit/' + request.user)
                        .send()
                        .end((err, res) => {
                            res.should.have.status(422);
                            res.body.should.be.a('object');
                            res.body.should.have.property('error').eql('User is inactive.')
                            done()
                        })
                })

        })
    })
    describe('/POST user', function() {
        it('it should not POST to start without user field', function(done) {
            var request = {}
            chai.request(server)
                .post('/api/start')
                .send(request)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('user');
                    res.body.errors.user.should.have.property('kind').eql('required');
                    done()
                })
        })
        it('it POST with user field to start get 2 card from deck', function(done) {
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
        it('it POST in 10 seconds interval after same user POST', function(done) {
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


    })
    describe('/POST /PUT with timeDelay', function() {
        it('it POST after 10 seconds interval after same user POST', function(done) {
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
        it('it PUT after 10 seconds (Timeout) HIT', function(done) {
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
                            .put('/api/hit/' + request.user)
                            .send()
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.should.be.a('object');
                                res.body.should.have.property('error').eql('Timeout. You lose.')
                                done()
                            })
                        }, 10000);
                })
                .catch((err) => {
                    console.log(err)
                    done(err)
                })
        })
        it('it PUT after 10 seconds (Timeout) STAND', function(done) {
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
                            .put('/api/stand/' + request.user)
                            .send()
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.should.be.a('object');
                                res.body.should.have.property('error').eql('Timeout. You lose.')
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