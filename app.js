
const webscraper = require('./serverfiles/webscraper.js');

const express = require('express');
const app = express();
const PORT = 80;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// make get request that takes a date with format 2022-12-05 and returns a json object with all the showtimes for that day
app.get('/showtimes/:date', async (req, res) => {
  let date = req.params.date;
  let showtimes = await webscraper.getCompiledShowtimeData(date);
  res.json(showtimes);
});

app.use(express.static('./public'));

app.listen(PORT, () => {
  console.log(`Server running at PORT:${PORT}/`);
});


