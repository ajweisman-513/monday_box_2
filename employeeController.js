import { createFolderInBox, updateParentFolderId } from './boxFolderService.js';
import { getMondayItemDetails, updateMondayItemColumns } from './mondayItemService.js';
import { loadConfig } from './utils/loadConfig.js';

// Utility function to load and get column key
const getColumnKey = (boardId) => {
    const folderMapConfig = loadConfig('folderMap.json');
    return folderMapConfig.mondayBoxColumnIdKeys[String(boardId)];
};

// Utility function to extract column values from Monday item
const getColumnValue = (colVals, columnId) => {
    return colVals.find(({ id }) => id === columnId)?.text;
};

export const createNewBoxFolder = async (req, res) => {

    const candidateName = req.body.event.pulseName;
    const mondayItemId = req.body.event.pulseId;
    const mondayBoardId = req.body.event.boardId;

    const columnKey = getColumnKey(mondayBoardId);
    const mondayBoxFolderId_columnId = columnKey;
    const mondayBoxLink_columnId = 'link2__1';
    const boxFolderBaseURL = 'https://jbentities.app.box.com/folder/';
    
    try {
        const boxFolderId = await createFolderInBox(candidateName);

        if (boxFolderId == 'error409') {
            return res.status(200).send({ message: '409 - Folder already exists in Box.' });
        }
        const boxFolderURL = boxFolderBaseURL + boxFolderId;
        const mondayBoxFolderId_columnUpdate = boxFolderId;
        const mondayBoxLink_columnUpdate = `${boxFolderURL} BoxFolderLink`;
        
        try {
            const mondayConfirmation = await updateMondayItemColumns(
                mondayBoardId, 
                mondayItemId, 
                mondayBoxFolderId_columnId, 
                mondayBoxFolderId_columnUpdate,
                mondayBoxLink_columnId,
                mondayBoxLink_columnUpdate
            );
            const response = { candidateName, boxFolderId, mondayConfirmation };
            console.log('Folder created and Monday.com updated:', response);
            res.status(200).send(response);
        } catch (mondayError) {
            console.error('Error updating Monday.com item:', mondayError);
            res.status(500).send('Error updating Monday.com item');
        }
    } catch (error) {
        console.log('Error creating folder in Box333:', error);
        res.status(200).send('Error creating folder in Box');
    }
};

export const updateBoxParentFolder = async (req, res) => {

    const { pulseId: mondayItemId, boardId: mondayNewBoardId } = req.body.event;
    console.log('Monday.com move request:', { mondayItemId, mondayNewBoardId });
    
    const mondayItem = await getMondayItemDetails(mondayItemId);
    const { column_values: colVals, name: itemName } = mondayItem;
    const columnKey = getColumnKey(mondayNewBoardId);

    const itemBoxFolderId = getColumnValue(colVals, columnKey);
    const itemLocationName = getColumnValue(colVals, "label__1");

    console.log('Monday Item Retieval', { itemName, itemBoxFolderId, itemLocationName });

    // Check if either itemBoxFolderId or itemLocationName is missing
    if (!itemBoxFolderId || !itemLocationName) {
        console.error('Missing itemBoxFolderId or itemLocationName', { itemBoxFolderId, itemLocationName });
        return res.status(404).send({ error: true, message: 'No data to update Box parent.' });
    }

    const boxUpdateResponse = await updateParentFolderId(
        String(mondayNewBoardId), itemBoxFolderId, itemLocationName
    );
    console.log('boxUpdateResponse', boxUpdateResponse);
    console.log('_____________D_O_N_E____________');
    res.status(200).send({ mondayNewBoardId, boxUpdateResponse });
};
