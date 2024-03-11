export interface LinesFigures {
    x: number;
    y: number;
    color: string
}

export interface IncomingFromServerLines {
    type: 'CURRENT_LINES';
    payload: LinesFigures[];
}

export interface UpdatedFLINES {
    type: 'NEW_LINES';
    payload: LinesFigures[];
}

export type IncomingLines = IncomingFromServerLines | UpdatedFLINES;