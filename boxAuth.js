import axios from 'axios';
import crypto from 'crypto';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import querystring from 'querystring';

const environment = process.env.NODE_ENV || 'development'; // Default to 'development' if NODE_ENV is not set
console.log(`Running in ${environment} mode`);

const configPath = process.env.NODE_ENV ? "/etc/secrets/boxConfig.json" : "boxConfig.json";

const config = JSON.parse(
  fs.readFileSync(configPath)
);

const authenticate = async () => {
  let key = {
    key: config.boxAppSettings.appAuth.privateKey,
    passphrase: config.boxAppSettings.appAuth.passphrase
  };

  const authenticationUrl = 'https://api.box.com/oauth2/token';

  let claims = {
    'iss': config.boxAppSettings.clientID,
    'sub': config.enterpriseID,
    'box_sub_type': 'enterprise',
    'aud': authenticationUrl,
    'jti': crypto.randomBytes(64).toString('hex'),
    'exp': Math.floor(Date.now() / 1000) + 45
  };

  let keyId = config.boxAppSettings.appAuth.publicKeyID;

  let assertion = jwt.sign(claims, key, {
    'algorithm': 'RS512',
    'keyid': keyId,
  });

  let accessToken = await axios.post(
    authenticationUrl, 
    querystring.stringify({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: assertion,
      client_id: config.boxAppSettings.clientID,
      client_secret: config.boxAppSettings.clientSecret
    })
  )
  .then(response => response.data.access_token)
  .catch(error => {
    console.error('Error authenticating:', error);
    throw new Error('Authentication failed');
  });

  return accessToken;
};

export default authenticate;
