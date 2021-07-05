const request = require('request')

module.exports = (address, callback) => {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+ encodeURIComponent(address) +'.json?access_token=pk.eyJ1IjoibG9zc2kiLCJhIjoiY2txZTM0djliMTZrOTJzbjByeThqdmc3aiJ9.DI--hrmKaR40-ueQNA9RCg&limit=1'

    request({ url, json: true}, (err, res) => {
        if (err) {
            callback('Unable to connect to Location Services', undefined)
        }
        else if (res.body.features.length === 0) {
            callback('Unable to obtain location.  Try another search', undefined)
        }
        else {
            const data = res.body.features[0]
            callback(undefined, {
                latitude: data["center"][1],
                longitude: data["center"][0],
                location: data['place_name']
            })
        }
    })
}