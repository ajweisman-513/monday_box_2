import { createFolderInBox, updateParentFolderId } from './boxFolderService.js';
import { updateMondayItemColumns } from './mondayItemUpdateService.js';

export const handleCandidateRequest = async (req, res) => {
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
        if (!boxFolderId) {
            throw new Error('Invalid or missin boxFolderId returned from createFolderInBox');
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
            console.log('Folder created and Monday.com updated:', mondayConfirmation);
            res.status(200).send({
                candidateName,
                boxFolderId, 
                monday: mondayConfirmation
            });
        } catch (mondayError) {
            console.error('Error updating Monday.com item:', mondayError);
            res.status(500).send('Error updating Monday.com item');
        }
    } catch (error) {
        console.error('Error creating folder in Box:', error);
        res.status(500).send('Error creating folder in Box');
    }
};