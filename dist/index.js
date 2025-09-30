"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const process_1 = require("process");
const validate_env_1 = __importDefault(require("./utils/validate.env"));
const db_config_1 = __importDefault(require("./config/db.config"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRoutes_1 = __importDefault(require("./routes/user/userRoutes"));
const adminRoute_1 = __importDefault(require("./routes/admin/adminRoute"));
const clientRoutes_1 = __importDefault(require("./routes/client/clientRoutes"));
const freelancerRoutes_1 = __importDefault(require("./routes/freelancer/freelancerRoutes"));
const webhookRoutes_1 = __importDefault(require("./routes/client/webhookRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/user/messageRoutes"));
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
const loggerMiddleware_1 = require("./middlewares/loggerMiddleware");
const http_1 = __importDefault(require("http"));
const socket_1 = require("./utils/socket");
class App {
    constructor() {
        (0, validate_env_1.default)();
        this.app = (0, express_1.default)();
        this.server = http_1.default.createServer(this.app);
        this.initializeMiddlewares();
        this.initializeDatabase();
        this.initializeRoutes();
        // this.initializeSocket()
    }
    initializeMiddlewares() {
        this.app.use((0, cors_1.default)({
            origin: process_1.env.CLIENT_URL,
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true
        }));
        this.app.use((0, cookie_parser_1.default)());
        this.app.use(loggerMiddleware_1.morganMiddleware);
    }
    initializeDatabase() {
        (0, db_config_1.default)();
    }
    initializeRoutes() {
        this.app.use('/webhook', express_1.default.raw({ type: "application/json" }), webhookRoutes_1.default);
        this.app.use(express_1.default.json());
        this.app.use('/api/auth', userRoutes_1.default);
        this.app.use('/api/admin', adminRoute_1.default);
        this.app.use('/api/client', clientRoutes_1.default);
        this.app.use('/api/freelancer', freelancerRoutes_1.default);
        this.app.use('/api/media/', messageRoutes_1.default);
        this.app.use(errorMiddleware_1.errorHandler);
    }
    initializeSocket() {
        (0, socket_1.initSocket)(this.server);
    }
    listen() {
        const PORT = Number(process.env.PORT) || 3000;
        this.server.listen(Number(PORT), '0.0.0.0', () => {
            loggerMiddleware_1.logger.info(`Server running on http://localhost:${PORT}`);
            console.log(`Server running on http://localhost:${PORT}`);
            this.initializeSocket();
        });
    }
}
;
const app = new App();
app.listen();
