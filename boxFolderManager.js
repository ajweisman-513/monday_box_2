import createClient from './httpClient.js';

const parentFolderId = process.env.BOX_CANDIDATE_FOLDER_ID;

export const createFolderInBox = async (folderName) => {
    try {
        const client = await createClient();
        const newFolder = await client.post('/folders', {
            name: folderName,
            parent: { id: parentFolderId }
        });

        console.log('Folder created:', newFolder.data);
    } catch (error) {
        console.error('Error creating folder in Box:', error);
    }
};
