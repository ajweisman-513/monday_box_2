import { processFolderName } from './candidateService.js';
import { createFolderInBox } from './boxService.js';

export const handleCandidateRequest = async (req, res) => {
    console.log(JSON.stringify(req.body, null, 2));

    if (req.body.challenge) {
        res.status(200).send(req.body);
    } else {
        const candidateName = req.body.event.pulseName;

        if (candidateName) {
            try {
                const orderedName = processFolderName(candidateName);
                const boxFolderInfo = await createFolderInBox(orderedName);
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
