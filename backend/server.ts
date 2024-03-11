import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import crypto from "crypto";
import {ActiveConnections, Dots, IncomingDots} from "./types";

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

    const dots: Dots[] = [
        { x: 150, y: 150, color: 'orange' },
        { x: 200, y: 150, color: 'blue' }
    ];

    ws.send(JSON.stringify({type: 'CURRENT_DOTS', payload: dots}));

    ws.on('message', (message: string) => {
        const decodedDots = JSON.parse(message) as IncomingDots;

        if (decodedDots.type === 'SET_DOTS') {
            Object.values(activeConnections).forEach(connection => {
                const outgoingDots = {type: 'NEW_DOTS', payload: decodedDots.payload}
                connection.send(JSON.stringify(outgoingDots));
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
