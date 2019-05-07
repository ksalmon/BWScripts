const fs = require('fs');
const mkdirp = require('mkdirp');

// Sets directory
const clientDirectory = (company, env, filename = null) => {
    let dir = 'data/' + company + '/' + env + '/';
    if(filename) {
        dir += filename
    }
    return dir
}

// Checks if the directory exists
const directoryCheck = (dir) => {
    if(!fs.existsSync(dir)) {
        mkdirp(dir)
        console.log('Directory successfully created')
    }
}

module.exports = {
    clientDirectory,
    directoryCheck,
}