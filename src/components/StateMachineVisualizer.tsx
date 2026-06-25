import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RefreshCw, AlertCircle, CheckCircle, ArrowRight, User, Award, Layers } from 'lucide-react';
import { CampaignState, CouponTemplateState, UserCouponState } from '../types';

export default function StateMachineVisualizer() {
  // Campaign State
  const [campaignState, setCampaignState] = useState<CampaignState>('PUBLISHED');
  // Template State
  const [templateState, setTemplateState] = useState<CouponTemplateState>('ACTIVE');
  const [templateStock, setTemplateStock] = useState<number>(5);
  // User Coupon State
  const [userCouponState, setUserCouponState] = useState<UserCouponState>('UNUSED');
  const [userCouponTimeLeft, setUserCouponTimeLeft] = useState<number>(15); // simulated seconds till expire
  const [hasUserCoupon, setHasUserCoupon] = useState<boolean>(true);

  // Simulation Logs
  const [logs, setLogs] = useState<Array<{ id: number; text: string; type: 'info' | 'success' | 'warn' | 'error' }>>([
    { id: 1, text: "系统已就绪。当前营销活动处于 [已发布] 状态，券模板可正常领用。", type: 'success' }
  ]);

  const addLog = (text: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    setLogs(prev => [{ id: Date.now(), text, type }, ...prev.slice(0, 5)]);
  };

  // Timer simulation for user coupon expiration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (hasUserCoupon && userCouponState === 'UNUSED' && userCouponTimeLeft > 0) {
      interval = setInterval(() => {
        setUserCouponTimeLeft(prev => {
          if (prev <= 1) {
            setUserCouponState('EXPIRED');
            addLog("📢 【用户券表】触发通知：用户手里的券到点未核销，状态自动流转为 [已过期]！", 'warn');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [hasUserCoupon, userCouponState, userCouponTimeLeft]);

  // Reset visualizer
  const handleReset = () => {
    setCampaignState('PUBLISHED');
    setTemplateState('ACTIVE');
    setTemplateStock(5);
    setUserCouponState('UNUSED');
    setUserCouponTimeLeft(15);
    setHasUserCoupon(true);
    setLogs([
      { id: Date.now(), text: "状态机仿真重置。当前活动已重新发布，用户卡包里有1张有效券。", type: 'info' }
    ]);
  };

  // 1. Campaign actions
  const handleCampaignAction = (action: 'submit' | 'approve' | 'reject' | 'pause' | 'resume' | 'end') => {
    switch (action) {
      case 'submit':
        if (campaignState === 'DRAFT') {
          setCampaignState('PENDING_AUDIT');
          addLog("📥 活动提交审批：[草稿] ──提交审核──> [待审核]。表字段已上锁。", 'info');
        }
        break;
      case 'approve':
        if (campaignState === 'PENDING_AUDIT') {
          setCampaignState('PUBLISHED');
          setTemplateState('ACTIVE');
          addLog("✅ 审批通过：[待审核] ──审核通过──> [已发布]！开始向C端展示领券入口。", 'success');
        }
        break;
      case 'reject':
        if (campaignState === 'PENDING_AUDIT') {
          setCampaignState('DRAFT');
          addLog("❌ 审批驳回：[待审核] ──拒绝──> [草稿]。解锁编辑功能。", 'error');
        }
        break;
      case 'pause':
        if (campaignState === 'PUBLISHED') {
          setCampaignState('PAUSED');
          addLog("⏸️ 活动紧急暂停！[已发布] ──点击暂停──> [已暂停]。", 'warn');
          addLog("💡 关键原理：此时仅仅关闭了【活动表】的对外领券通道。已发出的卡券过期倒计时仍在独立计时！", 'success');
        }
        break;
      case 'resume':
        if (campaignState === 'PAUSED') {
          setCampaignState('PUBLISHED');
          addLog("▶️ 活动恢复上线！[已暂停] ──恢复活动──> [已发布]。", 'success');
        }
        break;
      case 'end':
        setCampaignState('ENDED');
        setTemplateState('DISABLED');
        addLog("🛑 活动生命周期结束！[已结束] 状态卡死。券模板已被强制停用。", 'error');
        break;
    }
  };

  // 2. Template actions
  const handleClaimCoupon = () => {
    if (campaignState !== 'PUBLISHED') {
      addLog(`❌ 领券失败：当前活动状态为 [${getCampaignLabel(campaignState)}]，仅在 [已发布] 时允许领券。`, 'error');
      return;
    }
    if (templateState !== 'ACTIVE') {
      addLog(`❌ 领券失败：券模板当前状态为 [${getTemplateLabel(templateState)}]！`, 'error');
      return;
    }
    if (templateStock <= 0) {
      addLog("❌ 领券失败：该优惠券模板库存已售罄！", 'warn');
      return;
    }

    setTemplateStock(prev => {
      const nextStock = prev - 1;
      if (nextStock === 0) {
        setTemplateState('SOLD_OUT');
        addLog("⚠️ 券模板库存扣减至 0：[生效中] ──被领完──> [已售罄]！", 'warn');
      }
      return nextStock;
    });

    // Create a new user coupon
    setHasUserCoupon(true);
    setUserCouponState('UNUSED');
    setUserCouponTimeLeft(15);
    addLog("🎟️ 领券成功！用户券表新增一条记录，状态为 [未使用]，倒计时 15秒。", 'success');
  };

  const handleRestock = () => {
    setTemplateStock(prev => {
      const nextStock = prev + 5;
      if (templateState === 'SOLD_OUT') {
        setTemplateState('ACTIVE');
        addLog("📦 补货成功！券模板状态由 [已售罄] ──补货──> [生效中]。", 'success');
      } else {
        addLog(`📦 补货成功！追加5张库存，当前总库存：${nextStock}张。`, 'info');
      }
      return nextStock;
    });
  };

  // 3. User coupon actions
  const handleRedeemCoupon = () => {
    if (!hasUserCoupon) {
      addLog("❌ 操作失败：用户手里没有券！请先点击“领取卡券”", 'error');
      return;
    }
    if (userCouponState === 'USED') {
      addLog("❌ 操作失败：这张券在【用户券表】中已核销使用，不可重复利用！", 'error');
      return;
    }
    if (userCouponState === 'EXPIRED') {
      addLog("❌ 操作失败：这张券在【用户券表】中已过期，无法在收银台结算！", 'error');
      return;
    }

    setUserCouponState('USED');
    addLog("💰 核销成功！[未使用] ──结算支付──> [已使用]。交易成功扣减实付金额。", 'success');
  };

  const handleFastForward = () => {
    if (!hasUserCoupon || userCouponState !== 'UNUSED') {
      addLog("ℹ️ 无需快进：当前没有未使用的卡券正在倒计时。", 'info');
      return;
    }
    setUserCouponTimeLeft(prev => {
      if (prev <= 10) {
        setUserCouponState('EXPIRED');
        addLog("⏰ 快进10秒：用户券到期时间截止，直接变更为 [已过期]！", 'warn');
        return 0;
      }
      addLog(`⏰ 快进10秒：卡券到期时间缩短，当前剩余时间: ${prev - 10}秒`, 'info');
      return prev - 10;
    });
  };

  const getCampaignLabel = (state: CampaignState) => {
    switch (state) {
      case 'DRAFT': return '草稿 (Draft)';
      case 'PENDING_AUDIT': return '待审核 (Pending Audit)';
      case 'PUBLISHED': return '已发布 (Published)';
      case 'PAUSED': return '已暂停 (Paused)';
      case 'ENDED': return '已结束 (Ended)';
    }
  };

  const getTemplateLabel = (state: CouponTemplateState) => {
    switch (state) {
      case 'ACTIVE': return '生效中 (Active)';
      case 'SOLD_OUT': return '已售罄 (Sold Out)';
      case 'DISABLED': return '已停用 (Disabled)';
    }
  };

  return (
    <div id="state-machine-sandbox" className="flex flex-col h-full bg-slate-900/95 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Simulation Header */}
      <div className="flex items-center justify-between bg-slate-950 p-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-teal-500 rounded-full animate-ping" />
          <h3 className="font-sans font-bold text-slate-100 text-base md:text-lg">优惠券系统·多实体联动仿真沙盒</h3>
        </div>
        <button
          id="btn-reset-simulator"
          onClick={handleReset}
          className="flex items-center gap-1 px-3 py-1.5 text-xs text-teal-400 hover:text-teal-300 bg-teal-950/40 hover:bg-teal-950/80 border border-teal-900/60 rounded-lg font-medium transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          重置沙盒
        </button>
      </div>

      {/* Primary Simulator Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-y-auto flex-1 min-h-[350px]">
        
        {/* Campaign Entity Block */}
        <div className="flex flex-col bg-slate-950/70 p-5 rounded-xl border border-slate-800/80 hover:border-slate-700/60 transition-all">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
            <Layers className="w-5 h-5 text-indigo-400" />
            <div>
              <h4 className="font-semibold text-slate-200 text-sm">实体 1：活动管理表</h4>
              <p className="text-[10px] text-slate-500 font-mono">tb_marketing_campaign</p>
            </div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-lg mb-4 border border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-slate-400">字段: campaign_status</span>
              <span className="text-[10px] font-mono text-slate-600 bg-slate-950 px-1.5 py-0.5 rounded">VARCHAR</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold">当前值:</span>
              <motion.span
                key={campaignState}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                  campaignState === 'PUBLISHED' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60' :
                  campaignState === 'PAUSED' ? 'bg-rose-950/80 text-rose-400 border border-rose-800/60' :
                  campaignState === 'PENDING_AUDIT' ? 'bg-amber-950/80 text-amber-400 border border-amber-800/60' :
                  campaignState === 'ENDED' ? 'bg-slate-800 text-slate-400' :
                  'bg-slate-900 text-slate-400 border border-slate-700'
                }`}
              >
                {getCampaignLabel(campaignState)}
              </motion.span>
            </div>
            <div className="mt-3 text-[11px] text-slate-400 leading-relaxed min-h-[32px]">
              {campaignState === 'DRAFT' && '✏️ 草稿期，只有研发和策划可见，不可在C端展示和核销。'}
              {campaignState === 'PENDING_AUDIT' && '⏳ 等待运营领导审核。不允许任何修改，保障状态锁死。'}
              {campaignState === 'PUBLISHED' && '🚀 活动已发布！此时C端领券入口完全开启，可以开始抢券。'}
              {campaignState === 'PAUSED' && '⏸️ 活动紧急暂停。关闭并屏蔽领券按钮，但已发放的券不收回！'}
              {campaignState === 'ENDED' && '🏁 活动已彻底结束，卡券领用入口永久关闭。'}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-2 mt-auto">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">触发数据库事件 (Event):</span>
            <div className="grid grid-cols-2 gap-2">
              {campaignState === 'DRAFT' && (
                <button
                  onClick={() => handleCampaignAction('submit')}
                  className="px-3 py-2 text-xs bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-800/60 rounded-lg text-center transition-all"
                >
                  提交审核
                </button>
              )}
              {campaignState === 'PENDING_AUDIT' && (
                <>
                  <button
                    onClick={() => handleCampaignAction('approve')}
                    className="px-3 py-2 text-xs bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60 rounded-lg text-center transition-all"
                  >
                    审核通过
                  </button>
                  <button
                    onClick={() => handleCampaignAction('reject')}
                    className="px-3 py-2 text-xs bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 rounded-lg text-center transition-all"
                  >
                    审核驳回
                  </button>
                </>
              )}
              {campaignState === 'PUBLISHED' && (
                <button
                  onClick={() => handleCampaignAction('pause')}
                  className="col-span-2 px-3 py-2.5 text-xs bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-800 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-rose-950/30"
                >
                  <Pause className="w-3.5 h-3.5 fill-rose-300" />
                  点击暂停活动
                </button>
              )}
              {campaignState === 'PAUSED' && (
                <>
                  <button
                    onClick={() => handleCampaignAction('resume')}
                    className="px-3 py-2 text-xs bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 rounded-lg flex items-center justify-center gap-1 font-bold transition-all"
                  >
                    <Play className="w-3 h-3 fill-emerald-300" />
                    恢复活动
                  </button>
                  <button
                    onClick={() => handleCampaignAction('end')}
                    className="px-3 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all"
                  >
                    结束活动
                  </button>
                </>
              )}
              {campaignState === 'PUBLISHED' && (
                <button
                  onClick={() => handleCampaignAction('end')}
                  className="col-span-2 px-3 py-1.5 text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-lg transition-all"
                >
                  结束活动
                </button>
              )}
              {campaignState === 'ENDED' && (
                <span className="col-span-2 text-center py-2 text-[11px] text-slate-600 bg-slate-950 rounded-lg">
                  活动已终结，数据归档
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Template Entity Block */}
        <div className="flex flex-col bg-slate-950/70 p-5 rounded-xl border border-slate-800/80 hover:border-slate-700/60 transition-all">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
            <Award className="w-5 h-5 text-teal-400" />
            <div>
              <h4 className="font-semibold text-slate-200 text-sm">实体 2：券模板表</h4>
              <p className="text-[10px] text-slate-500 font-mono">tb_coupon_template</p>
            </div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-lg mb-4 border border-slate-800">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-slate-400">字段: template_status</span>
              <span className="text-[10px] font-mono text-slate-600 bg-slate-950 px-1.5 py-0.5 rounded">VARCHAR</span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-slate-500 font-bold">状态:</span>
              <span className={`px-2 py-0.5 text-[11px] font-medium rounded-full ${
                templateState === 'ACTIVE' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40' :
                templateState === 'SOLD_OUT' ? 'bg-amber-950/40 text-amber-400 border border-amber-900/40' :
                'bg-slate-800 text-slate-400'
              }`}>
                {getTemplateLabel(templateState)}
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-800/80 pt-2.5">
              <span className="text-xs text-slate-400">字段: stock_limit (剩余库存)</span>
              <span className="text-sm font-bold font-mono text-teal-400">{templateStock} 张</span>
            </div>
          </div>

          {/* Action on this table */}
          <div className="flex flex-col gap-2 mt-auto">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">C端领用与预算操作:</span>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleClaimCoupon}
                disabled={campaignState !== 'PUBLISHED' || templateStock <= 0}
                className={`w-full py-2.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  campaignState === 'PUBLISHED' && templateStock > 0
                    ? 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/20 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/40'
                }`}
              >
                <ArrowRight className="w-3.5 h-3.5" />
                用户点击“领取卡券”
              </button>

              <button
                onClick={handleRestock}
                className="w-full py-1.5 px-3 text-xs bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 hover:border-slate-700 rounded-lg transition-all"
              >
                后台追加库存 +5
              </button>
            </div>
          </div>
        </div>

        {/* User Coupon Instance Block */}
        <div className="flex flex-col bg-slate-950/70 p-5 rounded-xl border border-slate-800/80 hover:border-slate-700/60 transition-all">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
            <User className="w-5 h-5 text-amber-400" />
            <div>
              <h4 className="font-semibold text-slate-200 text-sm">实体 3：用户卡券包</h4>
              <p className="text-[10px] text-slate-500 font-mono">tb_user_coupon</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!hasUserCoupon ? (
              <motion.div
                key="no-coupon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-slate-900/40 p-6 rounded-lg text-center border border-dashed border-slate-800 text-slate-500 text-xs my-auto"
              >
                用户卡包中目前没有任何卡券。
                <br />
                <span className="text-[10px] text-slate-600">点击中间的“领取卡券”可以发券！</span>
              </motion.div>
            ) : (
              <motion.div
                key="has-coupon"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className={`relative p-4 rounded-xl border overflow-hidden transition-all ${
                  userCouponState === 'UNUSED' ? 'bg-gradient-to-br from-amber-950/60 to-slate-900 border-amber-900/60 shadow-lg shadow-amber-950/20' :
                  userCouponState === 'USED' ? 'bg-indigo-950/30 to-slate-900 border-indigo-950 text-slate-400' :
                  'bg-slate-900/50 border-slate-800 text-slate-600'
                }`}
              >
                {/* Coupon Design Card */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="text-xs font-bold text-amber-400">满 100 减 20 优惠券</h5>
                    <p className="text-[9px] text-slate-500 font-mono">UID: 89012 | COUPON_ID: 711</p>
                  </div>
                  <span className={`px-2 py-0.5 text-[9px] font-semibold rounded-full ${
                    userCouponState === 'UNUSED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' :
                    userCouponState === 'USED' ? 'bg-indigo-950 text-indigo-400 border border-indigo-800/40' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {userCouponState === 'UNUSED' && '未使用 (Unused)'}
                    {userCouponState === 'USED' && '已使用 (Used)'}
                    {userCouponState === 'EXPIRED' && '已过期 (Expired)'}
                  </span>
                </div>

                <div className="border-t border-dashed border-slate-800 my-2 pt-2">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">有效期: 绝对时间倒计时</span>
                    {userCouponState === 'UNUSED' && userCouponTimeLeft > 0 ? (
                      <span className="text-rose-400 font-bold font-mono animate-pulse">
                        ⌛ {userCouponTimeLeft} 秒
                      </span>
                    ) : (
                      <span className="text-slate-500 font-mono">
                        {userCouponState === 'USED' ? '已核销完成' : '🕒 0 秒 (到期)'}
                      </span>
                    )}
                  </div>
                </div>

                {userCouponState === 'UNUSED' && campaignState === 'PAUSED' && (
                  <div className="mt-2 bg-rose-950/60 border border-rose-900 p-2 rounded text-[10px] text-rose-300 flex gap-1.5 items-start">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>活动虽然已暂停</strong>，但由于“活动管发、卡券管用”，你兜里的卡券资产倒计时<strong>不受任何影响</strong>，依然在走！
                    </span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* User controls */}
          <div className="flex flex-col gap-2 mt-auto">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">C端核销与时序异常模拟:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleRedeemCoupon}
                disabled={!hasUserCoupon || userCouponState !== 'UNUSED'}
                className={`py-2 px-3 text-xs font-semibold rounded-lg text-center transition-all ${
                  hasUserCoupon && userCouponState === 'UNUSED'
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                }`}
              >
                点我去支付核销
              </button>
              <button
                onClick={handleFastForward}
                disabled={!hasUserCoupon || userCouponState !== 'UNUSED'}
                className={`py-2 px-3 text-xs font-medium rounded-lg text-center border transition-all ${
                  hasUserCoupon && userCouponState === 'UNUSED'
                    ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                    : 'border-slate-800 text-slate-600 cursor-not-allowed'
                }`}
              >
                快进 10 秒 🕒
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Simulator System Real-time Logs */}
      <div className="bg-slate-950 p-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">数据库实时流转日志 (DML/SQL 触发):</span>
          <span className="text-[9px] font-mono text-slate-600">LIMIT 5 RECORDS</span>
        </div>
        <div className="font-mono text-[11px] space-y-1.5 h-[100px] overflow-y-auto bg-slate-900/60 p-2.5 rounded-lg border border-slate-900/90 text-slate-400">
          <AnimatePresence initial={false}>
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex gap-1.5 items-start ${
                  log.type === 'success' ? 'text-emerald-400' :
                  log.type === 'warn' ? 'text-amber-400' :
                  log.type === 'error' ? 'text-rose-400 font-semibold' :
                  'text-slate-300'
                }`}
              >
                <span className="text-[9px] text-slate-600 flex-shrink-0 mt-0.5">[{new Date(log.id).toLocaleTimeString()}]</span>
                <span>{log.text}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
