var dealCard = function(deck, hand) {
    var randidx = Math.floor((Math.random() * deck.length))
    hand.push(deck[randidx])
    deck.splice(randidx, 1)
}

module.exports = {
    createDeck: function() {
        var deck = []
        for(var i = 1; i <= 13; i++) {
            var char = ''
            switch(i) {
                case 1:
                    char = 'A'
                    break
                case 11:
                    char = 'J'
                    break
                case 12:
                    char = 'Q'
                    break
                case 13:
                    char = 'K'
                    break
                default:
                    char = i.toString()
                    break
            }
            var card = [
                {
                    cardName: char,
                    cardType: "hearts"
                },
                {
                    cardName: char,
                    cardType: "tiles"
                },
                {
                    cardName: char,
                    cardType: "clovers"
                },
                {
                    cardName: char,
                    cardType: "pikes"
                },
            ]
            deck = deck.concat(card)
        }
        return deck
    },
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
