import { connectDB } from '@/lib/db';
import Candidate from '@/lib/models/Candidate';
import Vote from '@/lib/models/Vote';
import VotingSession from '@/lib/models/VotingSession';
import { NextRequest, NextResponse } from 'next/server';

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown';
  return ip;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { candidateId, category } = await req.json();
    const ipAddress = getClientIp(req);

    if (!candidateId || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if voting is active
    const votingSession = await VotingSession.findOne({ category });
    if (!votingSession?.isActive) {
      return NextResponse.json({ error: 'Voting is currently closed for this category' }, { status: 403 });
    }

    // Create vote record (no IP-based duplicate check - using localStorage instead)
    await Vote.create({
      candidateId,
      ipAddress,
      category,
    });

    // Increment candidate vote count
    const candidate = await Candidate.findByIdAndUpdate(
      candidateId,
      { $inc: { votes: 1 } },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      votes: candidate.votes,
    });
  } catch (error) {
    console.error('Error voting:', error);
    return NextResponse.json({ error: 'Failed to record vote' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') as 'queen' | 'king' | null;
    const ipAddress = searchParams.get('ip');

    if (!category || !ipAddress) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const votes = await Vote.find({ ipAddress, category });
    const votedCandidateIds = votes.map((v) => v.candidateId);

    return NextResponse.json({
      votedCandidateIds,
    });
  } catch (error) {
    console.error('Error fetching vote status:', error);
    return NextResponse.json({ error: 'Failed to fetch vote status' }, { status: 500 });
  }
}
