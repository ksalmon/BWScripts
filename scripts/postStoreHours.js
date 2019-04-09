require('es6-promise').polyfill();
require('isomorphic-fetch');

const moment = require('moment');
const csv = require('csv-parser')
const fs = require('fs')

// const inquirer = require('inquirer');

// var questionsPrompt = [
//   { type: 'input', name: 'company', message: 'Which company would you like to load store hours for?' },
//   { type: 'input', name: 'enviroment', message: 'Which enviroment?' },
//   { type: 'input', name: 'api_key', message: 'Enter a valid API key' },
// ];

// function init(a) {
//   console.log('Before you run the script be sure the add a CSV file named store-hours-upload.csv in the proper client directory');
//   getAnswers();
// }

// function getAnswers() {
//   inquirer.prompt(questionsPrompt)
//     .then(answers => {
      
//     });
// }

// console.log(answers)

var args = process.argv.slice(2)

if (args.length < 2) {
  console.log("Please pass both company slug and envo!")
  process.exit()
}

const company = args[0];
const envo =  args[1];
const dir = '../data/' + company + '/' + envo

const apiEndpoint = constructFetchUrl(args)

function constructFetchUrl(args) {
  let fetchUrl = ''
  fetchUrl += 'https://' + company
  if (envo !== 'production') {
    fetchUrl += '-' + envo 
  } 
  fetchUrl += '.brickworksoftware.com'
  return fetchUrl
}

const storeHours = [];

fs.createReadStream(dir + '/store-hours-upload.csv')
  .pipe(csv())
  .on('data', function(data){
    storeHours.push(data)
  })
  .on('end',function() {
    mapStoreHours(storeHours)
  });



function mapStoreHours(data) {
  data.forEach((store, index) => {
    let storeHours = []
    for(var i=0; i<7; i++) {
      var mapDay = weekdaysBrickwork(i, store);
      var storeHourRange = {
        day_of_week: i,
        start_time: formatTime(mapDay.startTime),
        end_time: formatTime(mapDay.endTime),
      }
      if (storeHourRange.start_time !== "Invalid date" && storeHourRange.end_time !== "Invalid date") {
        let range = { regular_hour: storeHourRange }
        setTimeout(function(){
          postToV3(store, range);
        }, index * 750);
        console.log("Loading Hours:"  + store.number)
      } else {
        console.log("Skipping day of week number"  + storeHourRange.day_of_week +  "for store"  + store.number);
      }
    }
  });
}

function weekdaysBrickwork(index, store) {
  var weekdays = {
    1: {startTime: store.monday_start_time, endTime: store.monday_end_time},
    2: {startTime: store.tuesday_start_time, endTime: store.tuesday_end_time},
    3: {startTime: store.wednesday_start_time, endTime: store.wednesday_end_time},
    4: {startTime: store.thursday_start_time, endTime: store.thursday_end_time},
    5: {startTime: store.friday_start_time, endTime: store.friday_end_time},
    6: {startTime: store.saturday_start_time, endTime: store.saturday_end_time},
    0: {startTime: store.sunday_start_time, endTime: store.sunday_end_time},
  };

  return weekdays[index]
}


// Public Functions
function formatTime(time) {
  let unfomattedTime = time.replace(/ /g,'')
  let formattedTime = moment(unfomattedTime, "h:mm A").format("h:mmA")
  return formattedTime;
}

async function postToV3(store, range) {
  let storeEndpoint = apiEndpoint + "/api/v3/admin/stores/" + store.number + "/regular_hours/?store_number=true&api_key="
  let parsedRange = JSON.stringify(range) 
  let settings = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', },
    body: parsedRange
  }

  try {
    let response = await fetch(storeEndpoint, settings)
  }
  catch(e) {
   console.log('Error!', e);
  } 
}


