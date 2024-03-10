import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';

const app = express();
const router = express.Router();

expressWs(app);

const port = 8000;

app.use(router);
app.use(cors());


router.ws('/chat', (ws, req) => {
    console.log('client connected');
});

app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
});
