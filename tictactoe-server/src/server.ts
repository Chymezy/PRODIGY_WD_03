import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import http from 'http';
import WebSocket from 'ws';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import { GameServer } from './services/gameServer';
import { wsAuth } from './middleware/wsAuth';
import { WsConnection, WsAuthRequest } from './types';
import { config } from './config';
import { generateToken } from './utils/jwt';
import { createUser, findUserByEmail, validatePassword } from './models/userModel';
import { authenticate, rateLimiter, AuthRequest } from './middleware/auth';
import { replayService } from './services/replayService';
import { leaderboardService } from './services/leaderboardService';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const gameServer = new GameServer();

// Create routers
const authRouter = express.Router();
const apiRouter = express.Router();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie']
}));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Apply rate limiting to routers
const authRateLimiter = rateLimiter(15 * 60 * 1000, 100);
const apiRateLimiter = rateLimiter(15 * 60 * 1000, 1000);

authRouter.use(authRateLimiter as RequestHandler);
apiRouter.use(apiRateLimiter as RequestHandler);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Auth routes
const registerHandler: RequestHandler = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    const user = await createUser(username, email, password);
    const token = generateToken(user);
    
    res.cookie('token', token, { 
      ...config.cookie,
      path: '/',
      sameSite: 'strict',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    return res.json({ 
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email 
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Error creating user' });
  }
};

const loginHandler: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await findUserByEmail(email);
    if (!user || !(await validatePassword(user, password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const token = generateToken(user);
    res.cookie('token', token, { 
      ...config.cookie,
      path: '/',
      sameSite: 'strict',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    return res.json({ 
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email 
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Error during login' });
  }
};

const logoutHandler: RequestHandler = (req, res) => {
  res.clearCookie('token', { path: '/' });
  return res.json({ message: 'Logged out successfully' });
};

authRouter.post('/register', registerHandler);
authRouter.post('/login', loginHandler);
authRouter.post('/logout', logoutHandler);

// API routes
const profileHandler: RequestHandler = (req: AuthRequest, res: Response) => {
  return res.json({ user: req.user });
};

apiRouter.get('/profile', authenticate as RequestHandler, profileHandler);

// Add replay routes
apiRouter.get('/replays/user', authenticate as RequestHandler, async (req: AuthRequest, res: Response) => {
  try {
    const replays = await replayService.getUserReplays(req.user!.id);
    res.json(replays);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching replays' });
  }
});

apiRouter.get('/replays/game/:gameId', async (req: Request, res: Response) => {
  try {
    const replay = await replayService.getGameReplay(req.params.gameId);
    if (!replay) {
      return res.status(404).json({ message: 'Replay not found' });
    }
    res.json(replay);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching replay' });
  }
});

// Add leaderboard routes
apiRouter.get('/leaderboard', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const leaderboard = await leaderboardService.getTopPlayers(limit);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
});

apiRouter.get('/leaderboard/rank', authenticate as RequestHandler, async (req: AuthRequest, res: Response) => {
  try {
    const rank = await leaderboardService.getUserRank(req.user!.id);
    res.json({ rank });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rank' });
  }
});

apiRouter.get('/stats', authenticate as RequestHandler, async (req: AuthRequest, res: Response) => {
  try {
    const stats = await leaderboardService.getPlayerStats(req.user!.id);
    if (!stats) {
      return res.status(404).json({ message: 'Player stats not found' });
    }
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching player stats' });
  }
});

// Mount routers
app.use('/auth', authRouter);
app.use('/api', apiRouter);

// WebSocket connection handling
wss.on('connection', (ws: WsConnection, req: WsAuthRequest) => {
  const isAuthenticated = wsAuth(ws, req);
  
  if (!isAuthenticated && process.env.NODE_ENV === 'production') {
    ws.close(1008, 'Authentication required');
    return;
  }

  gameServer.handleConnection(ws);
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
