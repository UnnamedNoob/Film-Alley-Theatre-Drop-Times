// this file used to handle puppeteer in a separate process to avoid memory leaks and crashes 

const puppeteer = require('puppeteer')
const htmlparse = require('node-html-parser')

process.on("message", (message) => {
    getSeatingForShowing(message.url)
});


async function getSeatingForShowing(url){
    let browser
        try{
            browser = await puppeteer.launch({headless:true,args:["--no-sandbox"]});
            let page = await browser.newPage();
            await page.goto(url);
            try{
                await page.waitForSelector('.seat')
            }catch{
                console.warn("Ticket purchase disabled for showing, closing browser and process early")
                process.send({success:false, message:"Ticket purchase disabled"})
                await browser.close()
                return {success:false, message:"Ticket purchase disabled"}
            }
            let data = await page.evaluate(() => document.querySelector('*').outerHTML);    
            let parsedhtml = htmlparse.parse(data)
            let totalSeats = parsedhtml.querySelectorAll('.seat').length
            let soldSeats = parsedhtml.querySelectorAll('.unavailableSeat').length
            let brokenSeats = parsedhtml.querySelectorAll('.brokenSeat').length
            await browser.close();
            process.send({success:true,totalSeats,soldSeats,brokenSeats})
            return {success:true,totalSeats,soldSeats,brokenSeats}
    
        }catch(e){
            console.warn("Error when fetching seats")
            console.log(e)
            let data = await page.evaluate(() => document.querySelector('*').outerHTML);  
            console.log(data)
            process.send({success:false})
            await browser.close()
            return
        }
}
