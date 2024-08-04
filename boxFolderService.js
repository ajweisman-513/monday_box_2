import createClient from './boxHttpClient.js';
import { processFolderName } from './boxFolderNameService.js';

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
            return null;
        }

        try {
            const newFolder = await client.post('/folders', {
                name: newFolderName,
                parent: { id: candidateFolderId }
            });
            return newFolder.data.id;
        } catch (error) {
            if (error.response && error.response.status === 409) { // Handle "name already exists" error
                console.warn(`Folder "${newFolderName}" already exists. Retrieving existing folder ID.`);
                const existingFolder = await client.get('/folders', {
                    params: {
                        parent_id: candidateFolderId,
                        name: newFolderName
                    }
                });
                return existingFolder.data.entries[0].id; // Return the ID of the existing folder
            } else {
                throw error; // Rethrow other errors
            }
        }
    } catch (error) {
        console.error('Error creating folder in Box:', error);
        return null;
    }
};