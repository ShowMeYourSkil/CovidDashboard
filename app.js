const express = require('express');
 dotenvconf = require('dotenv').config(),
 api = require('novelcovid');
 path = require('path');
const app = express();

api.settings({
  baseUrl: 'https://disease.sh' | 'https://api.caw.sh' | 'https://corona.lmao.ninja'
})

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('./public'))

app.get('/', (req, res, next) => res.redirect('/global'))

app.get('/:country', async (req, res, next) => {
  const { country } = req.params
  let countries = (await api.countries({sort:'cases'}))
  let data = country.toLowerCase() === 'global' ? (await api.all()) : (await api.countries({country}))
  let yesterday = country.toLowerCase() !== 'global' ? await api.yesterday.countries({country}) : await api.yesterday.all()
  data.todayRecovered = data.recovered - yesterday.recovered
  data.todayActive = data.active - yesterday.active
  data.todayCritical = data.critical - yesterday.critical
  data.todayCasesPerOneMillion = data.casesPerOneMillion - yesterday.casesPerOneMillion
  data.todayDeathsPerOneMillion = data.deathsPerOneMillion - yesterday.deathsPerOneMillion
  data.todayTests = data.tests - yesterday.tests
  data.globalpopulation = data.globalpopulation -yesterday.globalpopulation
  res.render('index', { countries, data })
})




app.listen(8080, () => console.log('running on port 8080'));