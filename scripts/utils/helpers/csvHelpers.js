const fs = require('fs');
const mkdirp = require('mkdirp');
const dirname = require('path').dirname


// Sets directory
const clientDirectory = (company, env, filename = null) => {
    let dir = 'data/' + company + '/' + env.toLowerCase() + '/';
    let path = 'data/' + company + '/' + env.toLowerCase();
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

module.exports = {
    clientDirectory,
    writeDirectory,
}