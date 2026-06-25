import React, { useState } from 'react';
import { SLIDES_DATA } from '../data';
import { RatioType, ThemeType } from '../types';
import SlideRenderer from './SlideRenderer';
import StateMachineVisualizer from './StateMachineVisualizer';
import StateTable from './StateTable';
import EdgeCaseSandbox from './EdgeCaseSandbox';
import { 
  ChevronLeft, ChevronRight, Monitor, Smartphone, Palette, 
  Layers, BookOpen, Zap, PlaySquare, Eye, EyeOff
} from 'lucide-react';

export default function PresentationController() {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [ratio, setRatio] = useState<RatioType>('16:9');
  const [theme, setTheme] = useState<ThemeType>('neon-slate');
  const [activeTab, setActiveTab] = useState<'slides' | 'sandbox' | 'matrix' | 'exceptions'>('slides');
  const [showSubtitleOverlay, setShowSubtitleOverlay] = useState<boolean>(true);

  const activeSlide = SLIDES_DATA[currentIdx];

  const handleNext = () => {
    if (currentIdx < SLIDES_DATA.length - 1) {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  // Theme-specific CSS classes
  const getThemeClass = () => {
    switch (theme) {
      case 'editorial-dark':
        return 'bg-neutral-950 text-neutral-100 font-serif';
      case 'neon-slate':
        return 'bg-slate-950 text-slate-100 font-sans border-slate-850';
      case 'minimal-light':
        return 'bg-white text-slate-900 border-slate-200';
      case 'retro-terminal':
        return 'bg-black text-emerald-400 font-mono border-emerald-950/40';
    }
  };

  return (
    <div id="presentation-deck-workspace" className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      
      {/* 1. TOP FULL-SCREEN NAVIGATION HEADER */}
      <header id="presentation-header" className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 bg-slate-900/80 border-b border-slate-800/60 backdrop-blur-md z-30">
        
        {/* Left branding */}
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 bg-teal-400 rounded-full animate-pulse shadow-lg shadow-teal-500/50" />
          <div className="flex flex-col">
            <h1 className="text-sm font-black tracking-tight text-slate-100">产品经理“状态机设计”</h1>
            <span className="text-[10px] text-slate-500 font-mono tracking-wider">STATE_MACHINE_STUDIO</span>
          </div>
        </div>

        {/* Center: Full-width responsive tab buttons */}
        <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 max-w-lg w-full md:w-auto">
          <button
            id="tab-slides"
            onClick={() => setActiveTab('slides')}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'slides' 
                ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/10 font-black' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PlaySquare className="w-3.5 h-3.5" />
            幻灯片演示
          </button>

          <button
            id="tab-sandbox"
            onClick={() => setActiveTab('sandbox')}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'sandbox' 
                ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/10 font-black' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            状态沙盒
          </button>

          <button
            id="tab-matrix"
            onClick={() => setActiveTab('matrix')}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'matrix' 
                ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/10 font-black' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            PRD矩阵
          </button>

          <button
            id="tab-exceptions"
            onClick={() => setActiveTab('exceptions')}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'exceptions' 
                ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/10 font-black' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            异常测试
          </button>
        </div>

        {/* Right side global controls (Aesthetic customization) */}
        <div className="flex items-center gap-3.5 text-xs text-slate-400">
          
          {/* Ratio Selector - only visible when presentation slide is active */}
          {activeTab === 'slides' && (
            <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">尺寸:</span>
              <button
                id="ratio-16-9"
                onClick={() => setRatio('16:9')}
                className={`p-1 rounded cursor-pointer transition-colors ${ratio === '16:9' ? 'text-teal-400 bg-slate-900 font-bold' : 'hover:text-slate-200'}`}
                title="16:9 宽屏"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                id="ratio-9-16"
                onClick={() => setRatio('9:16')}
                className={`p-1 rounded cursor-pointer transition-colors ${ratio === '9:16' ? 'text-teal-400 bg-slate-900 font-bold' : 'hover:text-slate-200'}`}
                title="9:16 竖屏"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Subtitle Collision Overlay Toggle for 9:16 creators */}
          {activeTab === 'slides' && ratio === '9:16' && (
            <button
              onClick={() => setShowSubtitleOverlay(!showSubtitleOverlay)}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all border cursor-pointer ${
                showSubtitleOverlay 
                  ? 'bg-rose-950/80 border-rose-500/40 text-rose-400 shadow-md' 
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="评估短视频字幕与博主遮挡区"
            >
              {showSubtitleOverlay ? <Eye className="w-3.5 h-3.5 text-rose-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>遮挡评估: {showSubtitleOverlay ? '开启' : '关闭'}</span>
            </button>
          )}

          {/* Theme selection */}
          {activeTab === 'slides' && (
            <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <Palette className="w-3.5 h-3.5 text-slate-500" />
              <select
                id="theme-selector"
                value={theme}
                onChange={(e) => setTheme(e.target.value as ThemeType)}
                className="bg-transparent text-slate-300 font-bold focus:outline-none cursor-pointer pr-1 text-xs"
              >
                <option value="neon-slate">💎 极客深海蓝</option>
                <option value="editorial-dark">🖋️ 雅致暮色黑</option>
                <option value="minimal-light">🧁 极简高级白</option>
                <option value="retro-terminal">📟 复古黑客绿</option>
              </select>
            </div>
          )}
        </div>
      </header>

      {/* 2. FULL SCREEN CONTENT VIEWPORT */}
      <main id="presentation-viewport" className="flex-1 overflow-hidden relative bg-slate-950/40">
        
        {/* Tab 1: Slide Presentation View */}
        {activeTab === 'slides' && (
          <div className="w-full h-full flex items-center justify-center p-4 md:p-8 relative">
            
            {/* Left Absolute Chevron Navigation Button */}
            {currentIdx > 0 && (
              <button
                id="floating-prev"
                onClick={handlePrev}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-full transition-all cursor-pointer shadow-xl z-30"
                title="上一页"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Right Absolute Chevron Navigation Button */}
            {currentIdx < SLIDES_DATA.length - 1 && (
              <button
                id="floating-next"
                onClick={handleNext}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-full transition-all cursor-pointer shadow-xl z-30"
                title="下一页"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Centered slide wrapper with selected ratio */}
            <div 
              id="slide-monitor"
              className={`transition-all duration-300 shadow-2xl overflow-hidden relative flex flex-col justify-center border ${getThemeClass()} ${
                ratio === '16:9' 
                  ? 'w-full aspect-video rounded-2xl max-w-5xl' 
                  : ratio === '9:16'
                  ? 'h-full aspect-[9/16] rounded-3xl max-h-[720px] shadow-teal-950/20 shadow-xl'
                  : 'w-full h-full rounded-2xl'
              }`}
            >
              {/* Grid pattern overlay */}
              {theme === 'neon-slate' && (
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
              )}

              {/* Slide Counter Indicator */}
              <div className="absolute left-6 top-6 bg-slate-900/80 border border-slate-800/60 px-2.5 py-1 rounded-md text-[10px] font-mono text-slate-400 font-bold">
                PAGE {currentIdx + 1} / {SLIDES_DATA.length}
              </div>

              {/* Active Slide Renderer */}
              <div className={`w-full h-full flex flex-col ${ratio === '9:16' ? 'justify-start pt-14 pb-48 px-4 overflow-hidden' : 'justify-center p-6 md:p-12'}`}>
                <SlideRenderer slide={activeSlide} ratio={ratio} />
              </div>

              {/* Douyin Player Mockup (only for 9:16 aspect ratio screen testing) */}
              {ratio === '9:16' && showSubtitleOverlay && (
                <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-4 z-20">
                  {/* Simulated Top Feed tabs */}
                  <div className="w-full flex justify-between items-center text-[10px] text-white/40 font-bold px-4 pt-1">
                    <span>推荐</span>
                    <div className="flex gap-2 text-white/60 font-black">
                      <span className="border-b-2 border-white pb-0.5">关注</span>
                      <span>商城</span>
                      <span>推荐</span>
                      <span>同城</span>
                    </div>
                    <span className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center">🔍</span>
                  </div>

                  {/* Simulated bottom information stack */}
                  <div className="w-full mt-auto flex flex-col justify-end">
                    
                    {/* Caption guideline */}
                    <div className="w-full border-t border-dashed border-rose-500/50 flex justify-between items-center px-2 py-1 text-[8px] font-mono text-rose-400 bg-rose-950/60 backdrop-blur-[1px] mb-3">
                      <span>⚠️ 下方为视频字幕与博主遮挡区 (已完美避让)</span>
                      <span className="animate-pulse">COLLISION AREA</span>
                    </div>

                    <div className="flex justify-between items-end">
                      {/* Left stack: metadata & actual subtitle sync */}
                      <div className="flex-1 max-w-[75%] text-left space-y-1.5 pb-2 text-white/70">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-extrabold text-white">@产品说状态机</span>
                          <span className="text-[9px] bg-rose-600 text-white font-bold px-1 rounded">作者</span>
                        </div>
                        <p className="text-[10px] leading-relaxed text-white/90">
                          页面是皮，状态是骨。用状态机锁定异常边界，做逻辑无懈可击的产品经理！
                        </p>
                        
                        {/* Synced Subtitle container */}
                        <div className="bg-black/80 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold text-teal-300 flex items-center gap-1.5 mt-1 shadow-lg">
                          <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                          <span className="text-[11px] text-white">🎬 [字幕同步] {activeSlide.speech.substring(0, 24)}...</span>
                        </div>
                      </div>

                      {/* Right stack: simulated UI icons */}
                      <div className="flex flex-col items-center gap-3.5 pb-4 pl-2 text-white/80">
                        <div className="relative mb-1">
                          <div className="w-7 h-7 rounded-full bg-slate-800 border border-white flex items-center justify-center text-[10px] font-bold">PM</div>
                          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-rose-500 text-white rounded-full text-[8px] font-bold px-0.5 leading-none">+</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-rose-500 text-sm">❤️</span>
                          <span className="text-[8px] font-mono mt-0.5">12.8w</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-slate-100 text-sm">💬</span>
                          <span className="text-[8px] font-mono mt-0.5">4.3k</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-yellow-400 text-sm">⭐</span>
                          <span className="text-[8px] font-mono mt-0.5">8.2w</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-slate-100 text-sm">↗️</span>
                          <span className="text-[8px] font-mono mt-0.5">1.2w</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom simulated navigation */}
                    <div className="w-full border-t border-white/5 pt-2 mt-2 flex justify-around text-[9px] text-white/50 font-bold">
                      <span className="text-white">首页</span>
                      <span>朋友</span>
                      <span className="bg-white text-black px-1.5 py-0.5 rounded font-black">+</span>
                      <span>消息</span>
                      <span>我</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Full-screen Interactive State Machine Sandbox */}
        {activeTab === 'sandbox' && (
          <div className="w-full h-full p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto">
            <StateMachineVisualizer />
          </div>
        )}

        {/* Tab 3: Full-screen PRD State Transition Table Matrix */}
        {activeTab === 'matrix' && (
          <div className="w-full h-full p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto">
            <StateTable />
          </div>
        )}

        {/* Tab 4: Full-screen High-concurrency & Exceptions Sandbox */}
        {activeTab === 'exceptions' && (
          <div className="w-full h-full p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto">
            <EdgeCaseSandbox />
          </div>
        )}

      </main>

    </div>
  );
}
