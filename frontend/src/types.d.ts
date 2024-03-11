export interface PixelsFigure {
    x: number;
    y: number;
    color: string
}

export interface IncomingFromServerFigure {
    type: 'CURRENT_PIXELS';
    payload: PixelsFigure[];
}

export interface UpdatedFigure {
    type: 'NEW_FIGURE';
    payload: PixelsFigure[];
}

export type IncomingFigure = IncomingFromFigure;