const axios = require("axios");
const fs = require("fs");

async function sendMessage() {
    let prompt = fs.readFileSync("training_text.txt");
    prompt = prompt + "\nUser: Hello."
    const url = 'https://api.openai.com/v1/engines/davinci/completions';
    const params = {
      "prompt": prompt,
      "max_tokens": 160,
      "temperature": 0.1,
      "stop":["User: "]
    };
    const headers = {
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_SECRET_KEY}`
        }
    };
  
    try {
      const response = await axios.post(url, params, {headers: headers});
      output = response.data.choices[0].text
    //   output = `${prompt}${response.choices[0].text}`;
    //   console.log(output);
    } catch (err) {
      console.log(err);
    }
}

async function loadAsyncAPI() {
    //Async API Load
    const asyncMasterID = '256'
    const headers = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    const body = JSON.stringify({
        query: `{
            master(id:${asyncMasterID}){
                owner
                lastSale {
                    timestamp
                }
                layers {
                    levers {
                        currentValue
                    }
                    owner {
                        id
                    }
                }
            }
        }`
    })
    const res = await axios.post(`https://api.thegraph.com/subgraphs/name/asyncart/async-art`, body, headers);
    console.log(res.data.data.master)
    // console.log("Master:")
    // layers = [];
    // for (let layer of res.data.data.master.layers) {
    //     console.log("\tLayer:")
    //     console.log("\t\tOwner: " + layer.owner.id)
    //     console.log("\t\tValue: " + layer.levers[0].currentValue)
    //     layers.push({
    //         owner: layer.owner.id,
    //         state: layer.levers[0].currentValue
    //     })
    // }
    // return layers
}

// sendMessage()
loadAsyncAPI().then((data)=>console.log(data))