import { useEffect, useRef, useState, MouseEventHandler } from "react";
import { IncomingLines, LinesFigures } from "./types";

function App() {
    const ws = useRef<WebSocket | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [lines, setLines] = useState<LinesFigures[]>([]);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000/canvasApp');

        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const context = canvas.getContext('2d');
        if (!context) {
            return;
        }

        ws.current.addEventListener('close', () => console.log('ws closed'));

        ws.current.addEventListener('message', (event) => {
            console.log('On App', event.data);

            const decodedLines = JSON.parse(event.data) as IncomingLines;

            if (decodedLines.type === 'CURRENT_LINES') {
                draw(context, decodedLines.payload);
            } else if (decodedLines.type === 'NEW_LINES') {
                draw(context, decodedLines.payload);
            }
        });

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        }
    }, []);

    const handleClick: MouseEventHandler<HTMLCanvasElement> = (event) => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }
        const context = canvas.getContext('2d');
        if (!context) {
            return;
        }

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const newLine: LinesFigures = { x, y, color: 'red' };
        const updatedLines = [...lines, newLine];

        setLines(updatedLines);
        draw(context, updatedLines);

        const message = { type: 'SET_LINES', payload: updatedLines };
        if (ws.current) {
            ws.current.send(JSON.stringify(message));
        }
    };

    const draw = (context: CanvasRenderingContext2D, lines: LinesFigures[]) => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        for (let i = 0; i < lines.length; i++) {
            const point = lines[i];
            if (i === 0) {
                context.beginPath();
                context.moveTo(point.x, point.y);
                context.lineWidth = 3;
            } else {
                context.lineTo(point.x, point.y);

            }
            context.strokeStyle = point.color;
            context.stroke();
        }
    };

    return (
        <div className="main-box">
            <canvas ref={canvasRef} id="canvas-box" width="480" height="480" onClick={handleClick}></canvas>
        </div>
    );
}

export default App;
