require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

const VotingSessionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['queen', 'king'],
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const VotingSession = mongoose.models.VotingSession || mongoose.model('VotingSession', VotingSessionSchema);

async function enableVoting() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Enable voting for both categories
    await VotingSession.updateOne(
      { category: 'queen' },
      { $set: { isActive: true } },
      { upsert: true }
    );
    console.log('✅ Enabled voting for Queen category');

    await VotingSession.updateOne(
      { category: 'king' },
      { $set: { isActive: true } },
      { upsert: true }
    );
    console.log('✅ Enabled voting for King category');

    console.log('\n🎉 Voting is now enabled for all categories!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

enableVoting();
