# Stand

Calculate score and return result.

**URL** : `/api/stand/:user`

**Method** : `PUT`

## Success Responses

**Condition** : If everything is OK , User did exist, active and start time < 10.

**Code** : `200 OK`

**Content** : 
```json
{
    "userCards": [
        {
            "cardName": "3",
            "cardType": "hearts"
        },
        {
            "cardName": "K",
            "cardType": "tiles"
        }
    ],
    "cpuCards": [
        {
            "cardName": "8",
            "cardType": "hearts"
        },
        {
            "cardName": "Q",
            "cardType": "hearts"
        }
    ],
    "message": "You lose"
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
