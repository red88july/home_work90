import {useEffect, useRef, useState, MouseEventHandler} from "react";
import {DotsFigures, IncomingDots} from "./types";

function App() {
    const ws = useRef<WebSocket | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [dots, setDots] = useState<DotsFigures[]>([]);

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
            const decodedDots = JSON.parse(event.data) as IncomingDots;

            if (decodedDots.type === 'CURRENT_DOTS') {
                draw(context, decodedDots.payload)
            } else if (decodedDots.type === 'NEW_DOTS') {
                setDots(decodedDots.payload);
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
        context.clearRect(0, 0, canvas.width, canvas.height);
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const newDot: DotsFigures = {x, y, color: 'red'};
        const updatedDots = [...dots, newDot];

        setDots(updatedDots);
        draw(context, updatedDots)

        const message = {type: 'SET_DOTS', payload: updatedDots};
        if (ws.current) {
            ws.current.send(JSON.stringify(message));
        }
    };

    const draw = (context: CanvasRenderingContext2D, dots: DotsFigures[]) => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }
        context.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < dots.length; i++) {
            const point = dots[i];
            context.fillStyle = point.color;
            context.fillRect(point.x, point.y, 10, 10);
        }
    };

    return (
        <div className="main-box">
            <canvas ref={canvasRef} id="canvas-box" style={{}} width="300"
                    height="300" onClick={handleClick}></canvas>
        </div>
    );
}

export default App;
