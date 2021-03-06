require('es6-promise').polyfill();
require('isomorphic-fetch');

var mkdirp = require('mkdirp');
var createCsvWriter = require('csv-writer').createObjectCsvWriter;
var moment = require('moment');

var args = process.argv.slice(2)

if (args.length < 2) {
  console.log("Please pass both company slug and envo!")
  process.exit()
}

const company = args[0];
const envo =  args[1];
const dir = '../data/' + company + '/' + envo

const fetchUrl = constructFetchUrl(args);

const startRangeOffset = 1
const endRangeOffset = -1

function constructFetchUrl(args) {
  let fetchUrl = ''
  fetchUrl += 'https://' + company
  if (envo !== 'production') {
    fetchUrl += '-' + envo 
  } 
  fetchUrl += '.brickworksoftware.com/api/v3/stores'
  return fetchUrl
}

let data = [];
fetch(fetchUrl)
  .then(function(response) {
    if (response.status >= 400) {
      throw new Error("Bad response from server");
    }
    return response.json();
  })
  .then(function(data) {
    collectData(data.stores);
  });


function collectData(stores) {
  for(var i=0; i<stores.length; i++) {
    let bwStore = stores[i]
    for(var s=0; s<bwStore.store_services.length; s++) {
      let bwStoreService = bwStore.store_services[s];
      for(var x=0; x<bwStore.regular_hours.length; x++) {
        let dataField = {
          day_of_week: mapV4(bwStore.regular_hours[x].day_of_week),
          start_time: formatStartRange(bwStore.regular_hours[x].display_start_time),
          end_time: formatEndTime(bwStore.regular_hours[x].display_end_time),
          avaliable: true,
          time_zone: bwStore.timezone,
          resourceUri: generateStoreServiceUri(bwStoreService)
        }
        data.push(dataField);
      }
    }
  } 
  printToCSV(data);
}


function formatStartRange(time) {
  if (time === null){ return; }
  let unfomattedTime = time.replace(/ /g,'')
  let formattedTime = moment(unfomattedTime, "h:mm A").add(startRangeOffset, 'hours').format("HH:mm:ss")
  return formattedTime;
}

function formatEndTime(time) {
  if (time === null){ return; }
  let unfomattedTime = time.replace(/ /g,'')
  let formattedTime = moment(unfomattedTime, "h:mm A").add(endRangeOffset, 'hours').format("HH:mm:ss")
  return formattedTime;
}

function generateStoreServiceUri(service) {
  let resourceUri = '';
  resourceUri += '/organizations/' + service.organization_nextgen_id + service.nextgen_uri;
  return resourceUri;
}

function mapV4(day_of_week) {
  if (day_of_week === 0) { return 7 } else {
    return day_of_week
  }
}

function printToCSV(data) {
  mkdirp(dir, function(err) { 
    if (err) console.error(err)
  });

  const csvWriter = createCsvWriter({
    header: [
        {id: 'day_of_week', title: 'Day Of Week'},
        {id: 'start_time', title: 'Start Time'},
        {id: 'end_time', title: 'End Time'},
        {id: 'avaliable', title: 'Available'},
        {id: 'time_zone', title: 'Time Zone'},
        {id: 'resourceUri', title: 'Resource Uri'},
    ],
    append: false,
    path: dir + '/service-hours.csv'
  });
    
  csvWriter.writeRecords(data)
    .then(() => {
      console.log('...Done');
    });
}