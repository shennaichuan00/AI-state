import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, AlertTriangle, Zap, WifiOff, RotateCcw, HelpCircle, Check, Play } from 'lucide-react';

type EdgeCaseTopic = 'concurrency' | 'network' | 'refund';

export default function EdgeCaseSandbox() {
  const [activeTopic, setActiveTopic] = useState<EdgeCaseTopic>('concurrency');
  const [simulating, setSimulating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [refundRule, setRefundRule] = useState<'return' | 'expire_no_return' | 'percentage'>('return');

  const startSimulation = () => {
    setSimulating(true);
    setSimulationResult(null);

    setTimeout(() => {
      setSimulating(false);
      if (activeTopic === 'concurrency') {
        setSimulationResult({
          noLock: {
            status: 'FAIL',
            desc: '😱 并发冲突：由于没有并发锁，10个线程同时读取剩余库存为 1。它们全部判定通过，并同时执行了 INSERT，结果卡券超发了 9 张！公司直接产生严重的资损。',
            oversold: 9
          },
          withLock: {
            status: 'SUCCESS',
            desc: '🛡️ 完美防御：使用 Redis 分布式锁 / `SELECT FOR UPDATE` 数据库行锁。当第1个请求进来时，库存减至 0 并提交事务。后续9个请求在读取时即被提示“已被抢光”，无一超卖！',
            oversold: 0
          }
        });
      } else if (activeTopic === 'network') {
        setSimulationResult({
          noToken: {
            status: 'FAIL',
            desc: '😱 重复发券：用户点击领券，接口响应超时，客户端断网。用户疯狂点击按钮。系统由于没有幂等 Token (Idempotency Key)，把多次请求当成全新请求，创建了 2 张一模一样的卡券！'
          },
          withToken: {
            status: 'SUCCESS',
            desc: '🛡️ 完美防御：客户端在发起请求前生成唯一 `idempotency_token`。第2次超时重试时，服务端识别到相同的 Token，不再新增记录，直接幂等返回第1张券的创建结果。'
          }
        });
      } else {
        // refund
        setSimulationResult({
          ruleApplied: refundRule,
          desc: refundRule === 'return' 
            ? '✅ 【退款且券未到期】: 系统识别到卡券在有效期内，自动退还至用户卡包。卡券状态由 [已使用] ──退款──> [未使用]。有效期不变。'
            : refundRule === 'expire_no_return'
            ? '⚠️ 【已过期卡券不退】: 尽管订单退款了，但系统查询到卡券对应的有效期已截止，判定不予退回，卡券直接沉淀为 [已过期] 状态。避免被薅羊毛。'
            : '💡 【特殊退还规则】: 按比例退还积分，或者发放等额补偿，卡券本身依旧标记为 [已使用]。'
        });
      }
    }, 1500);
  };

  return (
    <div id="edge-case-panel" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md h-full flex flex-col">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-slate-800">
        <h3 className="font-sans font-bold text-slate-100 text-lg flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-400" />
          评审会高频拷问：异常与防御仿真
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          不要等上线出了 Bug 才会补。在 PRD 状态机设计阶段，就把开发想问的所有异常堵死。
        </p>
      </div>

      {/* Select Exception Topic */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <button
          onClick={() => { setActiveTopic('concurrency'); setSimulationResult(null); }}
          className={`px-4 py-3 text-xs font-semibold rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
            activeTopic === 'concurrency'
              ? 'bg-teal-950/40 border-teal-500/80 text-teal-300 shadow-lg'
              : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
          }`}
        >
          <Zap className="w-5 h-5 text-amber-400" />
          <span>并发超卖拷问</span>
        </button>

        <button
          onClick={() => { setActiveTopic('network'); setSimulationResult(null); }}
          className={`px-4 py-3 text-xs font-semibold rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
            activeTopic === 'network'
              ? 'bg-teal-950/40 border-teal-500/80 text-teal-300 shadow-lg'
              : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
          }`}
        >
          <WifiOff className="w-5 h-5 text-rose-400" />
          <span>网络断开重试</span>
        </button>

        <button
          onClick={() => { setActiveTopic('refund'); setSimulationResult(null); }}
          className={`px-4 py-3 text-xs font-semibold rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
            activeTopic === 'refund'
              ? 'bg-teal-950/40 border-teal-500/80 text-teal-300 shadow-lg'
              : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
          }`}
        >
          <RotateCcw className="w-5 h-5 text-indigo-400" />
          <span>订单退款券退不退</span>
        </button>
      </div>

      {/* Interactive configuration area based on topic */}
      <div className="flex-1 bg-slate-950/40 border border-slate-800/60 p-5 rounded-xl mb-6">
        {activeTopic === 'concurrency' && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-200">💥 场景: 秒杀抢券活动中，剩余库存仅剩最后 1 张，而 10 个用户同时点下领券</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              这是开发最喜欢在评审会上问产品的问题：“秒杀时如果库存不够，高并发打进来怎么处理？是扣成负数，还是超卖？” 
            </p>
            <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-lg border border-slate-900">
              <span className="text-xs text-slate-400">虚拟模拟配置:</span>
              <span className="text-xs bg-amber-950/60 text-amber-400 border border-amber-900/40 px-2 py-0.5 rounded">并发线程数 = 10</span>
              <span className="text-xs bg-teal-950/60 text-teal-400 border border-teal-900/40 px-2 py-0.5 rounded">原始可用库存 = 1</span>
            </div>
          </div>
        )}

        {activeTopic === 'network' && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-200">🔌 场景: 用户点击领券，接口响应超时；用户以为没领成功，疯狂反复点击</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              移动网络波动常见。如果没有防重与幂等处理，用户卡包里就会生成多张同样的券，导致成本超限。
            </p>
            <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-lg border border-slate-900">
              <span className="text-xs text-slate-400">状态机应对策略:</span>
              <span className="text-xs bg-indigo-950/60 text-indigo-400 border border-indigo-900/40 px-2 py-0.5 rounded">前端防重点击</span>
              <span className="text-xs bg-rose-950/60 text-rose-400 border border-rose-900/40 px-2 py-0.5 rounded">后端幂等 Token 校验</span>
            </div>
          </div>
        )}

        {activeTopic === 'refund' && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-200">🔄 场景: 用户用券买单后，发生整单退款，已经“已核销”的优惠券是否退还？</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              请选择你在 PRD 中声明的卡券退回规则：
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <label className="flex items-center gap-2 bg-slate-950 p-3 rounded-lg border border-slate-900 cursor-pointer hover:border-slate-800">
                <input
                  type="radio"
                  name="refundRule"
                  checked={refundRule === 'return'}
                  onChange={() => { setRefundRule('return'); setSimulationResult(null); }}
                  className="accent-teal-500"
                />
                <span className="text-xs text-slate-300">未过期全额退券</span>
              </label>

              <label className="flex items-center gap-2 bg-slate-950 p-3 rounded-lg border border-slate-900 cursor-pointer hover:border-slate-800">
                <input
                  type="radio"
                  name="refundRule"
                  checked={refundRule === 'expire_no_return'}
                  onChange={() => { setRefundRule('expire_no_return'); setSimulationResult(null); }}
                  className="accent-teal-500"
                />
                <span className="text-xs text-slate-300">到期不退 (防薅羊毛)</span>
              </label>

              <label className="flex items-center gap-2 bg-slate-950 p-3 rounded-lg border border-slate-900 cursor-pointer hover:border-slate-800">
                <input
                  type="radio"
                  name="refundRule"
                  checked={refundRule === 'percentage'}
                  onChange={() => { setRefundRule('percentage'); setSimulationResult(null); }}
                  className="accent-teal-500"
                />
                <span className="text-xs text-slate-300">特殊补偿/部分扣减</span>
              </label>
            </div>
          </div>
        )}

        {/* Play button */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={startSimulation}
            disabled={simulating}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all shadow-lg shadow-teal-500/20"
          >
            {simulating ? (
              <>
                <div className="w-3 h-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                正在仿真底层计算...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                开始交互仿真
              </>
            )}
          </button>
        </div>
      </div>

      {/* Simulation Result Displays */}
      <div className="min-h-[160px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {simulating && (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-6 text-slate-500 text-xs"
            >
              <div className="w-8 h-8 border-3 border-teal-500/30 border-t-teal-400 rounded-full animate-spin mb-2" />
              正在生成该 PRD 规则下的系统时序流转与异常日志...
            </motion.div>
          )}

          {!simulating && !simulationResult && (
            <motion.div
              key="prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center border border-dashed border-slate-800 p-8 rounded-xl text-slate-500 text-xs"
            >
              <HelpCircle className="w-8 h-8 text-slate-600 mb-2" />
              点击上方“开始交互仿真”按钮，观察不同系统设计下的流转差异！
            </motion.div>
          )}

          {!simulating && simulationResult && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {activeTopic === 'refund' ? (
                /* Refund outcome is custom rule */
                <div className="bg-slate-950/80 p-4 border border-indigo-900/60 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    <span className="font-bold text-slate-200 text-xs">状态机核销规则流转结果</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {simulationResult.desc}
                  </p>
                </div>
              ) : (
                /* Contrast columns for concurrency / network */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* BUG case */}
                  <div className="bg-rose-950/20 border border-rose-900/40 p-4 rounded-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-rose-400 mb-2">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        <span className="text-xs font-bold">方案 A: 仅画页面跳转 (未设计状态机)</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {activeTopic === 'concurrency' ? simulationResult.noLock.desc : simulationResult.noToken.desc}
                      </p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-rose-900/20 flex justify-between items-center text-[10px] text-rose-300 font-bold">
                      <span>评审结果: 开发质问，当场卡壳</span>
                      <span className="bg-rose-900/50 px-2 py-0.5 rounded text-rose-200">❌ PRD重写/事故背锅</span>
                    </div>
                  </div>

                  {/* PERFECT state machine case */}
                  <div className="bg-emerald-950/20 border border-emerald-900/40 p-4 rounded-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-emerald-400 mb-2">
                        <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                        <span className="text-xs font-bold">方案 B: 用状态机卡死逻辑边界 (推荐)</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        {activeTopic === 'concurrency' ? simulationResult.withLock.desc : simulationResult.withToken.desc}
                      </p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-emerald-900/20 flex justify-between items-center text-[10px] text-emerald-300 font-bold">
                      <span>评审结果: 完美闭环，一句话顶回</span>
                      <span className="bg-emerald-900/50 px-2 py-0.5 rounded text-emerald-200">✅ 极速过会/架构安全</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
