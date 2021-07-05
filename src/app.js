// Require global libraries
const path = require('path')

// Require node libraries
const express = require('express')
const hbs = require('hbs')
const app = express()

// Setup local requirements
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

// Define paths for Express Handlebars config
const viewPath = path.join(__dirname, "../templates/views")
const partialspath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine
app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialspath)

// Setup static directory to serve
app.use(express.static(path.join(__dirname, '../public')))

app.get('', (req,res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Anthony Wiggin'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About page',
        name: 'Anthony Wiggin'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help page',
        helpNote: 'No information provided, please contact administrator',
        name: 'Anthony Wiggin'
    })
})

// app.get('/weather', (req, res) => {
//     res.render('weather', {
//         forecast: 'Sunny @ 97',
//         location: 'Nashua New Hampshire United States'
//     })
// })

app.get('/help/*', (req, res) => {
    res.render('404', {
        errorMessage: 'Help article not found'
    })
})

app.get('/products', (req, res) => {
    if (!req.query['search']) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query)
    res.send({
        products: []
    })
})

app.get('/weather', (req, res) => {
    if (!req.query['address']) {
        return res.send({
            error: 'Address is required'
        })
    }

    geocode(req.query['address'], (err, {latitude, longitude, location} = {}) => {
        if (err) {
            return res.send({
                err
            })
        }
        forecast(latitude, longitude, (err, data) => {
            if (err)
                return res.send({ err })

            res.send({
                forecast: data,
                location,
                address: req.query['address']
            })
        })
    })


    // res.send({
    //     forecast: 'It rain',
    //     location: 'Nashua',
    //     address: req.query['address']
    // })
})

app.get('*', (req, res) => {
    res.render('404', {
        errorMessage: 'Error 404: PAGE NOT FOUND'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000')
})