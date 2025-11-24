import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'LearnSync 后端服务器运行正常！',
    timestamp: new Date().toISOString()
  });
});

export default app;