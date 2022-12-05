
const puppeteer = require('puppeteer')
const cliProgress = require('cli-progress');
const htmlparse = require('node-html-parser')

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

let moviesToday = {}


class Movie {

    constructor(title, icon, starttime, endtime, presold){
        this.title = title
        this.icon = icon
        this.startTime = starttime
        this.endTime = endtime 
        this.ticketsSold = presold
    }
}


async function createTodaysShowtimes(){
    let showingsPage = await fetchRenderedPage('https://terrell.filmalley.net/showtimes')
    createListingsFromShowtimePage(await fetchShowtimeHTMLFromDate('2022-12-05'))
    // getSeatingForShowing('https://411322.formovietickets.com:2235/T.ASP?WCI=BT&Page=PickTickets&SHOWID=187846')
}
createTodaysShowtimes()

async function createListingsFromShowtimePage(html){
    let movies = html.querySelector('#now').querySelectorAll('.movie')
    let final = []
    console.log("\nFetching showtimes for Monday, December 05 \n")
    let bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    bar1.start(movies.length, 0);
    let moviesStarted = 0
    for (let movie of movies){
        let title = movie.querySelector('.movie-info h3').textContent
        let showings = movie.querySelectorAll('.showtime')
        let showtimes = {}
        for (let showing of showings){
            if (showing.classList.contains('disabled')){moviesStarted++;continue};
            let startTime = showing.querySelector('.tixLink').textContent.trim()
            let seatingURL = showing.querySelector('.tixLink').getAttribute('href')
            let movieStats = await getSeatingForShowing(showing.querySelector('.tixLink').getAttribute('href'))
            showtimes[startTime] = {
                seatingURL,
                ticketsSold: movieStats.soldSeats,
                theater: findTheaterFromSeatCount(movieStats.totalSeats)
            }
        }
        final.push({title,showtimes})
        bar1.increment()
    }
    bar1.stop()
    let totalSeats = 0
    let totalSold = 0
    let highestSoldMovie
    let highestSoldSeats = 0
    for (let movie of final){
        for (let showtime in movie.showtimes){
            let toAddSeats = theatreSeatCounts[movie.showtimes[showtime].theater]
            let toAddSold = movie.showtimes[showtime].ticketsSold
            totalSeats += toAddSeats
            totalSold += toAddSold
            if (toAddSold > highestSoldSeats){
                highestSoldSeats = toAddSold
                highestSoldMovie = movie.title
            }
        }
    }
    console.log(`\nTotal showings already started: \n${moviesStarted}\n`)
    console.log(`\nTotal seats sold:\n${totalSold} out of ${totalSeats}\n`)
    console.log(`\nHighest sold movie:\n${highestSoldMovie} with ${highestSoldSeats} seats sold`)
}


async function fetchRenderedPage(url){
    let browser = await puppeteer.launch({headless:true});
    let page = await browser.newPage();
    await page.goto(url);
    let data = await page.evaluate(() => document.querySelector('*').outerHTML);    
    return(htmlparse.parse(data))
}

async function getSeatingForShowing(url){
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

module.exports = {}

