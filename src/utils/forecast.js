const request = require('request')

module.exports = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=d592f83d91246d8b4c3b06c37688b9fb&query=' + encodeURIComponent(latitude) + ',' + encodeURIComponent(longitude) + '&units=m'
    request({url, json: true}, (err, res) => {
        if (err) {
            callback('Could not connect to weather service', undefined)
        }
        else if (res.body.error) {
            callback('Could not find location', undefined)
        }
        else {
            const {temperature, feelslike, weather_descriptions, is_day, visibility} = res['body']['current']

            const daytime = is_day === 'yes' ? 'day' : 'night'
            const vis = (visibility) => {
                if (visibility > 10)
                    return 'Clear'
                else if (visibility > 5)
                    return 'High'
                else if (visibility > 1)
                    return 'Low'
                else
                    return 'Very low'
            }
            callback(undefined, weather_descriptions[0] + '. It is currently ' + temperature + ' degrees out.  It feels like ' + feelslike + ' degrees out to' + daytime + '. ' + vis(visibility) + ' visibility at the moment.')
        }
    })
}