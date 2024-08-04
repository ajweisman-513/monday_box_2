// challengeMiddleware.js
export const handleChallengeRequest = (req, res, next) => {
    if (req.body.challenge) {
        return res.status(200).send(req.body);
    }
    next(); // Pass the request to the next middleware/route handler if no challenge key is found
};
