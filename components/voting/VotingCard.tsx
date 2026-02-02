'use client';

import Image from 'next/image';
import { Heart, Check, ZoomIn, Trophy } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface VotingCardProps {
  candidate: {
    _id: string;
    name: string;
    image: string;
    votes: number;
    category: 'queen' | 'king';
  };
  hasVoted: boolean;
  hasVotedInCategory: boolean;
  onVote: (candidateId: string) => void;
  onImageClick: () => void;
  voting: boolean;
  rank?: number;
}

export default function VotingCard({ 
  candidate, 
  hasVoted, 
  hasVotedInCategory,
  onVote, 
  onImageClick,
  voting, 
  rank 
}: VotingCardProps) {
  const [localVotes, setLocalVotes] = useState(candidate.votes);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    setLocalVotes(candidate.votes);
  }, [candidate.votes]);

  const handleVote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasVoted || hasVotedInCategory || isVoting || voting) return;

    setIsVoting(true);
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidateId: candidate._id,
          category: candidate.category,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setLocalVotes(data.votes);
        onVote(candidate._id);
        toast.success('🎉 Bình chọn thành công!', {
          description: `Bạn đã bình chọn cho ${candidate.name}`,
        });
      } else {
        const error = await response.json();
        toast.error(error.error || 'Không thể bình chọn');
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Không thể bình chọn');
    } finally {
      setIsVoting(false);
    }
  };

  const isQueen = candidate.category === 'queen';
  const canVote = !hasVoted && !hasVotedInCategory && !voting && !isVoting;
  
  // If user has voted for someone else, show disabled state
  const isDisabled = hasVotedInCategory && !hasVoted;

  // Theme colors based on category
  const themeColors = isQueen ? {
    cardBg: 'bg-gradient-to-b from-[#1a0a0a] to-[#2d0a0a]',
    cardBorder: hasVoted ? 'border-green-400 ring-2 ring-green-400/30' : 'border-pink-500/20 hover:border-pink-500/40',
    shadow: 'hover:shadow-pink-500/20',
    accent: 'text-pink-400',
    accentFill: 'text-pink-400 fill-pink-400',
    buttonBg: 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 shadow-pink-500/30',
    infoBg: 'bg-[#1a0a0a]/80',
    votesBg: 'bg-pink-500/10',
  } : {
    cardBg: 'bg-gradient-to-b from-[#0a0a1a] to-[#0a0a2d]',
    cardBorder: hasVoted ? 'border-green-400 ring-2 ring-green-400/30' : 'border-cyan-500/20 hover:border-cyan-500/40',
    shadow: 'hover:shadow-cyan-500/20',
    accent: 'text-cyan-400',
    accentFill: 'text-cyan-400 fill-cyan-400',
    buttonBg: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 shadow-cyan-500/30',
    infoBg: 'bg-[#0a0a1a]/80',
    votesBg: 'bg-cyan-500/10',
  };

  return (
    <div 
      className={`group relative overflow-hidden rounded-2xl ${themeColors.cardBg} shadow-lg border-2 transition-all duration-300 
        ${themeColors.cardBorder} 
        ${isDisabled ? 'opacity-50 grayscale' : `hover:shadow-xl ${themeColors.shadow} hover:-translate-y-1`}
      `}
    >
      {/* Rank Badge */}
      {rank && rank <= 3 && (
        <div className={`absolute top-3 left-3 z-20 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-lg ${
          rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-amber-900' :
          rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800' :
          'bg-gradient-to-br from-amber-600 to-amber-700 text-white'
        }`}>
          {rank === 1 && <Trophy className="w-5 h-5" />}
          {rank !== 1 && rank}
        </div>
      )}

      {/* Voted Badge */}
      {hasVoted && (
        <div className="absolute top-3 right-3 z-20 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
          <Check className="w-3 h-3" />
          Đã chọn
        </div>
      )}

      {/* Card Image */}
      <div 
        className="relative aspect-[3/4] w-full overflow-hidden cursor-pointer"
        onClick={onImageClick}
      >
        <Image
          src={candidate.image || "/placeholder.svg"}
          alt={candidate.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        
        {/* Zoom icon overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
            <ZoomIn className="w-7 h-7 text-gray-700" />
          </div>
        </div>
        
        {/* Gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Vote count on image */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${themeColors.votesBg} backdrop-blur-sm border ${isQueen ? 'border-pink-500/30' : 'border-cyan-500/30'}`}>
            <Heart className={`w-4 h-4 ${themeColors.accentFill}`} />
            <span className={`font-bold text-sm ${themeColors.accent}`}>{localVotes.toLocaleString()}</span>
            <span className="text-white/60 text-xs">votes</span>
          </div>
        </div>
      </div>

      {/* Info section */}
      <div className={`p-4 ${themeColors.infoBg}`}>
        <h3 className="font-bold text-white text-base sm:text-lg mb-3 line-clamp-2">{candidate.name}</h3>
        
        {/* Vote button - Full width */}
        {canVote && (
          <button
            onClick={handleVote}
            disabled={!canVote}
            className={`w-full px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 active:scale-95 ${themeColors.buttonBg} text-white shadow-lg flex items-center justify-center gap-2`}
          >
            {isVoting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Heart className="w-5 h-5" />
                BÌNH CHỌN
              </>
            )}
          </button>
        )}
        
        {hasVoted && (
          <div className="w-full px-4 py-3 rounded-xl text-sm font-bold bg-green-500/20 text-green-400 flex items-center justify-center gap-2 border border-green-500/30">
            <Check className="w-5 h-5" />
            ĐÃ BÌNH CHỌN
          </div>
        )}
        
        {isDisabled && !hasVoted && (
          <div className="w-full px-4 py-3 rounded-xl text-sm font-medium bg-gray-500/20 text-gray-400 flex items-center justify-center gap-2 border border-gray-500/30">
            Bạn đã vote người khác
          </div>
        )}
      </div>
    </div>
  );
}
