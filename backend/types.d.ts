import { WebSocket } from 'ws';

export interface ActiveConnections {
    [id: string]: WebSocket;
}

export interface Figure {
    x: number;
    y: number;
    color: string;
}

export interface IncomingFigure {
    type: string;
    payload: Figure[];
}