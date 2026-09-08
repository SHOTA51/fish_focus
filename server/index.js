const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// In-memory "database"
const db = {
  users: {},
  sessions: [],
  quests: {
    '1': { id: '1', title: 'Morning Focus', goalMinutes: 30, rewardFood: 10 },
    '2': { id: '2', title: 'Deep Work', goalMinutes: 50, rewardFood: 20 },
  }
};

// Auth: Register
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  const userId = uuidv4();
  
  db.users[userId] = {
    id: userId,
    username,
    email,
    password, // In real app, hash this!
    totalFocusTime: 0,
    fish: {
      level: 1,
      experience: 0,
      name: 'Bob',
      stage: 'egg',
    }
  };
  
  res.json({ userId, user: db.users[userId] });
});

// Auth: Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = Object.values(db.users).find(u => u.email === email && u.password === password);
  
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ userId: user.id, user });
});

// User: Profile
app.get('/api/user/:id', (req, res) => {
  const user = db.users[req.params.id];
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// Focus: Complete Session
app.post('/api/focus/complete', (req, res) => {
  const { userId, duration } = req.body;
  const user = db.users[userId];
  if (!user) return res.status(404).json({ error: 'User not found' });

  // Update total time
  user.totalFocusTime += duration;
  
  // Update Fish EXP (e.g., 1 exp per minute)
  user.fish.experience += duration;
  
  // Level up logic
  const nextLevelExp = user.fish.level * 100;
  if (user.fish.experience >= nextLevelExp) {
    user.fish.level += 1;
    user.fish.experience -= nextLevelExp;
    
    // Update stage
    if (user.fish.level >= 10) user.fish.stage = 'adult';
    else if (user.fish.level >= 5) user.fish.stage = 'juvenile';
    else if (user.fish.level >= 2) user.fish.stage = 'fry';
  }

  db.sessions.push({
    id: uuidv4(),
    userId,
    duration,
    timestamp: new Date(),
    success: true
  });

  res.json({ user, fish: user.fish });
});

// Quests: Get List
app.get('/api/quests/:userId', (req, res) => {
  const user = db.users[req.params.userId];
  if (!user) return res.status(404).json({ error: 'User not found' });

  // Return quests with progress based on user's total time
  const userQuests = Object.values(db.quests).map(q => ({
    ...q,
    currentMinutes: Math.min(user.totalFocusTime, q.goalMinutes),
    isCompleted: user.totalFocusTime >= q.goalMinutes
  }));

  res.json(userQuests);
});

app.listen(PORT, () => {
  console.log(`Focus Fish Server running on http://localhost:${PORT}`);
});
