import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import crypto from "crypto";
import { ActiveConnections, IncomingFigure, Figure } from "./types";

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

    let pixels: Figure[] = [
        { x: 100, y: 250, color: 'red' },
        { x: 250, y: 350, color: 'orange' }
    ];

    ws.send(JSON.stringify({type: 'CURRENT_PIXELS', payload: pixels}));

    ws.on('figure', (figure: string) => {
        console.log('Server', figure.toString());
        const decodedPixels = JSON.parse(figure) as IncomingFigure;

       if (decodedPixels.type === 'SET_FIGURE') {
            Object.values(activeConnections).forEach(connection => {

                const outgoingMessage = {type: 'NEW_FIGURE', payload: {
                        pixels: pixels.push(decodedPixels.payload),
                    }}
                connection.send(JSON.stringify(outgoingMessage));
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



