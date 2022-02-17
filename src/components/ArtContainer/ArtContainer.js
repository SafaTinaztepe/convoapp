import React, { useState, useEffect } from "react";
import axios from "axios";
import { Storage } from 'aws-amplify';

const ArtContainer = ({ name, messages }) => {

    let [imgSrc, setImgSrc] = useState("");
    let [timeoutDone, setTimeoutDone] = useState(false);

    const generate = () => {
        
        // ^ character does not show up in body of post, send as array
        // Needs more feedback, let user know job has been scheduled
        // Skip welcome message
        let prompt = messages.slice(1).map((e) => e.text)
        let API_ENDPOINT = "http://ec2-52-7-111-32.compute-1.amazonaws.com:5000/generate"
        let data = {"name":name, "prompt": prompt}
        axios.post(API_ENDPOINT, data)
             .then((data) => console.log(data))
             .catch((err) => console.log(err))
    }

    useEffect(() => {
        if(!timeoutDone){
            setTimeout(() => {
                if(name && !imgSrc){
                    Storage.get(`img/${name}.png`)
                        .then((data) => {
                            console.log(data)
                            setImgSrc(data)
                            setTimeoutDone(true);
                        })
                }
            }, 1000)
        }
    })

    return (
    <div className="outerContainer">
        <input type="text"></input> 
        <img src={imgSrc} alt="img" />
        <button onClick={generate}>Draw</button>
    </div>
    );
}

export default ArtContainer;
