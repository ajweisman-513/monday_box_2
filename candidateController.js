import { createFolderInBox, updateParentFolderId } from './boxFolderService.js';
import { getMondayItemDetails, updateMondayItemColumns } from './mondayItemService.js';
import { determineNewBoxParentFolder } from './boxIdentifyParentService.js';

export const createNewCandidateBoxFolder = async (req, res) => {
    console.log(JSON.stringify(req.body, null, 2));

    const candidateName = req.body.event.pulseName;
    const mondayItemId = req.body.event.pulseId;
    const mondayBoardId = req.body.event.boardId;

    if (!candidateName || !mondayItemId || !mondayBoardId) {
        return res.status(400).send('Missing required fields in Monday event payload');
    }
    const mondayBoxFolderId_columnId = 'text0__1';
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

export const updateCandidateBoxParentFolder = async (req, res) => {
    console.log(JSON.stringify(req.body, null, 2));

    const { pulseId: mondayItemId, boardId: mondayNewBoardId } = req.body.event;
    
    const mondayItem = await getMondayItemDetails(mondayItemId);
    const colVals = mondayItem.column_values;

    const location = colVals.find(({ id }) => id === "label__1")?.text;
    const boxFolderId = colVals.find(({ id }) => id === "text0__1")?.text;

    const parentFolderId = determineNewBoxParentFolder(mondayNewBoardId, location);

    console.log('mondayNewBoardId', mondayNewBoardId);
    console.log('boxNewParentFolderId', parentFolderId);  // Outputs: "280726250117"
    
    res.status(200).send({ boxFolderId, parentFolderId });
};


    // try {
    // updateParentFolderId
    //     const folderId = await getFolderIdByPulseId(mondayItemId); // Placeholder for folder retrieval logic
    //     if (!folderId) {
    //         return res.status(404).send('No Box folder found for the given pulse ID');
    //     }

    //     await updateParentFolderId(folderId, newParentFolderId);
    //     res.status(200).send('Parent folder updated successfully');
    // } catch (error) {
    //     console.error('Error updating parent folder in Box:', error);
    //     res.status(500).send('Error updating parent folder in Box');
    // }
//};
