const { workerData, parentPort } = require('node:worker_threads')
console.log(workerData)


async function getSeatingForShowing(url){
    let title = movie.querySelector('.movie-info h3').textContent
    let showings = movie.querySelectorAll('.showtime')
    let showtimes = {}
    for (let showing of showings){
        let startTime = showing.querySelector('.tixLink').textContent.trim()
        let seatingURL = showing.querySelector('.tixLink').getAttribute('href')
        let movieStats = await getSeatingForShowing(showing.querySelector('.tixLink').getAttribute('href'))
        showtimes[startTime] = {
            seatingURL,
            ticketsSold: movieStats.soldSeats,
            theater: findTheaterFromSeatCount(movieStats.totalSeats)
        }
    }
}
