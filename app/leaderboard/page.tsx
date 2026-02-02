'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Home, Crown, Heart, RefreshCw, TrendingUp } from 'lucide-react';

interface Candidate {
  _id: string;
  name: string;
  image: string;
  votes: number;
  category: 'queen' | 'king';
}

export default function LeaderboardPage() {
  const [queenCandidates, setQueenCandidates] = useState<Candidate[]>([]);
  const [kingCandidates, setKingCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchCandidates = useCallback(async () => {
    try {
      const [queenRes, kingRes] = await Promise.all([
        fetch('/api/admin/candidates?category=queen', { cache: 'no-store' }),
        fetch('/api/admin/candidates?category=king', { cache: 'no-store' }),
      ]);

      const queens = await queenRes.json();
      const kings = await kingRes.json();

      if (Array.isArray(queens)) {
        queens.sort((a: Candidate, b: Candidate) => b.votes - a.votes);
        setQueenCandidates(queens);
      }
      if (Array.isArray(kings)) {
        kings.sort((a: Candidate, b: Candidate) => b.votes - a.votes);
        setKingCandidates(kings);
      }
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchCandidates();
    const interval = setInterval(fetchCandidates, 3000);
    return () => clearInterval(interval);
  }, [fetchCandidates]);

  const queenTotalVotes = queenCandidates.reduce((acc, c) => acc + c.votes, 0);
  const kingTotalVotes = kingCandidates.reduce((acc, c) => acc + c.votes, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin" />
          <p className="text-slate-400">Đang tải bảng xếp hạng...</p>
        </div>
      </div>
    );
  }

  const TopThreeSection = ({ candidates, color }: { candidates: Candidate[]; color: 'pink' | 'blue' }) => {
    const topThree = candidates.slice(0, 3);
    if (topThree.length < 3) return null;

    const colorClasses = color === 'pink' 
      ? { glow: 'bg-pink-500/20', border: 'border-pink-500/50' }
      : { glow: 'bg-blue-500/20', border: 'border-blue-500/50' };

    return (
      <div className="flex items-end justify-center gap-3 md:gap-6 py-8">
        {/* 2nd Place */}
        <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="relative mb-3">
            <div className={`absolute inset-0 ${colorClasses.glow} rounded-full blur-xl scale-110`} />
            <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-slate-400 shadow-lg">
              <Image src={topThree[1]?.image || '/placeholder.svg'} alt={topThree[1]?.name || ''} fill className="object-cover" />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-slate-300 to-slate-500 rounded-full flex items-center justify-center text-slate-900 font-bold shadow-lg text-sm">2</div>
          </div>
          <p className="text-center font-semibold text-xs md:text-sm truncate max-w-[80px] md:max-w-[120px]">{topThree[1]?.name}</p>
          <p className="text-yellow-400 font-bold text-sm md:text-base">{topThree[1]?.votes}</p>
        </div>

        {/* 1st Place */}
        <div className="flex flex-col items-center -mt-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <Crown className="w-8 h-8 md:w-10 md:h-10 text-yellow-400 mb-2 animate-pulse drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
          <div className="relative mb-3">
            <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-xl scale-125 animate-pulse" />
            <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-yellow-400 shadow-2xl shadow-yellow-500/30">
              <Image src={topThree[0]?.image || '/placeholder.svg'} alt={topThree[0]?.name || ''} fill className="object-cover" />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center text-slate-900 font-bold shadow-lg">1</div>
          </div>
          <p className="text-center font-bold text-sm md:text-lg truncate max-w-[100px] md:max-w-[150px]">{topThree[0]?.name}</p>
          <p className="text-yellow-400 font-bold text-lg md:text-xl flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            {topThree[0]?.votes}
          </p>
        </div>

        {/* 3rd Place */}
        <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="relative mb-3">
            <div className={`absolute inset-0 ${colorClasses.glow} rounded-full blur-xl scale-110`} />
            <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-amber-700 shadow-lg">
              <Image src={topThree[2]?.image || '/placeholder.svg'} alt={topThree[2]?.name || ''} fill className="object-cover" />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center text-white font-bold shadow-lg text-sm">3</div>
          </div>
          <p className="text-center font-semibold text-xs md:text-sm truncate max-w-[80px] md:max-w-[120px]">{topThree[2]?.name}</p>
          <p className="text-yellow-400 font-bold text-sm md:text-base">{topThree[2]?.votes}</p>
        </div>
      </div>
    );
  };

  const RankingsList = ({ candidates, color }: { candidates: Candidate[]; color: 'pink' | 'blue' }) => {
    const rest = candidates.slice(3);
    if (rest.length === 0) return null;

    const hoverClass = color === 'pink' ? 'hover:border-pink-500/30' : 'hover:border-blue-500/30';
    const textClass = color === 'pink' ? 'group-hover:text-pink-300' : 'group-hover:text-blue-300';

    return (
      <div className="space-y-2 max-w-2xl mx-auto">
        {rest.map((candidate, index) => (
          <div
            key={candidate._id}
            className={`flex items-center gap-3 p-3 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/30 hover:bg-slate-800/50 ${hoverClass} transition-all duration-300 group`}
          >
            <div className={`w-8 h-8 bg-slate-700/50 rounded-full flex items-center justify-center font-bold text-slate-400 text-sm ${textClass} transition-colors`}>
              {index + 4}
            </div>
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-600/50">
              <Image src={candidate.image || '/placeholder.svg'} alt={candidate.name} width={48} height={48} className="object-cover w-full h-full" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{candidate.name}</p>
            </div>
            <div className="text-right">
              <p className="text-yellow-400 font-bold">{candidate.votes}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a1628] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="relative z-10 bg-slate-900/50 backdrop-blur-xl border-b border-slate-700/50 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:scale-105 transition-transform">
              <Home className="w-5 h-5 text-white" />
              <span className="text-sm md:text-base font-bold text-white hidden sm:inline">GREENYELLOW</span>
            </Link>
            <div className="flex items-center gap-1 md:gap-2">
              <Link href="/queen">
                <Button variant="ghost" size="sm" className="text-white hover:text-pink-300 hover:bg-white/10 text-xs md:text-sm">
                  <Crown className="w-4 h-4 mr-1" />
                  Queen
                </Button>
              </Link>
              <Link href="/king">
                <Button variant="ghost" size="sm" className="text-white hover:text-blue-300 hover:bg-white/10 text-xs md:text-sm">
                  <Crown className="w-4 h-4 mr-1" />
                  King
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Title Section */}
      <section className={`relative z-10 py-8 px-4 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Trophy className="w-8 h-8 md:w-10 md:h-10 text-yellow-400 animate-bounce" />
            <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 bg-clip-text text-transparent">
              LEADERBOARD
            </h1>
          </div>
          <p className="text-slate-400 text-sm md:text-base mb-4">Bảng xếp hạng Year End Party 2026 - Cập nhật realtime</p>
          
          {/* Stats */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-slate-400">
              <Heart className="w-4 h-4 text-red-400" />
              <span>{queenTotalVotes + kingTotalVotes} lượt vote</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <RefreshCw className="w-4 h-4 text-green-400" />
              <span>Cập nhật: {lastUpdate.toLocaleTimeString('vi-VN')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className={`relative z-10 max-w-7xl mx-auto px-4 pb-12 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <Tabs defaultValue="queen" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-slate-800/50 p-1 rounded-xl backdrop-blur-sm border border-slate-700/30">
            <TabsTrigger 
              value="queen" 
              className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all"
            >
              <Crown className="w-4 h-4 mr-2" />
              Queen ({queenCandidates.length})
            </TabsTrigger>
            <TabsTrigger 
              value="king"
              className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white transition-all"
            >
              <Crown className="w-4 h-4 mr-2" />
              King ({kingCandidates.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="queen" className="space-y-6">
            <div className="text-center text-sm text-pink-300/70">
              <Heart className="w-4 h-4 inline mr-1" />
              Tổng: {queenTotalVotes} lượt bình chọn
            </div>
            <TopThreeSection candidates={queenCandidates} color="pink" />
            <RankingsList candidates={queenCandidates} color="pink" />
          </TabsContent>

          <TabsContent value="king" className="space-y-6">
            <div className="text-center text-sm text-blue-300/70">
              <Heart className="w-4 h-4 inline mr-1" />
              Tổng: {kingTotalVotes} lượt bình chọn
            </div>
            <TopThreeSection candidates={kingCandidates} color="blue" />
            <RankingsList candidates={kingCandidates} color="blue" />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 px-4 border-t border-slate-800/50 bg-slate-900/30">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-500 text-xs md:text-sm">© 2026 Year End Party - Let&apos;s Grow!</p>
        </div>
      </footer>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .delay-1000 { animation-delay: 1s; }
      `}</style>
    </div>
  );
}
