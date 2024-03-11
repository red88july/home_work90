import { useEffect, useRef, useState, MouseEventHandler } from "react";
import { IncomingFigure, PixelsFigure } from "./types";

function App() {
    const ws = useRef<WebSocket | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [figures, setFigures] = useState<PixelsFigure[]>([]);

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

            const decodedMessage = JSON.parse(event.data) as IncomingFigure;

            if (decodedMessage.type === 'CURRENT_PIXELS') {
                setFigures(decodedMessage.payload);
                draw(context, decodedMessage.payload);
            } else if (decodedMessage.type === 'NEW_FIGURE') {
                setFigures(prevFigures => [...prevFigures, decodedMessage.payload]);
                draw(context, figures.concat(decodedMessage.payload));
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

        const newFigure: PixelsFigure = { x, y, color: 'blue' };
        const updatedFigures = [...figures, newFigure];

        setFigures(updatedFigures);
        draw(context, updatedFigures);

        const message = { type: 'SET_FIGURE', payload: newFigure };
        if (ws.current) {
            ws.current.send(JSON.stringify(message));
        }
    };

    const draw = (context: CanvasRenderingContext2D, pixels: PixelsFigure[]) => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        for (let i = 0; i < pixels.length; i++) {
            const point = pixels[i];
            if (i === 0) {
                context.beginPath();
                context.moveTo(point.x, point.y);
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
