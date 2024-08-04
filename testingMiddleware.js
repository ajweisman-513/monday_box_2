export const handleTesting = (req, res, next) => {
    if (req.body.event) {
        if (req.body.event.type !== "create_pulse") {
            console.log('req.body.event', req.body.event);
            return res.status(200).send(req.body);
        }
        next(); 
    }
    next(); // Pass the request to the next middleware/route handler if the event type is "create_pulse"
};