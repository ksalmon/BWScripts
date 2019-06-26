require('es6-promise').polyfill();
require('isomorphic-fetch');
var mkdirp = require('mkdirp');
var createCsvWriter = require('csv-writer').createObjectCsvWriter;


const dir = '../data/saksfifth/production'
var totalUsers = []
fetch('https://saks-admin.brickworksoftware.com/api/v3/admin/users?query[start_date]=2016-01-01&api_key=aMU__MUKTSzUisreTvdG')
  .then(function(response) {
    if (response.status >= 400) {
      throw new Error("Bad response from server");
    }
    return response.json();
  })
  .then(function(data) {
    totalUsers.push(data)
    collectData(data.users);
    if (data.meta.links.next !== null) {

    }
  });


function collectData(users) {
  let data = []
  for(var i=0; i<users.length; i++) {
    let bwUser = users[i]
    let user = {
      id: bwUser.id,
      store_id: bwUser.store_id,
      first_name: bwUser.first_name,
      last_name: bwUser.last_name,
      role: bwUser.role,
      email: bwUser.email,
    }
    data.push(user)

  } 
  printToCSV(data);
}

function printToCSV(data) {
  mkdirp(dir, function(err) { 
    if (err) console.error(err)
  });

  const csvWriter = createCsvWriter({
    header: [
        {id: 'id', title: 'id'},
        {id: 'store_id', title: 'store_id'},
        {id: 'first_name', title: 'first_name'},
        {id: 'last_name', title: 'last_name'},
        {id: 'role', title: 'role'},
        {id: 'email', title: 'email'},
    ],
    append: false,
    path: dir + '/users.csv'
  });
    
  csvWriter.writeRecords(data)
    .then(() => {
      console.log('...Done');
    });
}