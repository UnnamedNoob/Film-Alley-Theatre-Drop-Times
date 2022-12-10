const fs = require('fs')

async function getSavedShowingDetails(date){
    let data = fs.readFileSync('storage.json')
    try{
        data = JSON.parse(data)
    }catch{
        console.log('error when parsing json')
    }
    return data[date]
}

async function saveShowingDetails(date, data){
    let storage = fs.readFileSync('storage.json')
    try{
        storage = JSON.parse(storage)
    }catch{
        console.log('error when parsing json')
    }
    for (let movie of data){
        for (let showtime in movie.showtimes){
            if (showtime.available === false){
                if (storage[date][movie.title][showtime] != null){
                    storage[date][movie.title][showtime] = {
                        available:false,
                        seatingURL: storage[date][movie.title][showtime].seatingURL,
                        ticketsSold: storage[date][movie.title][showtime].ticketsSold,
                        theater: storage[date][movie.title][showtime].theater

                    }
                }else{
                    storage[date][movie.title][showtime] = {
                        available:false
                    }
                }
            }else{
                storage[date][movie.title][showtime] = {
                    available:true,
                    seatingURL: showtime.seatingURL,
                    ticketsSold: showtime.ticketsSold,
                    theater: showtime.theater
                }
            }
        }
    }
    let result = fs.writeFileSync('storage.json', JSON.stringify(storage))
    
}


module.exports = {getSavedShowingDetails,saveShowingDetails}