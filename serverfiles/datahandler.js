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
        let updated = []
        for (let showtime in data[movie]){
            updated.push(showtime)
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
        let showingDetails = await getSavedShowingDetails(date)
        for (let showtime in showingDetails[title]){
            // if the showtime is not in the updated list it means it is no longer a showiing and should be removed from the list entirely
            if (!updated.includes(showtime)){
                delete storage[date][title][showtime]
            }
        }
    }
    fs.writeFileSync('storage.json', JSON.stringify(storage,null, 4))
}


module.exports = {getSavedShowingDetails,saveShowingDetails}