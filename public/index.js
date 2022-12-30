console.log('loaded!')
document.querySelector('#refresh-button').addEventListener('click', async (e) => {
    let date = getSelectedDate()
    let data = await fetchDataFromDate(date)
    if (data === null) return alert('No data for this date!')
    updateTicketsSoldTable(data)
})

document.querySelector('#date-selector').addEventListener('change', async (e) => {
    let date = getSelectedDate()
    let data = await fetchDataFromDate(date)
    if (data === null) return alert('No data for this date!')
    updateTicketsSoldTable(data)

})


const table = document.querySelector('#sales-table')
async function fetchDataFromDate(date){
    let fetched = await fetch(`/showtimes/${date}`)
    let data = null
    try{
        data = await fetched.json()
    }catch{console.log(`no data for ${date}`);return}
    return data
}

function updateTicketsSoldTable(data, sortByStart=true){
    let trs = document.querySelectorAll('tr')
    for (let i=0;i<trs.length;i++){
        if (trs[i].parentElement.nodeName !== "THEAD"){
            trs[i].remove()
        }
    }
    let sortedTimes = {}
    for (let movie in data){ // adds showtimes into an object with their key as the time in minutes since midnight
        for (let showtime in data[movie]){
            if (sortByStart === true){
                sortedTimes[convertTimeToMinutes(showtime)] = [movie, showtime]
            }
            if (sortByStart === false){
                // save the movie and showtime in the sortTimes object wit the key as the endtime of the show in minutes
                let start = convertTimeToMinutes(showtime)
                let offsetStart = start+10
                let length = Number(data[movie][showtime].length)
                let endtime = start+offsetStart+length
                sortedTimes[endtime] = [movie,showtime]
            }
        }
    }
    sortedTimes = Object.keys(sortedTimes).sort((a,b) => a-b).reduce((r, k) => (r[k] = sortedTimes[k], r), {});
    if (sortByStart === true){
        let rounds = {}
        let round = 0
        let lastTime = 0
        for (let time in sortedTimes){
            if (time-lastTime >= 65){
                round++
                rounds[round] = [time]
            }else{
                rounds[round].push(time)
            }
            lastTime = time
        }
        lastTime = 0
        let total = 0
        for (let round in rounds){
            let roundTotal = 0
            if (round !== 1){
                let tr = document.createElement('tr')
                tr.style.height="10px"
                tr.style.backgroundColor = "black"
                tr.appendChild(document.createElement('td'))
                tr.appendChild(document.createElement('td'))
                tr.appendChild(document.createElement('td'))
                tr.appendChild(document.createElement('td'))
                tr.appendChild(document.createElement('td'))
                table.appendChild(tr)
            }
            let roundtr = document.createElement('tr')
            roundtr.classList.add('round-tr')
            let roundtd = document.createElement('td')
            roundtd.innerText = `Round ${round}`
            let roundtotaltd = document.createElement('td')
            roundtr.appendChild(roundtd)
            roundtr.appendChild(document.createElement('td'))
            roundtr.appendChild(document.createElement('td'))
            roundtr.appendChild(document.createElement('td'))
            roundtr.appendChild(roundtotaltd)
            table.appendChild(roundtr)
            for (let showtimeInMin of rounds[round]){
                let movie = sortedTimes[showtimeInMin][0]
                let showtime = sortedTimes[showtimeInMin][1]
                let showtimeData = data[movie][showtime]
                let ticketsSold = Number(showtimeData.ticketsSold)
                let tr = document.createElement('tr')
                let movietd = document.createElement('td')
                let starttimetd = document.createElement('td')
                let endtimetd = document.createElement('td')
                let theatertd = document.createElement('td')
                let ticketstd = document.createElement('td')
                movietd.innerText = movie || "No Data"
                starttimetd.innerText = showtime || "No Data"
                endtimetd.innerText = moment(showtime, ["h:mm a"]).add(Number(data[movie][showtime].length)+10, "minutes").format("h:mm a")
                theatertd.innerText = showtimeData.theater || "No Data"
                if (ticketsSold === isNaN(ticketsSold)){
                    ticketsSold = 0
                    ticketstd.innerText = "No Data"
                }else{
                    ticketstd.innerText = ticketsSold
                }
                tr.appendChild(movietd)
                tr.appendChild(starttimetd)
                tr.appendChild(endtimetd)
                tr.appendChild(theatertd)
                tr.appendChild(ticketstd)
                if (showtimeData.available === false){
                    tr.style.backgroundColor = "#ffbebe"
                }else{
                    tr.style.backgroundColor = "#c6ffbe"
                }
                table.appendChild(tr)
                roundTotal += ticketsSold
                total += ticketsSold
            }
            roundtotaltd.innerText = `Round Total: ${roundTotal}`
        }
        let tr = document.createElement('tr')
        let td = document.createElement('td')
        td.innerText = `Total: ${total}`
        td.classList.add('round-tr')
        tr.appendChild(document.createElement('td'))
        tr.appendChild(document.createElement('td'))
        tr.appendChild(document.createElement('td'))
        tr.appendChild(document.createElement('td'))
        tr.appendChild(td)
        table.appendChild(tr)
    }
}

function getSelectedDate(){
    let date = document.querySelector('#date-selector').value
    let year = date.split("-")[0]
    let month = date.split("-")[1]
    let day = date.split("-")[2]
    let rewrittenDate = `${year}-${month}-${day}`
    return rewrittenDate
}

function convertTimeToMinutes(time){
    let startInMinutes = 0
    if (time.includes('pm') && time.split(':')[0] !== '12'){
        let hour = parseInt(time.split(':')[0])
        let minutes = parseInt(time.split(':')[1].split(' ')[0])
        startInMinutes = (hour + 12) * 60 + minutes
    }else{
        let hour = parseInt(time.split(':')[0])
        let minutes = parseInt(time.split(':')[1].split(' ')[0])
        startInMinutes = hour * 60 + minutes
    }
    return startInMinutes
}