import React, {useEffect, useRef} from "react";

function App() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }
        const context = canvas.getContext('2d')
        if (!context) {
            return;
        }

    }, []);

    return (
        <div className="main-box">
            <canvas ref={canvasRef} id="canvas-box" width="480" height="480"></canvas>
        </div>
    );
}

export default App;
