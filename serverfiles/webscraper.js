
const puppeteer = require('puppeteer')
const datahandler = require('./datahandler.js')
const cliProgress = require('cli-progress');
const htmlparse = require('node-html-parser')
const moment = require('moment')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const timeToUpdateData = 1000*60 // refreshes saved data every 1 minute

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
    console.log(`Starting scan for showings on ${date}`)
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
            let movieStats = await getSeatingForShowing(showing.querySelector('.tixLink').getAttribute('href'))
            showtimes[startTime] = {
                available:true,
                seatingURL,
                length,
                ticketsSold: movieStats.soldSeats,
                theater: findTheaterFromSeatCount(movieStats.totalSeats)
            }
        }
        final[title] = showtimes
    }
    datahandler.saveShowingDetails(date, final)
    return final
}


async function fetchRenderedPage(url){
    let browser = await puppeteer.launch({headless:true});
    let page = await browser.newPage();
    await page.goto(url);
    let data = await page.evaluate(() => document.querySelector('*').outerHTML);    
    return(htmlparse.parse(data))
}

async function getSeatingForShowing(url){
    try{

    
        let browser = await puppeteer.launch({headless:true});
        let page = await browser.newPage();
        await page.goto(url);
        await page.waitForSelector('.seat')
        let data = await page.evaluate(() => document.querySelector('*').outerHTML);    
        let parsedhtml = htmlparse.parse(data)
        let totalSeats = parsedhtml.querySelectorAll('.seat').length
        let soldSeats = parsedhtml.querySelectorAll('.unavailableSeat').length
        let brokenSeats = parsedhtml.querySelectorAll('.brokenSeat').length
        browser.close();
        return {totalSeats,soldSeats,brokenSeats}

        }catch{
            return
        }
}

async function fetchShowtimeHTMLFromDate(date){
    let data = await fetch("https://terrell.filmalley.net/actions/moviemanager/performances/get-location-movies?locationId=1359&movieSchedule=1427&showDate="+date,{
    })
    let html = await data.text()
    return htmlparse.parse(html)
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
    date = "2022-12-11"
    let result = await createListingsFromShowtimePage(await fetchShowtimeHTMLFromDate(date),date)
},timeToUpdateData)    

async function test(){
    let date = moment().format('YYYY-MM-DD')
    date = "2022-12-11"

    let result = await createListingsFromShowtimePage(await fetchShowtimeHTMLFromDate(date),date)
}

test()
module.exports = {getCompiledShowtimeData}

