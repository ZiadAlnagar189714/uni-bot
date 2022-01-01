const dotenv = require('dotenv')
dotenv.config({ path: 'config/.env' });

function Globals(access) {
    const mode = process.env.NODE_ENV;
    const port = process.env.PORT;
    const db = process.env.MONGO_URI;
    const BDev = process.env.CHATBOT_DEVELOPER_ACCESS_TOKEN;
    const BClient = process.env.CHATBOT_CLIENT_ACCESS_TOKEN;
    const BAPI = process.env.BOT_API;
    
    switch (access) {
        case "mode":
            return mode;
        case "port":
            return port;
        case "db":
            return db;
        case "BDev":
            return BDev;
        case "BClient":
            return BClient;
        case "BAPI":
            return BAPI;
    }
}

module.exports = Globals;