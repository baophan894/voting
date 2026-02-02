'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Crown, Trophy, ArrowLeft, RefreshCw, Heart, TrendingUp, Users, Menu, X } from 'lucide-react';

interface Candidate {
  _id: string;
  name: string;
  image: string;
  votes: number;
  category: 'queen' | 'king';
}

export default function KingLeaderboardPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [menuOpen, setMenuOpen] = useState(false);

  const fetchCandidates = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/candidates?category=king', {
        cache: 'no-store',
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        data.sort((a: Candidate, b: Candidate) => b.votes - a.votes);
        setCandidates(data);
        setLastUpdate(new Date());
      }
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

  const totalVotes = candidates.reduce((acc, c) => acc + c.votes, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-slate-400">Đang tải bảng xếp hạng...</p>
        </div>
      </div>
    );
  }

  const topThree = candidates.slice(0, 3);
  const rest = candidates.slice(3, 13);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <div className="hidden sm:block">
                <p className="font-bold text-white text-sm">GREENYELLOW</p>
                <p className="text-[10px] text-slate-400">Year End Party 2026</p>
              </div>
            </Link>
            
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              {menuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>

            <div className="hidden md:flex items-center gap-2">
              <Link href="/king">
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Bình chọn King
                </Button>
              </Link>
              <Link href="/queen/leaderboard">
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-pink-400 hover:bg-pink-500/10">
                  <Crown className="w-4 h-4 mr-2 text-pink-400" />
                  Queen Leaderboard
                </Button>
              </Link>
            </div>
          </nav>

          {menuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900 border-b border-slate-700 p-4 space-y-2">
              <Link href="/king" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-colors">
                <Heart className="w-5 h-5 text-emerald-400" />
                <span className="font-medium text-slate-200">Bình chọn King</span>
              </Link>
              <Link href="/queen" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-colors">
                <Crown className="w-5 h-5 text-pink-400" />
                <span className="font-medium text-slate-200">Bình chọn Queen</span>
              </Link>
              <Link href="/queen/leaderboard" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-colors">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="font-medium text-slate-200">Queen Leaderboard</span>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className={`pt-24 pb-8 px-4 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl shadow-lg shadow-yellow-500/30 mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-2">
            <span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">LEADERBOARD</span>
          </h1>
          <p className="text-slate-400">King - Year End Party 2026</p>
        </div>
      </section>

      {/* Top 3 Section - Large Cards */}
      {topThree.length >= 3 && (
        <section className={`max-w-5xl mx-auto px-4 mb-12 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-end justify-center gap-4 md:gap-8">
            {/* 2nd Place */}
            <div className="flex flex-col items-center">
              <div className="relative">
                {/* Card */}
                <div className="relative w-32 h-44 sm:w-40 sm:h-56 md:w-48 md:h-64 rounded-2xl overflow-hidden border-4 border-slate-500 shadow-2xl bg-slate-800">
                  <Image 
                    src={topThree[1]?.image || '/placeholder.svg'} 
                    alt={topThree[1]?.name || ''} 
                    fill 
                    className="object-cover" 
                  />
                  {/* Rank Badge */}
                  <div className="absolute top-2 left-2 w-8 h-8 bg-gradient-to-br from-slate-300 to-slate-500 rounded-lg flex items-center justify-center text-slate-900 font-bold shadow-lg">
                    #2
                  </div>
                  {/* Name overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3">
                    <p className="text-white font-bold text-sm truncate">{topThree[1]?.name}</p>
                  </div>
                </div>
              </div>
              {/* Votes */}
              <div className="mt-3 text-center">
                <p className="text-2xl md:text-3xl font-bold text-white">{topThree[1]?.votes}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Lượt bình chọn</p>
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center -mt-8">
              <Crown className="w-10 h-10 md:w-12 md:h-12 text-yellow-400 mb-2 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" />
              <div className="relative">
                {/* Winner glow */}
                <div className="absolute -inset-2 bg-gradient-to-br from-yellow-400/30 to-amber-500/30 rounded-3xl blur-xl" />
                {/* Card */}
                <div className="relative w-40 h-56 sm:w-52 sm:h-72 md:w-56 md:h-80 rounded-2xl overflow-hidden border-4 border-yellow-400 shadow-2xl shadow-yellow-500/30 bg-slate-800">
                  <Image 
                    src={topThree[0]?.image || '/placeholder.svg'} 
                    alt={topThree[0]?.name || ''} 
                    fill 
                    className="object-cover" 
                  />
                  {/* Winner Badge */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
                    <p className="text-white font-bold text-base md:text-lg truncate">{topThree[0]?.name}</p>
                    <div className="flex items-center justify-center mt-1">
                      <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full text-xs font-bold text-slate-900">WINNER</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Votes */}
              <div className="mt-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className="w-5 h-5 text-yellow-400" />
                  <p className="text-3xl md:text-4xl font-bold text-yellow-400">{topThree[0]?.votes}</p>
                </div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Lượt bình chọn</p>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center">
              <div className="relative">
                {/* Card */}
                <div className="relative w-32 h-44 sm:w-40 sm:h-56 md:w-48 md:h-64 rounded-2xl overflow-hidden border-4 border-amber-600 shadow-2xl bg-slate-800">
                  <Image 
                    src={topThree[2]?.image || '/placeholder.svg'} 
                    alt={topThree[2]?.name || ''} 
                    fill 
                    className="object-cover" 
                  />
                  {/* Rank Badge */}
                  <div className="absolute top-2 left-2 w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                    #3
                  </div>
                  {/* Name overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3">
                    <p className="text-white font-bold text-sm truncate">{topThree[2]?.name}</p>
                  </div>
                </div>
              </div>
              {/* Votes */}
              <div className="mt-3 text-center">
                <p className="text-2xl md:text-3xl font-bold text-white">{topThree[2]?.votes}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Lượt bình chọn</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Rest of Rankings - Alternating Background */}
      {rest.length > 0 && (
        <section className={`max-w-3xl mx-auto px-4 pb-12 transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="space-y-2">
            {rest.map((candidate, index) => (
              <div
                key={candidate._id}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
                  index % 2 === 0 ? 'bg-slate-800/80' : 'bg-slate-700/50'
                } hover:bg-slate-700`}
              >
                <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center font-bold text-slate-300 text-sm">
                  #{index + 4}
                </div>
                <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-slate-600 flex-shrink-0 bg-slate-700">
                  <Image
                    src={candidate.image || '/placeholder.svg'}
                    alt={candidate.name}
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{candidate.name}</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/20 px-4 py-2 rounded-full">
                  <p className="text-emerald-400 font-bold text-lg">{candidate.votes}</p>
                  <span className="text-emerald-400/60 text-xs">votes</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {candidates.length === 0 && (
        <div className="text-center py-20">
          <Crown className="w-16 h-16 mx-auto mb-4 text-slate-600" />
          <p className="text-slate-400">Chưa có ứng viên nào</p>
        </div>
      )}

      {/* Footer */}
      <footer className="relative bg-slate-900 text-white py-8 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">G</span>
            </div>
            <div>
              <p className="font-bold">GREENYELLOW</p>
              <p className="text-slate-400 text-sm">Year End Party 2026</p>
            </div>
          </div>
          <p className="text-slate-500 text-sm">© 2026 GreenYellow Vietnam. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
