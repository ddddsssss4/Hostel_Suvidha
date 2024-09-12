import aws from 'aws-sdk';
import fs from 'fs';
import {ApiError} from './ApiError.js';
import { FaceMetaData } from '../models/faceMetaData.js';
aws.config.update({
    region: 'us-east-1',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID
})

const rekognition = new aws.Rekognition();


rekognition.listCollections({}, (err, data) => {
  if (err) {
    console.log('Error:', err.stack); // Logs any errors
  } else {
    console.log('Success:', data); // Logs success if connection works
  }
});
const compareFaces = async (image1Bytes) => {
    const params = {
        CollectionId: 'face-collection-id', 
        Image: {
            Bytes: image1Bytes,
        },
        MaxFaces: 1 
    };

    try {
        const rekognitionResponse = await rekognition.searchFacesByImage(params).promise();

        
        console.log(rekognitionResponse.FaceMatches);
        if (rekognitionResponse.FaceMatches.length === 0) {
            return res.status(404).json(new ApiError(404, "No matching face found"));
        }

       
        const registrationNumber = rekognitionResponse.FaceMatches[0].Face.ExternalImageId;

       
        const faceMetaData = await FaceMetaData.findOne({ registrationNumber: registrationNumber });

        if (!faceMetaData) {
            return res.status(404).json(new ApiError(404, "No person data found for this face ID"));
        }

       
        return{name: faceMetaData.name, registrationNumber: faceMetaData.registrationNumber};

    }catch(e){
        throw new ApiError(400, e.message);
    }
    
}
const s3 = new aws.S3();

const uploadAndIndexImage=async(image,name,registrationNumber)=>{
    console.log(image);
    const params={
        Bucket:process.env.AWS_BUCKET_NAME,
        Key:`images/${name}-${Date.now()}.jpg`,
        Body:image
    }
    const s3Data = await s3.upload(params).promise();
    const rekognitionParams = {
        CollectionId: 'face-collection-id',
        Image: {
          S3Object: {
            Bucket: s3Data.Bucket,
            Name: s3Data.Key
          }
        },
        ExternalImageId: registrationNumber
      };
      const indexData = await rekognition.indexFaces(rekognitionParams).promise();

  // Store metadata in MongoDB
  const faceId = indexData.FaceRecords[0].Face.FaceId;
  const metadata = new FaceMetaData({
    faceId: faceId,
    name: name,
    registrationNumber: registrationNumber
  });

  await metadata.save();
  return {success: true};
    
}
export {compareFaces,uploadAndIndexImage};

