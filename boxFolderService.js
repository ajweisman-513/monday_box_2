import createClient from './boxHttpClient.js';
import { processFolderName } from './candidateService.js';

const parentFolderId = process.env.BOX_CANDIDATE_FOLDER_ID;

const checkParentFolder = async (client, folderId) => {
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
        const folderName = processFolderName(candidateName);
        const client = await createClient();
        const parentFolderExists = await checkParentFolder(client, parentFolderId);

        if (!parentFolderExists) {
            console.error('Cannot access folder: Parent folder does not exist, or app not set as editor.');
            return;
        }
        const newFolder = await client.post('/folders', {
            name: folderName,
            parent: { id: parentFolderId }
        });

        console.log('Folder created:', newFolder.data);
    } catch (error) {
        console.error('Error creating folder in Box:', error);
    }
};
