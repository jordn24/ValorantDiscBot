const axios = require('axios').default;

async function getMMRData(display_name, tag) {
    return axios({
        method: 'get',
        url:'https://api.henrikdev.xyz/valorant/v1/mmr/ap/'+ display_name + '/' + tag
    })
        .then( response =>  {
            // console.log(response["data"].data.currenttierpatched.split(' ')[0].toLowerCase())
            return response["data"].data.currenttierpatched.split(' ')[0].toLowerCase()
        })
        .catch(error =>
        {
            // console.log("Failed")
            return "Failed"
        })
}

module.exports = {getMMRData}