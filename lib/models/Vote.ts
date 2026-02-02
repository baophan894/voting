import mongoose, { Schema, Document } from 'mongoose';

export interface IVote extends Document {
  _id: string;
  candidateId: string;
  ipAddress: string;
  category: 'queen' | 'king';
  createdAt: Date;
}

const VoteSchema = new Schema<IVote>(
  {
    candidateId: {
      type: String,
      required: true,
      ref: 'Candidate',
    },
    ipAddress: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['queen', 'king'],
      required: true,
    },
  },
  { timestamps: true }
);

// Create index for vote tracking (one vote per IP per candidate)
VoteSchema.index({ candidateId: 1, ipAddress: 1 }, { unique: true });

export default mongoose.models.Vote || mongoose.model<IVote>('Vote', VoteSchema);
