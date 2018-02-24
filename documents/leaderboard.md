# Leaderboard

Return user statistic.

**URL** : `/api/leaderboard`

**Method** : `GET`

## Success Responses

**Condition** : If everything is OK .

**Code** : `200 OK`

**Content** : 
```json
[
    {
        "_id": "5a91acb7e2a3eb5604726b25",
        "user": "test",
        "__v": 0,
        "totalPlay": 1,
        "winRatio": 0,
        "blackjack": 0,
        "draw": 0,
        "lose": 1,
        "win": 0
    },
    {
        "_id": "5a91ad6fe2a3eb5604726b27",
        "user": "test9999999",
        "__v": 0,
        "totalPlay": 0,
        "winRatio": 0,
        "blackjack": 0,
        "draw": 0,
        "lose": 0,
        "win": 0
    },
    {
        "_id": "5a91af375211603f5c35eb3b",
        "user": "gundam",
        "__v": 0,
        "totalPlay": 6,
        "winRatio": 0,
        "blackjack": 0,
        "draw": 0,
        "lose": 6,
        "win": 0
    }
]
```
