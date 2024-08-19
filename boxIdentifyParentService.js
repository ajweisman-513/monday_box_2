import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const determineNewBoxParentFolder = (boardId, locationName) => {

    // Get the __dirname equivalent in ES modules
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    // Determine the correct path based on the environment
    const mapPath = process.env.NODE_ENV === 'production' 
        ? '/etc/secrets/folderMap.json' 
        : path.join(__dirname, 'config/folderMap.json');
    const folderMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));

    const { folderIds, parentFolderMap, mondayBoardIds } = folderMap;

    const boardIdStr = String(boardId);
   
    let parentFolderId;
    // Check if the board is "candidates" or "inactive"
    if (boardIdStr === mondayBoardIds.candidates || boardIdStr === mondayBoardIds.inactive) {
        const key = boardIdStr === mondayBoardIds.candidates ? 'candidates' : 'inactive';
        parentFolderId = folderIds[key];
    } else if (boardIdStr === mondayBoardIds.active) {
        const parentKey = parentFolderMap[locationName];
        parentFolderId = folderIds[parentKey];
    };

    return parentFolderId;
};
