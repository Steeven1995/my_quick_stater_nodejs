
function apiKeyMiddleware(req , res, next) {
    const apiKey = req.headers['x-api-key']; //null ou undefined
    console.log("Hello")
    if (apiKey !== process.env.API_KEY) {
      return res.status(401).json({ error: "Invalid API key." });
    }
    next();
};

module.exports = apiKeyMiddleware;