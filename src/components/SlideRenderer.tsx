import React, { useState, useEffect } from 'react';
import { Slide, RatioType } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertCircle, ArrowRight, Server, FileText, CheckSquare, 
  Layers, Lock, Sparkles, ShoppingBag, Store, ShieldAlert,
  Zap, WifiOff, RotateCcw, Check, X, HelpCircle, Database, Smartphone, Play
} from 'lucide-react';

interface SlideRendererProps {
  slide: Slide;
  ratio?: RatioType;
}

export default function SlideRenderer({ slide, ratio = '16:9' }: SlideRendererProps) {
  const [timer, setTimer] = useState<number>(10);

  // Auto ticking timer for animations
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => (prev <= 1 ? 10 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isVertical = ratio === '9:16';

  const renderVisualContent = () => {
    switch (slide.visualType) {
      case 'hook':
        return (
          <div className={`flex flex-col items-center text-center select-none relative h-full ${isVertical ? 'justify-start pt-6' : 'justify-center'}`}>
            {/* Top Badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="px-4 py-1.5 bg-rose-950/75 border border-rose-500/40 rounded-full text-rose-400 font-bold text-xs tracking-wider uppercase flex items-center gap-1.5 shadow-lg mb-6"
            >
              <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>黄金痛点开局</span>
            </motion.div>

            {/* Main Question */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className={`font-black tracking-tight text-white leading-tight ${isVertical ? 'text-2xl mt-2 mb-4 px-2' : 'text-3xl md:text-5xl lg:text-6xl max-w-5xl mb-6'}`}
            >
              “活动暂停，用户手里的券，<br />
              过期时间<span className="text-rose-400 underline decoration-rose-500 underline-offset-4 decoration-2">停不停</span>？”
            </motion.h1>

            {/* Visual illustration + Schema */}
            <div className={`flex items-center justify-center gap-6 w-full ${isVertical ? 'flex-col scale-90 mt-1' : 'flex-row max-w-4xl mt-2'}`}>
              
              {/* Campaign Table Node */}
              <motion.div 
                initial={{ x: isVertical ? 0 : -30, y: isVertical ? -20 : 0, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-900/90 p-4 rounded-xl border border-rose-500/30 flex flex-col items-center w-48 shadow-lg"
              >
                <div className="p-2 bg-rose-950/50 rounded-lg mb-2">
                  <Store className="w-6 h-6 text-rose-400" />
                </div>
                <span className="text-[10px] font-bold text-rose-400 font-mono">tb_marketing_campaign</span>
                <span className="text-sm font-black text-slate-100 mt-1">活动表: [已暂停]</span>
                <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping mt-1.5" />
              </motion.div>

              {/* Central Illustration instead of boring arrow */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center justify-center"
              >
                <img 
                  src="/src/assets/images/campaign_dilemma_1782295266865.jpg" 
                  alt="Campaign Dilemma Illustration" 
                  className="w-24 h-24 rounded-2xl border-2 border-amber-500/30 object-cover shadow-lg shadow-amber-950/20"
                  referrerPolicy="no-referrer"
                />
                <div className="flex items-center gap-1 text-amber-300 font-bold font-mono text-[10px] mt-2">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>时间流转？</span>
                </div>
              </motion.div>

              {/* User Coupon Table Node */}
              <motion.div 
                initial={{ x: isVertical ? 0 : 30, y: isVertical ? 20 : 0, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-slate-900/90 p-4 rounded-xl border border-teal-500/30 flex flex-col items-center w-48 shadow-lg"
              >
                <div className="p-2 bg-teal-950/50 rounded-lg mb-2">
                  <ShoppingBag className="w-6 h-6 text-teal-400" />
                </div>
                <span className="text-[10px] font-bold text-teal-400 font-mono">tb_user_coupon</span>
                <span className="text-sm font-black text-slate-100 mt-1">用户券包: [未使用]</span>
                <span className="text-[10px] text-teal-300 font-mono font-bold mt-1.5 animate-pulse">⏰ 正常倒计时</span>
              </motion.div>
            </div>

            {/* Short Slogan */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={`text-slate-400 text-xs mt-6 bg-slate-950/80 px-3 py-1.5 border border-slate-900 rounded-lg max-w-sm ${isVertical ? 'text-[11px] scale-95' : ''}`}
            >
              ❌ 只画跳转不写状态 ── 容易给开发递刀！
            </motion.p>
          </div>
        );

      case 'pain-point':
        return (
          <div className={`flex flex-col items-center select-none h-full ${isVertical ? 'justify-start pt-6' : 'justify-center p-2'}`}>
            {/* Title Section */}
            <div className="text-center space-y-2 mb-4">
              <span className="px-3 py-1 bg-amber-950/60 border border-amber-500/30 text-amber-400 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
                ⚠️ 致命设计痛点
              </span>
              <h2 className={`font-black text-white tracking-tight ${isVertical ? 'text-2xl' : 'text-4xl md:text-5xl'}`}>
                页面是皮 · <span className="text-teal-400">状态是骨</span>
              </h2>
              <p className="text-xs text-slate-400">没有状态机，开发全靠猜，上线背锅！</p>
            </div>

            {/* Core Metaphor Illustration */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-4"
            >
              <img 
                src="/src/assets/images/robotic_core_1782295282964.jpg" 
                alt="Skin vs Bone Metaphor" 
                className={`${isVertical ? 'w-24 h-24' : 'w-32 h-32'} rounded-2xl border-2 border-teal-500/30 object-cover shadow-xl shadow-teal-950/30`}
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Contrast Graphics Container */}
            <div className={`flex w-full gap-4 justify-center items-stretch ${isVertical ? 'flex-col max-w-xs' : 'flex-row max-w-3xl'}`}>
              {/* Bad Case */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className={`flex-1 bg-slate-900/80 border border-rose-500/30 p-4 rounded-xl flex flex-col items-center justify-between text-center relative overflow-hidden ${isVertical ? 'py-3' : 'min-h-[140px]'}`}
              >
                <div className="absolute top-2 right-2 bg-rose-950 text-rose-400 border border-rose-800/40 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">
                  肤浅
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone className="w-5 h-5 text-rose-400" />
                  <h4 className="text-slate-100 font-bold text-xs">❌ 静态原型图</h4>
                </div>
                <p className="text-[10px] text-slate-500 leading-snug">
                  只管页面跳转。状态与边界靠开发盲猜。
                </p>
              </motion.div>

              {/* Good Case */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className={`flex-1 bg-slate-900/80 border border-teal-500/30 p-4 rounded-xl flex flex-col items-center justify-between text-center relative overflow-hidden ${isVertical ? 'py-3' : 'min-h-[140px]'}`}
              >
                <div className="absolute top-2 right-2 bg-teal-950 text-teal-400 border border-teal-800/40 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">
                  骨干
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-5 h-5 text-teal-400 animate-pulse" />
                  <h4 className="text-slate-100 font-bold text-xs">✅ 状态机流转</h4>
                </div>
                <p className="text-[10px] text-slate-400 leading-snug">
                  精准定义 Enum。前置规则与异常边界全锁死。
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'step-1':
        return (
          <div className={`flex flex-col items-center select-none h-full ${isVertical ? 'justify-start pt-6' : 'justify-center p-2'}`}>
            {/* Top Header */}
            <div className="text-center mb-6 space-y-1">
              <span className="px-3 py-0.5 bg-teal-950/60 border border-teal-500/30 text-teal-400 rounded-full text-xs font-mono font-bold tracking-widest uppercase">
                Step 1: 一拆
              </span>
              <h2 className={`font-black text-white tracking-tight ${isVertical ? 'text-2xl' : 'text-4xl'}`}>
                拆！建立清晰实体边界
              </h2>
              <p className="text-xs text-slate-400 max-w-xl">
                将核心业务完全解耦，拆分为 5 张表：
              </p>
            </div>

            {/* 5 Circular Nodes with Connecting Arrows */}
            <div className={`flex items-center justify-center gap-2 max-w-4xl w-full ${isVertical ? 'flex-col scale-90' : 'flex-row'}`}>
              {[
                { name: '活动表', table: 'tb_campaign', icon: Store, color: 'border-indigo-500/30 text-indigo-400 bg-indigo-950/20' },
                { name: '券模板', table: 'tb_template', icon: Server, color: 'border-teal-500/30 text-teal-400 bg-teal-950/20' },
                { name: '用户券', table: 'tb_user_coupon', icon: ShoppingBag, color: 'border-amber-500/30 text-amber-400 bg-amber-950/20' },
                { name: '审批单', table: 'tb_audit', icon: FileText, color: 'border-purple-500/30 text-purple-400 bg-purple-950/20' },
                { name: '定时任务', table: 'tb_system_task', icon: CheckSquare, color: 'border-rose-500/30 text-rose-400 bg-rose-950/20' }
              ].map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <React.Fragment key={idx}>
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: idx * 0.08 }}
                      className={`border ${item.color} p-2.5 rounded-xl flex flex-col items-center text-center shadow-md relative ${isVertical ? 'w-44 py-1.5 flex-row gap-3 text-left justify-start' : 'flex-1 min-w-[100px]'}`}
                    >
                      <div className="p-1.5 bg-slate-950 rounded-lg">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-100">{item.name}</h4>
                        <span className="text-[8px] font-mono text-slate-500 block">{item.table}</span>
                      </div>
                    </motion.div>
                    {idx < 4 && !isVertical && (
                      <span className="text-slate-700 font-bold text-sm">
                        →
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        );

      case 'step-2':
        return (
          <div className={`flex flex-col items-center select-none h-full ${isVertical ? 'justify-start pt-6' : 'justify-center p-2'}`}>
            {/* Title */}
            <div className="text-center space-y-1 mb-6">
              <span className="px-3 py-0.5 bg-teal-950/60 border border-teal-500/30 text-teal-400 rounded-full text-xs font-mono font-bold uppercase">
                Step 2: 二锁
              </span>
              <h2 className={`font-black text-white tracking-tight ${isVertical ? 'text-2xl' : 'text-4xl'}`}>
                锁！每个实体只留3~8个状态
              </h2>
              <p className="text-xs text-slate-400">
                状态词必须精简唯一。杜绝将动作/事件当状态！
              </p>
            </div>

            {/* Interactive Card */}
            <div className={`w-full bg-slate-900/85 border border-slate-800 p-4 rounded-2xl shadow-lg space-y-3 ${isVertical ? 'max-w-xs' : 'max-w-xl'}`}>
              <div className="flex justify-between items-center text-[10px] border-b border-slate-800 pb-1.5">
                <span className="text-slate-400 font-bold uppercase">黄金判别法则</span>
                <span className="text-[9px] text-teal-400 font-mono">DML Event vs Enum State</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Event Column */}
                <div className="bg-rose-950/15 border border-rose-900/10 p-3 rounded-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-rose-400 mb-1">
                      <X className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-bold uppercase">❌ 动作/事件</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      用户点击、触发审批、去付款、暂停。
                    </p>
                  </div>
                  <span className="text-[8px] text-rose-300 font-mono mt-2 bg-rose-950/40 px-1.5 py-0.5 rounded w-max">
                    输入动作 Input
                  </span>
                </div>

                {/* State Column */}
                <div className="bg-emerald-950/15 border border-emerald-900/10 p-3 rounded-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-emerald-400 mb-1">
                      <Check className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-bold uppercase">✅ 状态</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      已暂停、待审核、未使用、已过期。
                    </p>
                  </div>
                  <span className="text-[8px] text-emerald-300 font-mono mt-2 bg-emerald-950/40 px-1.5 py-0.5 rounded w-max">
                    库里存储 Value
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'step-3':
        return (
          <div className={`flex flex-col items-center select-none h-full ${isVertical ? 'justify-start pt-6' : 'justify-center p-2'}`}>
            {/* Top Header */}
            <div className="text-center mb-6 space-y-1">
              <span className="px-3 py-0.5 bg-teal-950/60 border border-teal-500/30 text-teal-400 rounded-full text-xs font-mono font-bold tracking-widest uppercase">
                Step 3: 三逼
              </span>
              <h2 className={`font-black text-white tracking-tight ${isVertical ? 'text-2xl' : 'text-4xl'}`}>
                逼！丢掉段落，只要表
              </h2>
              <p className="text-xs text-slate-400">
                直接输出标准的“二维状态转移矩阵”，拒绝大段落！
              </p>
            </div>

            {/* Standard Visual Three-Tuple Formula */}
            <div className={`grid gap-3 w-full bg-slate-900/80 p-4 rounded-2xl border border-slate-800 ${isVertical ? 'grid-cols-1 max-w-xs' : 'grid-cols-3 max-w-2xl'}`}>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 flex flex-col items-center">
                <span className="text-[9px] font-mono text-slate-500 uppercase">Current State</span>
                <span className="text-xs font-bold text-slate-300 mt-1">当前状态 (Current)</span>
                <span className="bg-amber-950/40 border border-amber-900/30 text-amber-400 px-2 py-0.5 rounded font-mono text-[10px] mt-1.5">
                  Draft (草稿)
                </span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 flex flex-col items-center justify-center">
                <span className="text-[9px] font-mono text-teal-400 uppercase">Trigger Event</span>
                <span className="text-xs font-bold text-teal-400 mt-1">+ 触发事件 (Event)</span>
                <span className="bg-teal-950/40 border border-teal-900/30 text-teal-400 px-2 py-0.5 rounded font-mono text-[10px] mt-1.5">
                  Submit (提交)
                </span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 flex flex-col items-center">
                <span className="text-[9px] font-mono text-emerald-400 uppercase">Next State</span>
                <span className="text-xs font-bold text-emerald-400 mt-1">= 新状态 (Next)</span>
                <span className="bg-emerald-950/40 border border-emerald-900/30 text-emerald-400 px-2 py-0.5 rounded font-mono text-[10px] mt-1.5">
                  Pending (待核)
                </span>
              </div>
            </div>
          </div>
        );

      case 'answer':
        return (
          <div className={`flex flex-col items-center select-none h-full ${isVertical ? 'justify-start pt-6' : 'justify-center p-2'}`}>
            {/* Header */}
            <div className="text-center mb-4 space-y-1">
              <span className="px-3 py-0.5 bg-teal-950/60 border border-teal-500/30 text-teal-400 rounded-full text-xs font-mono font-bold uppercase">
                💡 终极揭秘 · 物理心法
              </span>
              <h2 className={`font-black text-white tracking-tight ${isVertical ? 'text-2xl' : 'text-4xl'}`}>
                活动管发 · <span className="text-teal-400">卡券管用</span>
              </h2>
            </div>

            {/* Bread illustration */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-4"
            >
              <img 
                src="/src/assets/images/bread_analogy_1782295298975.jpg" 
                alt="Digital Bread Analogy Illustration" 
                className={`${isVertical ? 'w-24 h-24' : 'w-32 h-32'} rounded-2xl border-2 border-emerald-500/30 object-cover shadow-xl shadow-emerald-950/30`}
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <p className="text-xs text-slate-400 px-4 text-center max-w-lg mb-4">
              💡 <strong>面包隐喻：</strong> 超市暂停营业，你已经买回家的面包（用户券）会提前过期吗？不会！它的生命周期由它自身决定。
            </p>

            {/* Metaphor graphics column */}
            <div className={`grid gap-4 w-full justify-center ${isVertical ? 'grid-cols-1 max-w-xs scale-95' : 'grid-cols-2 max-w-xl'}`}>
              <div className="bg-slate-900/95 border border-rose-500/20 p-3 rounded-xl flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-1.5 right-1.5 bg-rose-950 text-rose-400 text-[8px] font-bold px-1 rounded">
                  OFFLINE
                </div>
                <div className="p-1.5 bg-rose-950/40 rounded-full mb-1">
                  <Store className="w-5 h-5 text-rose-400 animate-pulse" />
                </div>
                <h4 className="text-xs font-bold text-slate-300">超市 (运营活动)</h4>
                <p className="text-[9px] text-slate-500">tb_marketing_campaign = PAUSED</p>
                <div className="mt-1 text-[9px] bg-rose-950/20 text-rose-300 px-2 py-0.5 rounded">
                  仅关闭领券
                </div>
              </div>

              <div className="bg-slate-900/95 border border-emerald-500/20 p-3 rounded-xl flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-1.5 right-1.5 bg-emerald-950 text-emerald-400 text-[8px] font-bold px-1 rounded animate-pulse">
                  TICKING
                </div>
                <div className="p-1.5 bg-emerald-950/40 rounded-full mb-1">
                  <ShoppingBag className="w-5 h-5 text-emerald-400" />
                </div>
                <h4 className="text-xs font-bold text-slate-300">面包 (用户卡券)</h4>
                <p className="text-[9px] text-slate-500">tb_user_coupon = UNUSED</p>
                <div className="mt-1 text-[9px] bg-emerald-950/40 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
                  ⏰ 正常计时 {timer}s
                </div>
              </div>
            </div>
          </div>
        );

      case 'edge-cases':
        return (
          <div className={`flex flex-col items-center select-none h-full ${isVertical ? 'justify-start pt-6' : 'justify-center p-2'}`}>
            {/* Header */}
            <div className="text-center mb-6 space-y-1">
              <span className="px-3 py-0.5 bg-indigo-950/60 border border-indigo-500/30 text-indigo-400 rounded-full text-xs font-mono font-bold tracking-widest uppercase">
                🛡️ 异常防身
              </span>
              <h2 className={`font-black text-white tracking-tight ${isVertical ? 'text-2xl' : 'text-4xl'}`}>
                高频拷问：三高防身符
              </h2>
              <p className="text-xs text-slate-400">
                开发提异常？用这三套经典状态机机制秒杀：
              </p>
            </div>

            {/* Three visual cards */}
            <div className={`grid gap-3 w-full justify-center ${isVertical ? 'grid-cols-1 max-w-xs scale-90' : 'grid-cols-3 max-w-2xl'}`}>
              <div className="bg-slate-900/80 p-3 border border-amber-500/20 rounded-xl flex flex-col items-center text-center">
                <div className="p-1.5 bg-amber-950/40 rounded-lg mb-1.5 text-amber-400">
                  <Zap className="w-5 h-5 animate-bounce" />
                </div>
                <h4 className="text-slate-100 font-bold text-xs">并发防超卖</h4>
                <span className="text-[8px] font-mono text-amber-400 bg-amber-950/30 border border-amber-900/20 px-1.5 py-0.5 rounded mt-1">
                  Row Lock
                </span>
              </div>

              <div className="bg-slate-900/80 p-3 border border-rose-500/20 rounded-xl flex flex-col items-center text-center">
                <div className="p-1.5 bg-rose-950/40 rounded-lg mb-1.5 text-rose-400">
                  <WifiOff className="w-5 h-5 animate-pulse" />
                </div>
                <h4 className="text-slate-100 font-bold text-xs">断网幂等令牌</h4>
                <span className="text-[8px] font-mono text-rose-400 bg-rose-950/30 border border-rose-900/20 px-1.5 py-0.5 rounded mt-1">
                  Idempotency
                </span>
              </div>

              <div className="bg-slate-900/80 p-3 border border-indigo-500/20 rounded-xl flex flex-col items-center text-center">
                <div className="p-1.5 bg-indigo-950/40 rounded-lg mb-1.5 text-indigo-400">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <h4 className="text-slate-100 font-bold text-xs">退款合法状态</h4>
                <span className="text-[8px] font-mono text-indigo-400 bg-indigo-950/30 border border-indigo-900/20 px-1.5 py-0.5 rounded mt-1">
                  Status Revert
                </span>
              </div>
            </div>
          </div>
        );

      case 'outro':
        return (
          <div className={`flex flex-col items-center text-center select-none relative h-full ${isVertical ? 'justify-start pt-6' : 'justify-center'}`}>
            {/* Sparkles */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="px-4 py-1.5 bg-teal-950/40 border border-teal-500/30 rounded-full text-teal-400 font-bold text-xs tracking-wider uppercase flex items-center gap-2 mb-6"
            >
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>一表封神</span>
            </motion.div>

            {/* Summary Formula */}
            <h2 className={`font-black tracking-tight text-white leading-tight ${isVertical ? 'text-xl px-2' : 'text-3xl md:text-5xl lg:text-6xl max-w-4xl'}`}>
              “一拆实体，二锁状态，三逼矩阵”
            </h2>

            {/* Slogan */}
            <p className={`text-slate-400 font-medium mt-4 ${isVertical ? 'text-xs' : 'text-lg max-w-xl'}`}>
              页面是皮，状态是骨。<br />
              用状态机卡死逻辑边界，做无懈可击的产品经理！
            </p>

            {/* Hint */}
            <div className="mt-6 bg-teal-950/20 border border-teal-500/30 px-4 py-2 rounded-xl flex items-center gap-2 max-w-xs justify-center mx-auto shadow">
              <Database className="w-4 h-4 text-teal-400 animate-bounce" />
              <span className="text-[10px] text-teal-300 font-bold">
                点击右侧复制状态机 PRD 代码！
              </span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div id={`slide-stage-${slide.id}`} className="w-full h-full text-slate-200">
      {renderVisualContent()}
    </div>
  );
}
