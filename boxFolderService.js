import axios from 'axios';
import createBoxClient from './httpClients/boxHttpClient.js';
import { determineNewBoxParentFolder } from './boxIdentifyParentService.js';
import { processFolderName } from './helpers/boxFolderNameService.js';
import { loadConfig } from './utils/loadConfig.js';

export const getFolderById = async (client, folderId) => {
    try {
        return await client.get(`/folders/${folderId}`);
    } catch (error) {
        console.error('Folder not found:', error);
        return false;
    }
};

export const createFolderInBox = async (candidateName) => {
    try {
        const client = await createBoxClient();
        const newFolderName = processFolderName(candidateName);

        const folderMapConfig = loadConfig('folderMap.json');
        const candidateFolderId = folderMapConfig.boxFolderIds.candidates;
        const parentFolderExists = await getFolderById(client, candidateFolderId);

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

export const updateParentFolderId = async (mondayBoardId, boxChildFolderId, locationName) => {
    try {
        const client = await createBoxClient();
        const folderExists = await getFolderById(client, boxChildFolderId);

        if (!folderExists) {
            console.error(`During updateParentFolderId folder does not exist, or app not set as editor.`);
            return res.status(200).send({ error: 'Parent folder does not exist or app not set as editor.' });
        }

        const updatedParentFolderId = determineNewBoxParentFolder(mondayBoardId, locationName);
        const response = await client.put(`/folders/${boxChildFolderId}`, {
            parent: { id: updatedParentFolderId }
        });

        return {
            boxFolderName: response.data.name,
            modified_at: response.data.modified_at,
            newParent: response.data.parent
        }
    } catch (error) {
        console.error('Error updating folder parent in Box:', error);
        return null;
    }
};