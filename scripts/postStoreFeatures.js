require('es6-promise').polyfill();
require('isomorphic-fetch');

const moment = require('moment');
const csv = require('csv-parser')
const fs = require('fs')

const args = process.argv.slice(2)
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

var storeFeatures = []
fs.createReadStream(dir + '/store_features.csv')
  .pipe(csv())
  .on('data', function(data){
    storeFeatures.push(data)
  })
  .on('end',function() {
    mapStoreFeatures(storeFeatures)
  });



function mapStoreFeatures(data) {
  data.forEach((store, index) => {
    if (!store.feature_ids) { return } 
    setTimeout(function(){
      postToV3(store.number, store.feature_ids);
      console.log(index)
    }, index * 1000);
  });
}


async function postToV3(store_number, features) {
  let storeEndpoint = apiEndpoint + "/api/v3/admin/stores/" + store_number + "/?store_number=true&api_key="
  let parsedFeatures = JSON.parse(features);

  let settings = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', },
    body: JSON.stringify({"store":{"feature_ids": parsedFeatures}})
  }

  try {
    let response = await fetch(storeEndpoint, settings)
    console.log("Posting Features to " + store_number);
  }
  catch(e) {
   console.log('Error!', e);
  }
}


