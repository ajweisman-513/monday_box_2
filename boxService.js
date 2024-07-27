import axios from 'axios';
import dotenv from 'dotenv';
import crypto from 'crypto';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import querystring from 'querystring';
import { response } from 'express';

dotenv.config();

const parentFolderId = process.env.BOX_CANDIDATE_FOLDER_ID;

const config = JSON.parse(
  fs.readFileSync('config.json')
)

// const config = {
//     boxAppSettings: {
//       clientID: process.env.BOX_CLIENT_ID,
//       clientSecret: process.env.BOX_CLIENT_SECRET,
//       appAuth: {
//         publicKeyID: process.env.BOX_PUBLIC_KEY_ID,
//         privateKey: process.env.BOX_PRIVATE_KEY,
//         passphrase: process.env.BOX_PASSPHRASE
//       }
//     },
//     enterpriseID: 365398
// }

const authenticate = async () => {
    // In node we don't need to manually decrypt the
  // key, as the JWT library can handle this for us
  let key = {
    key: config.boxAppSettings.appAuth.privateKey,
    passphrase: config.boxAppSettings.appAuth.passphrase
  }

  // We will need the authenticationUrl  again later,
  // so it is handy to define here
  const authenticationUrl = 'https://api.box.com/oauth2/token'

  let claims = {
    'iss': config.boxAppSettings.clientID,
    'sub': config.enterpriseID,
    'box_sub_type': 'enterprise',
    'aud': authenticationUrl,
    // This is an identifier that helps protect against
    // replay attacks
    'jti': crypto.randomBytes(64).toString('hex'),
    // We give the assertion a lifetime of 45 seconds 
    // before it expires
    'exp': Math.floor(Date.now() / 1000) + 45
  }

  let keyId = config.boxAppSettings.appAuth.publicKeyID

  // Rather than constructing the JWT assertion manually, we are 
  // using the jsonwebtoken library.
  let assertion = jwt.sign(claims, key, {
    // The API support "RS256", "RS384", and "RS512" encryption
    'algorithm': 'RS512',
    'keyid': keyId,
  })

  // We are using the excellent axios package 
  // to simplify the API call
  let accessToken = await axios.post(
    authenticationUrl, 
    querystring.stringify({
      // This specifies that we are using a JWT assertion
      // to authenticate
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      // Our JWT assertion
      assertion: assertion,
      // The OAuth 2 client ID and secret
      client_id: config.boxAppSettings.clientID,
      client_secret: config.boxAppSettings.clientSecret
    })
  )
  // Extract the access token from the API response
  .then(response => response.data.access_token)
  .catch(error => {
    console.error('Error authenticating:', error);
    throw new Error('Authentication failed');
  });

  return accessToken;
};

// const checkParentFolderExists = async (client, parentFolderId) => {
//     try {
//       console.log('parentFolderId', parentFolderId)
//         await client.get(parentFolderId);
//         return true;
//     } catch (error) {
//         console.error('Parent folder not found:', error);
//         return false;
//     }
// };

export const createFolderInBox = async (folderName) => {
    try {
        const accessToken = await authenticate();
      
        const client = axios.create({
            baseURL: 'https://api.box.com/2.0',
            headers: { 
              'Authorization': `Bearer ${accessToken}`,
            }
        });

        // const parentFolderExists = await checkParentFolderExists(client, parentFolderId);

        // if (!parentFolderExists) {
        //     console.error('Cannot create folder: Parent folder does not exist.');
        //     return;
        // }

        const newFolder = await client.post('/folders', {
            name: folderName,
            parent: { id: parentFolderId }
        });

        console.log('Folder created:', newFolder.data);
    } catch (error) {
        console.error('Error creating folder in Box:', error);
    }
};