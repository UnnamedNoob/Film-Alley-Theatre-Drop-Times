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
    for (let movie in data){
        let title = movie
        for (let showtime in data[movie]){
            if (storage[date] == null){
                storage[date] = {}
            }
            if (storage[date][title] == null){
                storage[date][title] = {}
            }
            if (storage[date][title][showtime] == null){
                storage[date][title][showtime] = {}
            }
            if (storage[date][title][showtime]?.available === false)continue;
            let showtimeData = storage[date][title][showtime]
            showtimeData = {
                ...data[title][showtime]
            }
            if (data[title][showtime]?.available === false){
                showtimeData = {...storage[date][title][showtime]}
                showtimeData.available = false
            }
            storage[date][title][showtime] = showtimeData
        }
    }
    fs.writeFileSync('storage.json', JSON.stringify(storage,null, 4))
}


module.exports = {getSavedShowingDetails,saveShowingDetails}