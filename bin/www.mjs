import http from 'http';
import app from '../app';
import { SERVER } from '../config';
import Log from '../lib/Log';

app.set('port', SERVER.PORT);
const server = http.createServer(app);
server.listen(SERVER.PORT);
server.on('listening', () => Log.update("Server", "init", `Server started listing on port ${SERVER.PORT}.`, "yellow"));