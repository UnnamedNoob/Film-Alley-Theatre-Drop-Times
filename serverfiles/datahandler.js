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
        let title = Object.keys(movie)[0]
        for (let showtime in movie['showtimes']){
            console.log(showtime)
            if (showtime.available === false){
                if (storage[date][title][showtime] != null){
                    storage[date][title][showtime] = {
                        available:false,
                        seatingURL: storage[date][title][showtime].seatingURL,
                        ticketsSold: storage[date][title][showtime].ticketsSold,
                        theater: storage[date][title][showtime].theater

                    }
                }else{
                    storage[date][title][showtime] = {
                        available:false
                    }
                }
            }else{
                storage[date][title][showtime] = {
                    available:true,
                    seatingURL: showtime.seatingURL,
                    ticketsSold: showtime.ticketsSold,
                    theater: showtime.theater
                }
            }
        }
    }
    console.log(storage)
    let result = fs.writeFileSync('storage.json', JSON.stringify(storage))
    
}


module.exports = {getSavedShowingDetails,saveShowingDetails}