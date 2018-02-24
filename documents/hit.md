# Hit

Draw one card from deck.

**URL** : `/api/hit/:user`

**Method** : `PUT`

## Success Responses

**Condition** : If everything is OK , User did exist, active and start time < 10.

**Code** : `200 OK`

**Content** : 
```json
{
    "userCards": [
        {
            "cardType": "clovers",
            "cardName": "J"
        },
        {
            "cardType": "hearts",
            "cardName": "J"
        },
        {
            "cardType": "tiles",
            "cardName": "9"
        }
    ]
}
```
### Or

**Condition** : If start time > 10.

**Code** : `200 OK`

**Content example**

```json
{
    "error": "Timeout. You lose."
}
```
### Or

**Condition** : If user didn't exist.

**Code** : `422 Unprocessable Entity`

**Content example**

```json
{
    "error": "User not found."
}
```
### Or

**Condition** : If user is inactive.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "error": "User is inactive."
}

```
