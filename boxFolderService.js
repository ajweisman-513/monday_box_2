import createClient from './boxHttpClient.js';
import { processFolderName } from './candidateService.js';

const candidateFolderId = process.env.BOX_CANDIDATE_FOLDER_ID;

const verifyParentFolder = async (client, folderId) => {
    try {
        await client.get(`/folders/${folderId}`);
        return true;
    } catch (error) {
        console.error('Parent folder not found:', error);
        return false;
    }
};

export const createFolderInBox = async (candidateName) => {
    try {
        const newFolderName = processFolderName(candidateName);
        const client = await createClient();
        const parentFolderExists = await verifyParentFolder(client, candidateFolderId);

        if (!parentFolderExists) {
            console.error('Cannot access folder: Parent folder does not exist, or app not set as editor.');
            return;
        }
        const newFolder = await client.post('/folders', {
            name: newFolderName,
            parent: { id: candidateFolderId }
        });
        return newFolder.data.id;
    } catch (error) {
        console.error('Error creating folder in Box:', error);
    }
};
