console.log('loaded!')
document.querySelector('#date-selector').addEventListener('change', async (e) => {
    let date = getSelectedDate()
    let data = await fetchDataFromDate(date)
    updateTicketsSoldTable(data)

})
const hideUnavailableShows = document.querySelector('#hide-unavailable-shows')
hideUnavailableShows.addEventListener('change', async(e) => {
    let date = getSelectedDate()
    let data = await fetchDataFromDate(date)
    for (let movie in data){
        for (let showtime in data[movie]){
            if (data[movie][showtime].available === false){
                if (e.target.checked){
                    delete data[movie][showtime]
                }
            }
        }
    }
    updateTicketsSoldTable(data)
})

const table = document.querySelector('#sales-table')
async function fetchDataFromDate(date){
    let fetched = await fetch(`/showtimes/${date}`)
    let data = null
    try{
        data = await fetched.json()
    }catch{console.log(`no data for ${date}`)}
    return data
}

function updateTicketsSoldTable(data){
    while (table.childNodes.length > 2) {
        table.removeChild(table.lastChild);
    }
    let sales = 0
    for (let movie in data){
        let title = movie
        for (let showtime in data[movie]){
            let tr = document.createElement('tr')
            let movietd = document.createElement('td')
            let starttimetd = document.createElement('td')
            let theatertd = document.createElement('td')
            let ticketstd = document.createElement('td')
            let salesavailabletd = document.createElement('td')
            movietd.innerText = title || "No Data"
            starttimetd.innerText = showtime || "No Data"
            theatertd.innerText = data[movie][showtime].theater || "No Data"
            ticketstd.innerText = data[movie][showtime].ticketsSold
            sales+=data[movie][showtime].ticketsSold
            salesavailabletd.innerText = data[movie][showtime].available
            tr.appendChild(movietd)
            tr.appendChild(starttimetd)
            tr.appendChild(theatertd)
            tr.appendChild(ticketstd)
            tr.appendChild(salesavailabletd)
            table.appendChild(tr)
        }    
    }
    let tr = document.createElement('tr')
    let totaltitle = document.createElement('td')
    totaltitle.innerText = 'Total'
    let totalsales = document.createElement('td')
    totalsales.innerText = sales
    tr.appendChild(totaltitle)
    tr.appendChild(totalsales)
    table.appendChild(tr)
}

function getSelectedDate(){
    let date = document.querySelector('#date-selector').value
    let year = date.split("-")[0]
    let month = date.split("-")[1]
    let day = date.split("-")[2]
    let rewrittenDate = `${year}-${month}-${day}`
    return rewrittenDate
}