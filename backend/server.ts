import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import crypto from "crypto";
import { ActiveConnections, IncomingLines, Lines } from "./types";

const app = express();
const router = express.Router();

expressWs(app);

const port = 8000;

app.use(router);
app.use(cors());

const activeConnections: ActiveConnections = {};

router.ws('/canvasApp', (ws, req) => {
    const id = crypto.randomUUID();
    console.log('client connected! id=', id);
    activeConnections[id] = ws;

    let lines: Lines[] = [
        { x: 100, y: 250, color: 'red' },
        { x: 100, y: 100, color: 'orange' }
    ];

    ws.send(JSON.stringify({type: 'CURRENT_LINES', payload: lines}));

    ws.on('message', (message: string) => {
        const decodedLines = JSON.parse(message) as IncomingLines;

        if (decodedLines.type === 'SET_LINES') {
            Object.values(activeConnections).forEach(connection => {
                const outgoingLines = {type: 'NEW_LINES', payload: decodedLines.payload}
                connection.send(JSON.stringify(outgoingLines));
            })
        }
    });

    ws.on('close', () => {
        console.log('client disconnected! id=', id);
        delete activeConnections[id];
    });
});

app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
});
