Qibla Direction API - AlAdhan v1
A Qibla direction API to calculate the Qibla angle on a compass and generate a Qibla compass image.

API SERVER
 https://api.aladhan.com/v1
 https://aladhan.api.islamic.network/v1/
 https://aladhan.api.alislam.ru/v1/
SELECTED: https://api.aladhan.com/v1
Qibla
Qibla direction API
get /qibla/{latitude}/{longitude}
Returns the Qibla direction based on a pair of co-ordinates

REQUEST
PATH PARAMETERS
* latitude
float
19.071017570421
Latitude co-ordinates

Examples: 19.071017570421
* longitude
float
72.838622286762
Longitude co-ordinates

Examples: 72.838622286762
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
Returns the Qibla direction based on the co-ordinates

EXAMPLE
SCHEMA
application/json
Copy
{
"code": 200,
"status": "OK",
"data": {
"latitude": 19.071017570421,
"longitude": 72.838622286762,
"direction": 280.07746236652
}
}
Qibla direction compass API
get /qibla/{latitude}/{longitude}/compass
Returns a compass image marking the direction of the Qibla

REQUEST
PATH PARAMETERS
* latitude
float
19.071017570421
Latitude co-ordinates

Examples: 19.071017570421
* longitude
float
72.838622286762
Longitude co-ordinates

Examples: 72.838622286762
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
Returns a compass image with the Qibla direction based on the co-ordinates

EXAMPLE
SCHEMA
image/png
