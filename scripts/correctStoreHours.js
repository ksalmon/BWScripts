require('es6-promise').polyfill();
require('isomorphic-fetch');


fetch('//justice-uat.brickworksoftware.com/api/v3/stores?x-bw-cache-buster='+Math.random())
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
  counter = 0
  for(var i=0; i<stores.length; i++) {
    let bwStore = stores[i]

    if (bwStore.regular_hours.length <= 6) {
      console.log(bwStore.regular_hours.length, bwStore.name, bwStore.number)
      counter += 1
    }
  } 
  console.log(counter)
}