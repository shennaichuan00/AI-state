import React, { useState } from 'react';
import { TRANSITION_MATRIX } from '../data';
import { TransitionRow } from '../types';
import { Copy, Check, Table, Code, Database, Search } from 'lucide-react';

export default function StateTable() {
  const [activeEntity, setActiveEntity] = useState<string>('All');
  const [copied, setCopied] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const entities = [
    { id: 'All', label: '全部数据表' },
    { id: 'Campaign', label: '活动表 (Campaign)' },
    { id: 'CouponTemplate', label: '券模板表 (Template)' },
    { id: 'UserCoupon', label: '用户卡券包 (UserCoupon)' },
    { id: 'AuditRequest', label: '审批单表 (Audit)' },
    { id: 'SystemTask', label: '系统任务 (SysTask)' }
  ];

  const getEntityTableName = (entityName: string) => {
    switch (entityName) {
      case 'Campaign': return 'tb_marketing_campaign';
      case 'CouponTemplate': return 'tb_coupon_template';
      case 'UserCoupon': return 'tb_user_coupon';
      case 'AuditRequest': return 'tb_audit_request';
      case 'SystemTask': return 'tb_system_cron_task';
      default: return '';
    }
  };

  const filteredMatrix = TRANSITION_MATRIX.filter(row => {
    const matchesEntity = activeEntity === 'All' || row.entity === activeEntity;
    const matchesSearch = row.currentState.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          row.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          row.nextState.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          row.rule.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesEntity && matchesSearch;
  });

  // Generate markdown representation
  const handleCopyMarkdown = () => {
    let md = `| 实体/数据表 | 当前状态 (Current State) | 触发事件/动作 (Trigger Event) | 变更后状态 (Next State) | 系统处理规则 & 核心校验 (System Rules) |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- |\n`;
    
    const rowsToExport = activeEntity === 'All' ? TRANSITION_MATRIX : TRANSITION_MATRIX.filter(r => r.entity === activeEntity);
    
    rowsToExport.forEach(row => {
      const dbTable = getEntityTableName(row.entity);
      md += `| \`${dbTable}\` | ${row.currentState} | **${row.event}** | ${row.nextState} | ${row.rule} |\n`;
    });

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate TS enum code representation
  const handleCopyCode = () => {
    const code = `/**
 * @entity ${activeEntity !== 'All' ? getEntityTableName(activeEntity) : 'Coupon System Enums'}
 * Standard state machine enums designed by AI Workflow
 */

${activeEntity === 'All' || activeEntity === 'Campaign' ? `export enum CampaignStatus {
  DRAFT = "DRAFT",             // 草稿
  PENDING_AUDIT = "PENDING",   // 待审核
  PUBLISHED = "PUBLISHED",     // 已发布 (展示并可领取)
  PAUSED = "PAUSED",           // 已暂停 (不能领，已发可消)
  ENDED = "ENDED"              // 已结束
}` : ''}

${activeEntity === 'All' || activeEntity === 'CouponTemplate' ? `export enum CouponTemplateStatus {
  ACTIVE = "ACTIVE",           // 生效中
  SOLD_OUT = "SOLD_OUT",       // 已售罄 (库存为0)
  DISABLED = "DISABLED"         // 已停用
}` : ''}

${activeEntity === 'All' || activeEntity === 'UserCoupon' ? `export enum UserCouponStatus {
  UNUSED = "UNUSED",           // 未使用
  USED = "USED",               // 已使用
  EXPIRED = "EXPIRED"           // 已过期
}` : ''}
`;

    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="state-table-panel" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h3 className="font-sans font-bold text-slate-100 text-lg flex items-center gap-2">
            <Table className="w-5 h-5 text-teal-400" />
            规范设计：三步逼出“无歧义”二维矩阵
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            拒绝长篇大论的自然语言段落，一行一条规则，开发对照直接敲代码。
          </p>
        </div>
        
        {/* Quick export actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-950/80 border border-emerald-900/40 rounded-lg transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 animate-bounce" /> : <Copy className="w-3.5 h-3.5" />}
            复制 Markdown 矩阵
          </button>
          
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-950/40 hover:bg-indigo-950/80 border border-indigo-900/40 rounded-lg transition-all"
          >
            <Code className="w-3.5 h-3.5" />
            复制 TS Enum 代码
          </button>
        </div>
      </div>

      {/* Tabs and search bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex flex-wrap gap-1.5">
          {entities.map(ent => (
            <button
              key={ent.id}
              onClick={() => setActiveEntity(ent.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                activeEntity === ent.id
                  ? 'bg-teal-500 text-slate-950 shadow-md font-semibold'
                  : 'bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {ent.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜索状态、事件或核心规则..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-teal-500 placeholder:text-slate-600 w-full md:w-64"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-y-auto border border-slate-800/80 rounded-xl bg-slate-950/40 min-h-[300px]">
        <table className="w-full text-left border-collapse text-xs md:text-sm">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
              <th className="p-4 w-36">对应数据表</th>
              <th className="p-4 w-32">当前状态 (State)</th>
              <th className="p-4 w-40">触发事件 (Event)</th>
              <th className="p-4 w-32">下一状态 (Next)</th>
              <th className="p-4">核心系统处理逻辑与规则</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900 font-sans text-slate-300">
            {filteredMatrix.length > 0 ? (
              filteredMatrix.map((row, index) => (
                <tr key={index} className="hover:bg-slate-900/60 transition-all">
                  <td className="p-4 text-xs font-mono text-slate-500">
                    <span className="flex items-center gap-1">
                      <Database className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                      {getEntityTableName(row.entity)}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-amber-500/90">{row.currentState}</td>
                  <td className="p-4 text-teal-400 font-semibold">{row.event}</td>
                  <td className="p-4 font-semibold text-emerald-400">{row.nextState}</td>
                  <td className="p-4 text-xs text-slate-400 leading-relaxed font-sans">{row.rule}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-8 text-slate-500">
                  没有匹配的矩阵流转记录。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
