const path = require('path');
const fs = require('fs');

module.exports =  {
    upload : (FILE) => {
    const file = FILE;
    const storeDirectory = path.join(path.dirname(require.main.filename), process.env.STATIC_RESOURCES_DIRECTORY, process.env.GALLERY_STORE_LOCATION);
    const url = path.join(process.env.GALLERY_STORE_LOCATION, file.filename) + path.extname(file.originalname);
    const storePath = path.join(storeDirectory, file.filename) + path.extname(file.originalname);


    fs.existsSync(storeDirectory) || fs.mkdirSync(storeDirectory);
    const content = fs.readFileSync(file.path);
    fs.writeFileSync(storePath, content, {flag:'w+'});

    return url;

    }   
}
