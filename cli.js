#!/user/bin/env node
import minimist from 'minimist'
import fetch from 'node-fetch'
import moment from 'moment-timezone'

const args = minimist(process.argv.slice(2))

if(args.h){
    console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit.`)
    process.exit(0)
}

let latitude;
let longitude;
let timezone;

if(args.n){
    latitude = args.n
} else if(args.s){
    latitude = -args.s
} else {
    console.log("Latitude must be in range")
    process.exit(0)
}

if(args.e){
    longitude = args.e
} else if(args.w){
    longitude = -args.w
} else{
    console.log("Longitude must be in range")
    process.exit(0)
}

if(args.t){
    timezone = args.t;
} else {
    timezone = moment.tz.guess()
}

const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + String(latitude) + '&longitude=' + String(longitude) + '&hourly=temperature_2m&daily=precipitation_hours&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=' + timezone);
const data = await response.json()

if(args.j){
    console.log(data)
    process.exit(0)
}

const days = args.d

if (days == 0) {
    if(data.daily.precipitation_hours[days] == 0){
        console.log("You probably won't need your galoshes today.");
    } else {
        console.log("You probably need your galoshes today.");
    }
} else if (days > 1) {
    if(data.daily.precipitation_hours[days] == 0){
        console.log("You probably won't need your galoshes in " + days + " days.");
    } else {
        console.log("You probably need your galoshes in " + days + " days.");
    }
} else {
    if(data.daily.precipitation_hours[days] == 0){
        console.log("You probably won't need your galoshes tomorrow.");
    } else {
        console.log("You probably need your galoshes tomorrow.");
    }
}

process.exit(0);

