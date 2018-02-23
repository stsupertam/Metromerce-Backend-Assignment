module.exports = {
    dealCard: function(deck, hand) {
        var randidx = Math.floor((Math.random() * deck.length))
        hand.push(deck[randidx])
        deck.splice(randidx, 1)
    }
}
