export const checkEventType = (expectedEventType) => {
    return (req, res, next) => {
      const eventType = req.body?.event?.type;
  
      if (eventType !== expectedEventType) {
        // Respond with a 200 status code and stop further processing
        return res.status(200).send({ message: `Event type is not ${expectedEventType}` });
      }
  
      // If the event type is correct, pass the request to the next middleware/controller
      next();
    };
  };
  