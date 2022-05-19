const { GoogleSpreadsheet } = require('google-spreadsheet');
const { getMMRData } = require('./valorant');
const creds = require('./valorant-bot-350702-2e703acc443c.json')

const doc = new GoogleSpreadsheet('1-UWf555xny_l7Rvoiitk77R0ORt0Z0K7fRYPFOxYZXE');

async function getAccs(){
    await doc.useServiceAccountAuth(creds);
    
    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[0]
    
    const rows = await sheet.getRows();

    var accs = [];

    for(var i = 0; i < rows.length; i++){
        accs.push(
            {
                "display_name": rows[i]._rawData[0],
                "tag": rows[i]._rawData[1],
                "user": rows[i]._rawData[2],
                "password": rows[i]._rawData[3],
                "last_played": rows[i]._rawData[4],
                "date_used": new Date(rows[i]._rawData[5]),
                "rank": await getMMRData(rows[i]._rawData[0], rows[i]._rawData[1])
            }
        )
    }
   
    return accs
}

async function updateAcc(last_played, date_used, display_name){
    await doc.useServiceAccountAuth(creds);
    
    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[0]
    
    await sheet.loadCells();

    const rows = await sheet.getRows();
    var rowNumber;

    rows.forEach( (row) => {
        if(row._rawData[0] == display_name){
            rowNumber = row.rowNumber - 1
        }
    })

    if(!rowNumber){
        return false
    }

    const last_played_cell = sheet.getCell(rowNumber, 4)
    const last_used_cell = sheet.getCell(rowNumber, 5)

    last_played_cell.value = last_played
    last_used_cell.value = date_used.toString()
    
    await sheet.saveUpdatedCells();
    
    return true
}

module.exports = {getAccs, updateAcc}