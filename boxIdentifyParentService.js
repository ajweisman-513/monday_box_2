import { loadConfig } from './utils/loadConfig.js';

export const determineNewBoxParentFolder = (boardId, locationName) => {

    const { mondayBoardIds, boxFolderIds, parentFolderMap } = loadConfig('folderMap.json');

    let parentId;

    if (boardId === mondayBoardIds.candidates) parentId = boxFolderIds['candidates'];
    if (boardId === mondayBoardIds.inactive) parentId = boxFolderIds['inactive'];
    if (boardId === mondayBoardIds.active) {
        const parentKey = parentFolderMap[locationName];
        parentId = boxFolderIds[parentKey];
    };

    return parentId;
};
