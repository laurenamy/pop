require('dotenv').config()
const key = process.env.REACT_APP_PINATA_KEY
const secret = process.env.REACT_APP_PINATA_SECRET

const axios = require('axios');

export const pinJSONToIPFS = async (body) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`

    try {
      const res = await axios.post(url, body, {
        headers: {
          pinata_api_key: key,
          pinata_secret_api_key: secret
        }
      })

      return { 
        success: true,
        pinataUrl: "https://gateway.pinata.cloud/ipfs" + res.data.IpfsHash
      }
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: err.message
      }
    }

};