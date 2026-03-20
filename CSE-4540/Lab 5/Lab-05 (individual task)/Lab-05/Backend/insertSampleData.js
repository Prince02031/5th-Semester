const mongoose = require('mongoose');
require('dotenv').config();

const Game = require('./models/gameModel');
const Player = require('./models/playerModel');
const Developer = require('./models/developerModel');
const Collaboration = require('./models/collaborationModel');

// Connect to MongoDB
mongoose.connect(process.env.MongoDB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sample Games
const sampleGames = [
  { title: 'Dragon Quest Adventures', genre: 'RPG', rating: 9.2, multiplayer: true },
  { title: 'Battle Arena Pro', genre: 'FPS', rating: 8.5, multiplayer: true },
  { title: 'Mind Puzzle Master', genre: 'Puzzle', rating: 7.8, multiplayer: false },
  { title: 'Empire Builder', genre: 'Strategy', rating: 9.0, multiplayer: true },
  { title: 'City Life Simulator', genre: 'Simulation', rating: 8.3, multiplayer: false },
  { title: 'Fantasy RPG World', genre: 'RPG', rating: 9.5, multiplayer: true },
  { title: 'Tactical Shooter', genre: 'FPS', rating: 8.8, multiplayer: true }
];

// Sample Players
const samplePlayers = [
  { name: 'John Doe', email: 'john@example.com', age: 25, membershipLevel: 'premium', active: true },
  { name: 'Jane Smith', email: 'jane@example.com', age: 30, membershipLevel: 'elite', active: true },
  { name: 'Bob Wilson', email: 'bob@example.com', age: 22, membershipLevel: 'free', active: true },
  { name: 'Alice Brown', email: 'alice@example.com', age: 28, membershipLevel: 'premium', active: true },
  { name: 'Charlie Davis', email: 'charlie@example.com', age: 35, membershipLevel: 'elite', active: false },
  { name: 'Emma Johnson', email: 'emma@example.com', age: 24, membershipLevel: 'premium', active: true },
  { name: 'Mike Taylor', email: 'mike@example.com', age: 27, membershipLevel: 'free', active: true }
];

// Sample Developers
const sampleDevelopers = [
  { name: 'David Chen', email: 'david@dev.com', specializations: ['RPG', 'Strategy'], experienceYears: 5, hourlyRate: 50, available: true, certifications: ['Unity Certified', 'AWS Developer'] },
  { name: 'Sarah Miller', email: 'sarah@dev.com', specializations: ['FPS', 'Simulation'], experienceYears: 7, hourlyRate: 75, available: true, certifications: ['Unreal Engine Expert'] },
  { name: 'Tom Anderson', email: 'tom@dev.com', specializations: ['Puzzle', 'Strategy'], experienceYears: 3, hourlyRate: 40, available: true, certifications: ['Game Design Certificate'] },
  { name: 'Lisa Wang', email: 'lisa@dev.com', specializations: ['RPG', 'FPS'], experienceYears: 8, hourlyRate: 80, available: false, certifications: ['Lead Developer', 'Scrum Master'] },
  { name: 'Kevin Brown', email: 'kevin@dev.com', specializations: ['Simulation', 'Puzzle'], experienceYears: 4, hourlyRate: 45, available: true, certifications: ['Mobile Game Developer'] },
  { name: 'Rachel Green', email: 'rachel@dev.com', specializations: ['Strategy', 'RPG'], experienceYears: 6, hourlyRate: 60, available: true, certifications: ['Unity Certified', 'Level Design'] }
];

async function insertSampleData() {
  try {
    // Clear existing data
    await Game.deleteMany({});
    await Player.deleteMany({});
    await Developer.deleteMany({});
    await Collaboration.deleteMany({});
    
    console.log('Cleared existing data...');
    
    // Insert Games
    const games = await Game.insertMany(sampleGames);
    console.log(`Inserted ${games.length} games`);
    
    // Insert Players
    const players = await Player.insertMany(samplePlayers);
    console.log(`Inserted ${players.length} players`);
    
    // Insert Developers
    const developers = await Developer.insertMany(sampleDevelopers);
    console.log(`Inserted ${developers.length} developers`);
    
    // Insert Sample Collaborations
    const sampleCollaborations = [
      {
        playerId: players[0]._id, // John (premium)
        developerId: developers[0]._id, // David
        gameId: games[0]._id,
        requestDescription: 'Add custom character skins and new questline',
        estimatedHours: 20,
        totalCost: 1000,
        status: 'in-progress',
        timeline: { startDate: new Date(), endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
      },
      {
        playerId: players[1]._id, // Jane (elite)
        developerId: developers[1]._id, // Sarah
        gameId: games[1]._id,
        requestDescription: 'Create custom weapons and game modes',
        estimatedHours: 15,
        totalCost: 1125,
        status: 'accepted',
        timeline: { startDate: new Date(), endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000) }
      },
      {
        playerId: players[3]._id, // Alice (premium)
        gameId: games[2]._id,
        requestDescription: 'Design exclusive puzzle levels',
        estimatedHours: 10,
        status: 'pending'
      },
      {
        playerId: players[5]._id, // Emma (premium)
        developerId: developers[4]._id, // Kevin
        gameId: games[4]._id,
        requestDescription: 'Add multiplayer features to simulation',
        estimatedHours: 25,
        totalCost: 1125,
        status: 'completed',
        timeline: { startDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000), endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) }
      },
      {
        playerId: players[1]._id, // Jane (elite)
        gameId: games[5]._id,
        requestDescription: 'Implement new storyline and characters',
        estimatedHours: 30,
        status: 'pending'
      }
    ];
    
    const collaborations = await Collaboration.insertMany(sampleCollaborations);
    console.log(`Inserted ${collaborations.length} collaborations`);
    
    console.log('\n✅ Sample data inserted successfully!');
    console.log(`\nSummary:`);
    console.log(`- Games: ${games.length}`);
    console.log(`- Players: ${players.length}`);
    console.log(`- Developers: ${developers.length}`);
    console.log(`- Collaborations: ${collaborations.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error inserting sample data:', error);
    process.exit(1);
  }
}

insertSampleData();
