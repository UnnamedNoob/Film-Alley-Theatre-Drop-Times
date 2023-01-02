try{
const child_proc = require("child_process");
const datahandler = require('./datahandler.js')
const htmlparse = require('node-html-parser')
const moment = require('moment')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const timeToUpdateDataDaily = 1000*60 // refreshes saved data every 1 minute
const timeToUpdateDataWeekly = 1000*60 // refreshes saved data every 1 minute for each day of the week
const theatreSeatCounts = {
    1: 101,
    2: 85,
    3: 153,
    4: 135,
    5: 120,
    6: 151,
    7: 178,
    8: 78,
}

async function createListingsFromShowtimePage(html, date){
    try{
        let movies = html.querySelector('#now').querySelectorAll('.movie')
        let final = {}
        for (let movie of movies){
            let title = movie.querySelector('.movie-info h3').textContent
            let length = movie.querySelector('.movie-info h4').textContent.split('| ')[1].split(' min')[0]
            let showings = movie.querySelectorAll('.showtime')
            let showtimes = {}
            for (let showing of showings){
                let startTime
                if (showing.classList.contains('disabled')){
                    startTime = showing.querySelector('span').textContent.trim()
                    showtimes[startTime] = {
                        available:false
                    }
                    continue
                };
                startTime = showing.querySelector('.tixLink').textContent.trim()
                let seatingURL = showing.querySelector('.tixLink').getAttribute('href')
                let movieStats = await getSeatingForShowing(seatingURL)
                if (movieStats.success === true){
                    showtimes[startTime] = {
                        available:true,
                        seatingURL,
                        length,
                        ticketsSold: movieStats.soldSeats,
                        theater: findTheaterFromSeatCount(movieStats.totalSeats)
                    }
                }else{
                    showtimes[startTime] = {
                        available:false,
                    }
                }
            }
            final[title] = showtimes
        }
        datahandler.saveShowingDetails(date, final)
        return final
    }catch{}
}

async function getSeatingForShowing(url){
    let sub = child_proc.fork("./serverfiles/puppeteerhandler.js");
    sub.send({url});
    return new Promise((resolve,reject)=>{
        sub.on("message", (message) => {
            sub.disconnect();
            if (message === null){
                return reject()
            }
            return resolve(message)
          });
    })
}

async function fetchShowtimeHTMLFromDate(date){
    try{
        let data = await fetch("https://terrell.filmalley.net/actions/moviemanager/performances/get-location-movies?locationId=1359&movieSchedule=1427&showDate="+date,{})
        let html = await data.text()
        return htmlparse.parse(html)
    }catch{
        return null
    } 
}

function findTheaterFromSeatCount(count){
    for (let theater in theatreSeatCounts){
        if (theatreSeatCounts[theater] === count){
            return theater
        }
    }
}

async function getCompiledShowtimeData(date){
    return await (datahandler.getSavedShowingDetails(date))
}

setInterval(async()=>{
    let date = moment().format('YYYY-MM-DD')
    let html = await fetchShowtimeHTMLFromDate(date)
    console.log("Updating data for "+date)
    if (html != null){
        await createListingsFromShowtimePage(html,date)
    }
},timeToUpdateDataDaily)    

let weeklyscan = false
let weeklyUpdateOffset = 1
setInterval(async()=>{
    if (weeklyscan === false){
        weeklyscan = true
        let date = moment().add(weeklyUpdateOffset,'days').format('YYYY-MM-DD')
        console.log("Updating data for "+date)
        let html = await fetchShowtimeHTMLFromDate(date)
        if (html != null){
            await createListingsFromShowtimePage(html,date)
            weeklyscan = false
        }
        weeklyUpdateOffset++
        if (weeklyUpdateOffset > 7){
            weeklyUpdateOffset = 1
        }
    }
},timeToUpdateDataWeekly)

module.exports = {getCompiledShowtimeData}

}catch{}