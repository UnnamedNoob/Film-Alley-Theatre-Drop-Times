
const puppeteer = require('puppeteer')
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
    console.log(showingsPage)
    // getSeatingForShowing('https://411322.formovietickets.com:2235/T.ASP?WCI=BT&Page=PickTickets&SHOWID=187846')
}
createTodaysShowtimes()


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

module.exports = {}

