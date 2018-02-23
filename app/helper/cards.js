module.exports = {
    dealCard: function(deck, hand) {
        if(deck.length !== 0) {
            var randidx = Math.floor((Math.random() * deck.length))
            hand.push(deck[randidx])
            deck.splice(randidx, 1)
        }
    },
    returnCardToDeck: function(deck, hand) {
        for(var i in hand) {
            for(var j in hand[i]) {
                deck.push(hand[i][j])
            }
            hand[i].splice(0, hand[i].length)
        }
    }
}
