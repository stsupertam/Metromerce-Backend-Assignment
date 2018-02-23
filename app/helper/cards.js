var dealCard = function(deck, hand) {
    var randidx = Math.floor((Math.random() * deck.length))
    hand.push(deck[randidx])
    deck.splice(randidx, 1)
}

module.exports = {
    dealCard: function(deck, hand) {
        if(deck.length !== 0) {
            dealCard(deck, hand)
        }
    },
    returnCardToDeck: function(deck, hand) {
        for(var i in hand) {
            for(var j in hand[i]) {
                deck.push(hand[i][j])
            }
            hand[i].splice(0, hand[i].length)
        }
    },
    randomCard: function(deck, numCard) {
        var randomCard = [] 
        for(var i = 1; i <= numCard; i++) {
            dealCard(deck, randomCard)
        }
        return randomCard
    },
    calculatePoint: function(hand) {
        var totalPoint = 0
        for (var i in hand) {
            switch(hand[i].cardName) {
                case 'A':
                    totalPoint += Number(11)
                    break
                case 'J':
                case 'Q':
                case 'K':
                    totalPoint += Number(10)
                    break
                default:
                    totalPoint += Number(hand[i].cardName)
                    break
            }
        }
        return totalPoint
    }
}
