# Start

Start game. Player gets 2 cards.

**URL** : `/api/start/`

**Method** : `POST`

**Data constraints**

Provide user to be played.

```json
{
    "user": "String"
}
```

## Success Responses

**Condition** : If everything is OK and an User didn't exist.

**Code** : `200 OK`

**Content** : 
```json
{
    "userCards": 
    [
        {
            "cardName": "4",
            "cardType": "clovers"
        },
        {
            "cardName": "6",
            "cardType": "clovers"
        }
    ]
}
```
### Or

**Condition** : If user already exist and start time < 10 seconds.

**Code** : `200 OK`

**Content example**

```json
{
    "error": "User's currently playing"
}
```
### Or

**Condition** : If fields are missed.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "errors": {
        "user": {
            "message": "Path `user` is required.",
            "name": "ValidatorError",
            "properties": {
                "type": "required",
                "message": "Path `{PATH}` is required.",
                "path": "user"
            },
            "kind": "required",
            "path": "user",
            "$isValidatorError": true
        }
    },
    "_message": "User validation failed",
    "message": "User validation failed: user: Path `user` is required.",
    "name": "ValidationError"
}
```
