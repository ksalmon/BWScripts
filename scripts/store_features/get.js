require('es6-promise').polyfill();
require('isomorphic-fetch');


fetch('//justice-uat.brickworksoftware.com/api/v3/stores')
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
  let data = []
  for(var i=0; i<stores.length; i++) {
    let bwStore = stores[i]

    if (bwStore.features.length >= 1) {
      let store = {
        number: bwStore.number,
        feature_ids: bwStore.features.map(x => x.id)
      }
      data.push(store)
    }
  } 
  // printToCSV(data);
  console.log(data);
}

function printToCSV(data) {
  mkdirp(dir, function(err) { 
    if (err) console.error(err)
  });

  const csvWriter = createCsvWriter({
    header: [
        {id: 'number', title: 'Number'},
        {id: 'feature_ids', title: 'Feature Ids'},
    ],
    append: false,
    path: dir + '/features.csv'
  });
    
  csvWriter.writeRecords(data)
    .then(() => {
      console.log('...Done');
    });
}