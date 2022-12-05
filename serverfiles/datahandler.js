const json = require("json-toolkit")
const JSONR = json.Resource

async function getSavedShowingDetails(date){
    let job = new JSONR("storage.json", {
        from_file: true,
        pretty_output: true
    });
    
}

module.export = {getSavedShowingDetails}