export const handleTesting = (req, res, next) => {
    if (!req.body || !req.body.event || !req.body.event.type) {
        console.error('Invalid request structure:', req.body);
        return res.status(400).send({ error: 'Invalid request structure' });
    }

    if (req.body.event.type !== "create_pulse") {
        console.log('req.body.event', req.body.event);
        return res.status(200).send(req.body);
    }

    next(); // Pass the request to the next middleware/route handler if the event type is "create_pulse"
};