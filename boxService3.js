import axios from 'axios';
import dotenv from 'dotenv';
import qs from 'qs';

dotenv.config();

const clientID = process.env.BOX_CLIENT_ID;
const clientSecret = process.env.BOX_CLIENT_SECRET;
const userID = process.env.BOX_ALEX_USER_ID;  // Managed User ID
const parentFolderId = process.env.BOX_PARENT_FOLDER_ID;

let accessToken;

const authenticate = async () => {
    try {
        const response = await axios.post('https://api.box.com/oauth2/token', qs.stringify({
            grant_type: 'client_credentials',
            client_id: clientID,
            client_secret: clientSecret,
            box_subject_type: 'user',
            box_subject_id: userID
        }), {
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            }
        });
        //console.log('box response', response.data)
        accessToken = response.data.access_token;
        console.log('Authenticated successfully. Access token:', accessToken);
    } catch (error) {
        console.error('Error obtaining access token:', error.response ? error.response.data : error.message);
        throw error;
    }
};


const checkParentFolderExists = async () => {
    try {
        await client.folders.get(parentFolderId);
        return true;
    } catch (error) {
        console.error('Parent folder not found:', error);
        return false;
    }
};

export const createFolderInBox = async (folderName) => {
    authenticate()
};