'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import VotingGrid from '@/components/voting/VotingGrid';
import { Button } from '@/components/ui/button';
import { Crown, Trophy, Menu, X, Sparkles, Users, Award, TrendingUp } from 'lucide-react';

interface Candidate {
  _id: string;
  name: string;
  image: string;
  votes: number;
  category: 'queen' | 'king';
}

export default function QueenPage() {
  const [mounted, setMounted] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const fetchCandidates = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/candidates?category=queen', { cache: 'no-store' });
      const data = await response.json();
      if (Array.isArray(data)) {
        data.sort((a: Candidate, b: Candidate) => b.votes - a.votes);
        setCandidates(data);
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchCandidates();
    const interval = setInterval(fetchCandidates, 3000);
    return () => clearInterval(interval);
  }, [fetchCandidates]);

  const topThree = candidates.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0a0a] via-[#2d0a0a] to-[#1a0505] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#2d0a0a]/95 to-[#1a0505]/95 backdrop-blur-xl border-b border-pink-500/20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-600 rounded-lg flex items-center justify-center shadow-lg shadow-pink-500/30">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="font-bold text-white">GREENYELLOW</p>
                <p className="text-xs text-pink-300/70">Year End Party 2026</p>
              </div>
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-pink-500/10 transition-colors"
            >
              {menuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/queen/leaderboard">
                <Button variant="ghost" size="sm" className="text-white/80 hover:text-yellow-400 hover:bg-yellow-500/10">
                  <Trophy className="w-4 h-4 mr-2 text-yellow-400" />
                  Bảng xếp hạng
                </Button>
              </Link>
              <Link href="/king">
                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/30">
                  <Crown className="w-4 h-4 mr-2" />
                  Vote King
                </Button>
              </Link>
            </div>
          </nav>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-[#2d0a0a] to-[#1a0505] border-b border-pink-500/20 shadow-lg p-4 space-y-2">
              <Link href="/queen/leaderboard" className="flex items-center gap-3 p-3 rounded-xl hover:bg-pink-500/10 transition-colors">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="font-medium text-white">Bảng xếp hạng Queen</span>
              </Link>
              <Link href="/king" className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-500/10 transition-colors">
                <Crown className="w-5 h-5 text-blue-400" />
                <span className="font-medium text-white">Bình chọn King</span>
              </Link>
              <div className="border-t border-pink-500/20 pt-2 mt-2">
                <Link href="/admin" className="flex items-center gap-3 p-3 rounded-xl hover:bg-pink-500/10 transition-colors">
                  <Users className="w-5 h-5 text-pink-400" />
                  <span className="font-medium text-pink-200/60">Quản trị</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[50vh] sm:h-[55vh] flex items-center justify-center overflow-hidden pt-16">
        {/* Backdrop Image */}
        <div className="absolute inset-0">
          <Image 
            src="https://res.cloudinary.com/dehk1bcny/image/upload/v1738475234/year-end-party-backdrop.jpg"
            alt="Year End Party 2026"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a0a]/70 via-[#2d0a0a]/50 to-[#1a0505]" />
        </div>

        {/* Decorative lights */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500/20 rounded-full blur-[100px]" />
          <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-rose-500/15 rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className={`inline-flex items-center gap-2 px-4 py-2 bg-pink-500/20 border border-pink-500/30 rounded-full mb-4 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span className="text-pink-300 font-medium text-sm">Official Voting Portal</span>
          </div>
          <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 drop-shadow-2xl transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            VOTE FOR <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 bg-clip-text text-transparent">QUEEN</span>
          </h1>
          <p className={`text-lg sm:text-xl text-white/80 font-medium drop-shadow-lg transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            GreenYellow Year End Party 2026
          </p>
        </div>
      </section>

      {/* Top 3 Ranking Section */}
      {topThree.length >= 3 && (
        <section className="py-8 sm:py-12 px-4 bg-gradient-to-b from-[#1a0505] to-[#2d0a0a] relative">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px'}} />
          
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full mb-4">
                <Award className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-300 font-semibold text-sm">RANKING</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Top 3 Hiện Tại</h2>
            </div>

            {/* Top 3 podium */}
            <div className="flex items-end justify-center gap-3 sm:gap-6">
              {/* 2nd Place */}
              <div className={`flex flex-col items-center transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="relative mb-3">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 border-gray-400/50 shadow-xl bg-gradient-to-br from-gray-700 to-gray-800">
                    <Image src={topThree[1]?.image || '/placeholder.svg'} alt={topThree[1]?.name || ''} fill className="object-cover" />
                  </div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center text-gray-900 font-bold text-lg shadow-lg border-2 border-white/20">2</div>
                </div>
                <p className="text-center font-semibold text-white text-sm sm:text-base truncate max-w-[100px] sm:max-w-[140px] mt-2">{topThree[1]?.name}</p>
                <p className="text-pink-400 font-bold text-lg">{topThree[1]?.votes?.toLocaleString()}</p>
                <span className="text-pink-300/60 text-xs">votes</span>
              </div>

              {/* 1st Place */}
              <div className={`flex flex-col items-center -mt-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <Crown className="w-10 h-10 text-yellow-400 mb-2 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                <div className="relative mb-3">
                  <div className="absolute inset-0 bg-yellow-400/30 rounded-2xl blur-xl scale-110" />
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-4 border-yellow-400 shadow-2xl shadow-yellow-500/30 bg-gradient-to-br from-yellow-900/50 to-amber-900/50">
                    <Image src={topThree[0]?.image || '/placeholder.svg'} alt={topThree[0]?.name || ''} fill className="object-cover" />
                  </div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-amber-900 font-bold text-xl shadow-lg border-2 border-white/30">1</div>
                </div>
                <p className="text-center font-bold text-white text-base sm:text-lg truncate max-w-[120px] sm:max-w-[160px] mt-2">{topThree[0]?.name}</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-yellow-400 font-bold text-xl">{topThree[0]?.votes?.toLocaleString()}</span>
                </div>
                <span className="text-yellow-300/60 text-xs">votes</span>
              </div>

              {/* 3rd Place */}
              <div className={`flex flex-col items-center transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="relative mb-3">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 border-amber-600/50 shadow-xl bg-gradient-to-br from-amber-900/50 to-orange-900/50">
                    <Image src={topThree[2]?.image || '/placeholder.svg'} alt={topThree[2]?.name || ''} fill className="object-cover" />
                  </div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-white/20">3</div>
                </div>
                <p className="text-center font-semibold text-white text-sm sm:text-base truncate max-w-[100px] sm:max-w-[140px] mt-2">{topThree[2]?.name}</p>
                <p className="text-pink-400 font-bold text-lg">{topThree[2]?.votes?.toLocaleString()}</p>
                <span className="text-pink-300/60 text-xs">votes</span>
              </div>
            </div>

            {/* View full leaderboard */}
            <div className="text-center mt-10">
              <Link href="/queen/leaderboard">
                <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white px-8 py-3 rounded-full shadow-lg shadow-pink-500/30 font-semibold">
                  <Trophy className="w-4 h-4 mr-2" />
                  Xem Bảng Xếp Hạng Đầy Đủ
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Voting Section */}
      <section className="py-12 px-4 bg-gradient-to-b from-[#2d0a0a] to-[#1a0a0a] relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px'}} />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Contestants</h2>
            <p className="text-pink-200/60 text-sm sm:text-base">
              Nhấn vào ảnh để xem chi tiết • Mỗi thiết bị được vote <span className="text-pink-400 font-semibold">1 lần</span>
            </p>
          </div>
          
          <VotingGrid category="queen" />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0d0505] text-white border-t border-pink-900/30">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-lg">GREENYELLOW</p>
                  <p className="text-pink-300/60 text-sm">Year End Party 2026</p>
                </div>
              </div>
              <p className="text-pink-200/50 text-sm">
                Mã đáo Thành công - Let&apos;s Grow!
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-pink-300">Bình chọn</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/queen" className="text-pink-200/60 hover:text-pink-400 transition-colors text-sm flex items-center gap-2">
                    <Crown className="w-4 h-4 text-pink-400" />
                    Vote Queen
                  </Link>
                </li>
                <li>
                  <Link href="/king" className="text-pink-200/60 hover:text-blue-400 transition-colors text-sm flex items-center gap-2">
                    <Crown className="w-4 h-4 text-blue-400" />
                    Vote King
                  </Link>
                </li>
              </ul>
            </div>

            {/* Leaderboards */}
            <div>
              <h4 className="font-semibold mb-4 text-pink-300">Bảng xếp hạng</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/queen/leaderboard" className="text-pink-200/60 hover:text-yellow-400 transition-colors text-sm flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    Queen Leaderboard
                  </Link>
                </li>
                <li>
                  <Link href="/king/leaderboard" className="text-pink-200/60 hover:text-yellow-400 transition-colors text-sm flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    King Leaderboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Event Info */}
            <div>
              <h4 className="font-semibold mb-4 text-pink-300">Sự kiện</h4>
              <ul className="space-y-2 text-sm text-pink-200/60">
                <li>📅 Ngày 6 tháng 2, 2026</li>
                <li>📍 GreenYellow Vietnam</li>
                <li>🎉 Year End Party</li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-pink-900/30 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-pink-200/40 text-sm">
              © 2026 GreenYellow Vietnam. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-pink-200/40 hover:text-white transition-colors text-sm">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}