const fs = require('fs');
const mkdirp = require('mkdirp');


// Sets directory
const clientDirectory = (company, env, filename = null) => {
    let dir = 'data/' + company.split(' ').join('_') + '/' + env.toLowerCase() + '/';
    let path = 'data/' + company.split(' ').join('_') + '/' + env.toLowerCase();
    writeDirectory(path)
    if(filename) {
        dir += filename
    }
    return dir
}

// Checks if the directory exists
const writeDirectory = (path) => {
    if(!fs.existsSync(path)) {
        mkdirp(path)
        console.log('Directory successfully created')
    }
}

const createHeaders = (data) => {
    let keys = []
    Object.keys(data[0]).forEach(x => {
      keys.push({id: x, title: x})
    });

    return keys
}

module.exports = {
    clientDirectory,
    writeDirectory,
    createHeaders
}