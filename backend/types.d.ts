import { WebSocket } from 'ws';

export interface ActiveConnections {
    [id: string]: WebSocket;
}

export interface Lines {
    x: number;
    y: number;
    color: string;
}

export interface IncomingLines {
    type: string;
    payload: Lines;
}