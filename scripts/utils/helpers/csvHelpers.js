const fs = require('fs');
const mkdirp = require('mkdirp');
const write = require('csv-writer').createObjectCsvWriter
const parse = require('csv-parser')


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

const readCsv = (dir) => {
    let data = []
    fs.createReadStream(dir)
    .pipe(parse())
    .on('data', (row) => {
        try {
            data.push(row)
        }
        catch(err) {
            console.log(err)
        }
    })
    .on('end', () => {
        return data
    })
}

const csvWriter = (data, append, filename, directory) => {
    let keys = createHeaders(data)

    const writer = write({
        header: keys,
        append: append,
        path: directory
    })

    writer.writeRecords(data).then(() => console.log(filename + ' successfuly written to ' + directory))
}

module.exports = {
    clientDirectory,
    writeDirectory,
    createHeaders,
    readCsv,
    csvWriter
}