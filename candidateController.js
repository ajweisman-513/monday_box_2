import { createFolderInBox } from './boxFolderService.js';

export const handleCandidateRequest = async (req, res) => {
    console.log(JSON.stringify(req.body, null, 2));

    if (req.body.challenge) {
        res.status(200).send(req.body);
    } else {
        const candidateName = req.body.event.pulseName;
        const mondayItemId = req.body.event.pulseId;
        const mondayBoardId = req.body.event.boardId;
        const mondayEventType = req.body.event.type;

        if (candidateName) {
            try {
                const boxFolderInfo = await createFolderInBox(candidateName);
                boxFolderInfo.mondayItemId = mondayItemId;
                boxFolderInfo.mondayBoardId = mondayBoardId;
                boxFolderInfo.mondayEventType = mondayEventType;
                // await monday item Update here
                console.log('Folder created:', boxFolderInfo);
                res.status(200).send(boxFolderInfo);
            } catch (error) {
                console.error('Error creating folder in Box:', error);
                res.status(500).send('Error creating folder in Box');
            }
        } else {
            res.status(400).send('Missing "candidateName" field in event payload');
        }
    }
};