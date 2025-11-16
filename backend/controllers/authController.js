import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE = path.join(__dirname, '../data/users.json');

const readUsers = async () => {
  try {
    const raw = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
};

const writeUsers = async (users) => {
  await fs.mkdir(path.join(__dirname, '../data'), { recursive: true });
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
};

const signJwt = (payload) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not set in env');
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password required' });
    }

    const users = await readUsers();
    const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return res.status(409).json({ error: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashed
    };

    users.push(newUser);
    await writeUsers(users);

    const token = signJwt({ id: newUser.id, email: newUser.email });

    const { password: _p, ...userSafe } = newUser;
    return res.status(201).json({ user: userSafe, token });
  } catch (err) {
    console.error('signup error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const users = await readUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signJwt({ id: user.id, email: user.email });

    const { password: _p, ...userSafe } = user;
    return res.json({ user: userSafe, token });
  } catch (err) {
    console.error('login error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
