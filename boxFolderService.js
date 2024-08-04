import axios from 'axios';
import createBoxClient from './boxHttpClient.js';
import { processFolderName } from './boxFolderNameService.js';

const candidateFolderId = process.env.BOX_CANDIDATE_FOLDER_ID;

const verifytFolderExists = async (client, folderId) => {
    try {
        await client.get(`/folders/${folderId}`);
        return true;
    } catch (error) {
        console.error('Parent folder not found:', error);
        return false;
    }
};

export const createFolderInBox = async (candidateName, res) => {
    try {
        const newFolderName = processFolderName(candidateName);
        const client = await createBoxClient();
        const parentFolderExists = await verifytFolderExists(client, candidateFolderId);

        if (!parentFolderExists) {
            console.error('Cannot access folder: Parent folder does not exist, or app not set as editor.');
            return res.status(400).send({ error: 'Parent folder does not exist or app not set as editor.' });
        }

        const newFolder = await client.post('/folders', {
            name: newFolderName,
            parent: { id: candidateFolderId }
        });
        return newFolder.data.id;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response && error.response?.data?.status === 409) {
            console.warn('Folder already exists:', error.response.data.status);
            return 'error409'
        } else {
            console.error('Error creating folder in Box222:', error);
            return res.status(500).send({ error: 'Internal server error when creating folder in Box.' });
        }
    }
};

export const updateParentFolderId = async (folderId, newParentFolderId) => {
    const client = await createBoxClient();
    const folderExists = await verifytFolderExists(client, folderId);

    if (!folderExists) {
        console.error('Specified folder does not exist or cannot be accessed.');
        return null;
    }

    try {
        const response = await client.put(`/folders/${folderId}`, {
            parent: { id: newParentFolderId }
        });
        return response.data; // Return the updated folder's ID
    } catch (error) {
        console.error('Error updating folder parent in Box:', error);
        return null;
    }
};