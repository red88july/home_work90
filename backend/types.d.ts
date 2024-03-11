import { WebSocket } from 'ws';

export interface ActiveConnections {
    [id: string]: WebSocket;
}

export interface Dots {
    x: number;
    y: number;
    color: string;
}

export interface IncomingDots {
    type: string;
    payload: Dots;
}