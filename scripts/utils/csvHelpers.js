// Api Root Helpers
const clientDirectory = (company, envo, filename = null ) => {
  let dir = 'data/' + company + '/' + envo;
  if (filename) {
    dir += filename
  }
  return dir
}

module.exports = {
  clientDirectory
};