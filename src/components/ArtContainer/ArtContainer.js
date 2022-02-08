import React, { useState, useEffect } from "react";
import axios from "axios";
import crypto from "crypto";
import TextContainer from '../TextContainer/TextContainer' ;
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import { API, graphqlOperation } from 'aws-amplify';
import CookieConsent from "react-cookie-consent";
// import CookieConsent, { Cookies } from "react-cookie-consent";
import AWS from 'aws-sdk';


const ArtContainer = ({ name, messages }) => {

    let [img, setImg] = useState();
    
    const get_s3_url = () => {
        const config = {
            apiVersion: "latest",
            credentials:{
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                accessSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
            region: "us-east-1"
        }
        AWS.config.update(config);
        var s3 = new AWS.S3(config);
        var params = {Bucket: 'convo-images', Key: `${name}.png`, Expires: 60};
        var url = s3.getSignedUrl('getObject', params);
        console.log('The URL is', url); // expires in 60 seconds
        return url
    }

    const uploadFileToS3 = (presignedPostData, file) => {
        // create a form obj
        const formData = new FormData();
        
        // append the fields in presignedPostData in formData            
        Object.keys(presignedPostData.fields).forEach(key => {
                      formData.append(key, presignedPostData.fields[key]);
                    });           
        
        // append the file
        formData.append("file", file.src);
        
        // post the data on the s3 url
        axios.post(presignedPostData.url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
         }              
         }).then(function (response) {
           console.log(response);
          })
           .catch(function (error) {
            console.log(error);
         });            
        
        };
    const putToS3 = async (fileObject, presignedUrl) => {
        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": fileObject.type,
            },
            data: fileObject,
        };
        const response = await fetch(presignedUrl, requestOptions);
        return await response;
      }

    const generate = () => {
        console.log("generate")
        endpoint = "ec2-52-7-111-32.compute-1.amazonaws.com:5000/generate"
        const prompt = messages.slice(1)
                               .map((e) => {return e.text})
                               .join(" ^ ")
        axios.post(endpoint, {"name": name, "prompt": prompt})
    }
    
    const random = () => {
        console.log(messages)
    }

    return (
    <div className="outerContainer">
        <input type="text"></input>  
        <button onClick={generate}>Draw</button>
        <br></br>
        <button onClick={random}>Random</button>
        <br></br>
        <button onClick={get_s3_url}>get s3</button>
    </div>
    );
}

export default ArtContainer;
