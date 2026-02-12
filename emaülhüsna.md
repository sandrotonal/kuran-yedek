Asma Al Husna API - AlAdhan v1
An API to get the 99 beautiful names of God, in English and Arabic. All the endpoints return JSON and are available over http and https.

API SERVER
 https://api.aladhan.com/v1
 https://aladhan.api.islamic.network/v1/
 https://aladhan.api.alislam.ru/v1/
SELECTED: https://api.aladhan.com/v1
AsmaAlHusna
AsmaAlHusna

Get all the Asma Al Husna
get /asmaAlHusna
Returns the Arabic text with transliteration and meaning of each name

REQUEST
REQUEST HEADERS
Accept-Encoding
string
Content Encoding for compression. Supported values are "gzip" or "zstd".

API Server
https://api.aladhan.com/v1
Authentication
Not Required
RESPONSE
200
Returns all Asma Al Husna

EXAMPLE
SCHEMA
application/json

Example 1
Copy
{
"code": 200,
"status": "OK",
"data": [
{
"name": "الرَّحْمَنُ",
"transliteration": "Ar Rahmaan",
"number": 1,
"en": {
"meaning": "The Beneficent"
}
}
]
}
Get one or more Asma Al Husna
get /asmaAlHusna/{number}
Returns the Arabic text with transliteration and meaning

REQUEST
PATH PARAMETERS
* number
string
77
A valid Asma Al Husna number or list of comma separated numbers between 1 and 99. So "7" or "7,8,9".

Examples: 77
REQUEST HEADERS
Accept-Encoding
string
Content Encoding for compression. Supported values are "gzip" or "zstd".

API Server
https://api.aladhan.com/v1
Authentication
Not Required
RESPONSE
Returns a specific Asma Al Husna

EXAMPLE
SCHEMA
application/json
Copy
{
"code": 200,
"status": "OK",
"data": [
{
"name": "الرَّحْمَنُ",
"transliteration": "Ar Rahmaan",
"number": 1,
"en": {
"meaning": "The Beneficent"
}
}
]
}