export interface DotsFigures {
    x: number;
    y: number;
    color: string
}

export interface IncomingFromServerDots {
    type: 'CURRENT_DOTS';
    payload: DotsFigures[];
}

export interface UpdatedDots {
    type: 'NEW_DOTS';
    payload: DotsFigures[];
}

export type IncomingDots = IncomingFromServerDots | UpdatedDots;