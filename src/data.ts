import { Slide, TransitionRow } from './types';

export const SLIDES_DATA: Slide[] = [
  {
    id: 1,
    title: "活动暂停了，用户手里的券，过期时间停不停？",
    subtitle: "当年我也答不上来。拿着一堆原型图去评审，开发指着“暂停”按钮问我，我卡壳了。",
    speech: "活动暂停了，用户手里的券，过期时间停不停？我当年也答不上来。拿着一堆原型图去评审，开发就指着一个“暂停”按钮问我这句。我卡壳了。不是他刁，是我自己递的刀——因为我PRD里只写了“点暂停按钮跳到哪个页面”，按钮按下去之后系统怎么变？一个字没写。",
    bullets: [
      "开发提问：点击暂停按钮，已发放的券过期倒计时是否暂停？",
      "产品卡壳：PRD中只写了“页面跳转”，系统状态流转完全缺失",
      "致命后果：开发只能凭空猜测，上线即成事故重灾区"
    ],
    visualType: "hook"
  },
  {
    id: 2,
    title: "页面是皮，状态是骨",
    subtitle: "没骨头的PRD，一捏就瘪。系统设计的核心不是画页面，而是定义状态。",
    speech: "这种PRD，开发拿到手只能自己猜。猜错了，线上事故你背锅。页面是皮，状态是骨。没骨头的PRD，一捏就瘪。我的AI工作流，画完页面，必须进下一关：状态机设计。什么叫状态机？就是回答刚才那个问题——“暂停之后，券到底怎么变”。",
    bullets: [
      "皮（页面）：UI组件、跳转逻辑、静态原型",
      "骨（状态）：系统状态、变更边界、数据一致性",
      "状态机：精确回答“什么事件触发什么状态，怎么影响关联表数据”"
    ],
    visualType: "pain-point"
  },
  {
    id: 3,
    title: "第一步：拆！建立实体边界",
    subtitle: "活动、券模板、用户券各建各的表。搅在一起，后面逻辑全是浆糊！",
    speech: "还是那个优惠券系统，三步让AI把这事儿干明白。很多人第三步容易踩坑——第一步，拆！活动、优惠券、订单，各建各的表。搅一起？后面逻辑全是浆糊。跑完这三步，AI给我吐出来——你猜它拆了几个对象？五个。活动表、券模板表、用户券表、审批单、系统任务，全有。",
    bullets: [
      "拆分核心实体：防止多对多关系混杂导致系统卡死",
      "【活动表】：管理营销活动生命周期",
      "【券模板表】：管理可发放的卡券库存与规格",
      "【用户券表】：管理每个用户领取后的卡券实例",
      "【审批单表】：管理活动发布的合规流转",
      "【系统任务】：管理定时过期、自动重试等后台进程"
    ],
    visualType: "step-1"
  },
  {
    id: 4,
    title: "第二步：锁！卡死状态词",
    subtitle: "状态3到8个，多了砍。“点击暂停”是动作，不是状态。“已暂停”才是。",
    speech: "第二步，锁！状态3到8个，多了砍。“点击暂停”是动作，不是状态。“已暂停”才是。AI最爱造词，必须卡死。限制AI胡乱编造无用中间状态，每个状态必须有明确的物理意义。",
    bullets: [
      "黄金法则：每个实体状态严格控制在 3 ~ 8 个",
      "区分【事件(Action)】与【状态(State)】：",
      "❌ 错误示范：“点击暂停”、“提交审核”、“用户核销” (这些是触发事件)",
      "✅ 正确示范：“已暂停”、“待审核”、“已使用” (这些才是状态实体)"
    ],
    visualType: "step-2"
  },
  {
    id: 5,
    title: "第三步：逼！别写段落，只要表",
    subtitle: "当前状态 → 触发事件 → 下一状态，一行一个。废话？不允许。",
    speech: "第三步，逼！别让AI写段落。只要表。当前状态、触发事件、下一状态，一行一个。废话？不允许。跑完这三步，AI会把最精准的二维状态流转矩阵吐给你，无歧义、无废话，开发照着写Enum就行！",
    bullets: [
      "拒绝段落废话：文字描述容易产生二义性",
      "标准三元组：当前状态 (Current) + 触发事件 (Event) = 下一状态 (Next)",
      "提供清晰的前置条件与后置规则，开发看了一秒懂，直接写数据库Enum"
    ],
    visualType: "step-3"
  },
  {
    id: 6,
    title: "高潮揭秘：超市关门了，货能收回吗？",
    subtitle: "活动管“发”不管“用”，暂停只关领取按钮，揣兜里的券该到期照样到期！",
    speech: "回到开头那个问题——“暂停了，过期时间停不停”？这就好比超市今天关门歇业，难道昨天买过东西的顾客，手里的货还得收回吗？活动管“发”不管“用”，暂停只是把领取按钮关了，用户兜里已经揣着的券，到点该过期过期，跟你停不停活动一点关系都没有。表里也是这么写的：活动“已发布”触发暂停变成“已暂停”，券模板不受影响。",
    bullets: [
      "物理常识：活动属于“发布侧”，卡券属于“消费侧”",
      "活动已暂停：仅关闭卡券的“展示与领取通道”（按钮变灰）",
      "用户手里的券：已经是用户的资产，其倒计时在【用户券表】独立运行，到期自动进入“已过期”状态"
    ],
    visualType: "answer"
  },
  {
    id: 7,
    title: "异常场景防身：评审最容易踩坑的深水区",
    subtitle: "网络断了？并发超卖？退款了券退不退？这不是Bug，是你的PRD没写清楚！",
    speech: "但正常流转搞定了就完了？评审最容易踩坑的是异常——“网络断了？”“并发超卖？”“退款了券退不退？”听着头大吧？我当年也头大。后来想通了——这些不是Bug，是你PRD没写清楚。评审会上这种问题，一张表挡回去！",
    bullets: [
      "【并发超卖】：采用数据库行级锁/Redis分布式锁，券模板“库存量”扣减需强校验",
      "【退款券退不退】：PRD需明确是“按比例退还”、“全额退回原有效期”还是“过期不退”",
      "【网络异常】：客户端做防重点击与幂等Token校验，防止用户多点多领"
    ],
    visualType: "edge-cases"
  },
  {
    id: 8,
    title: "用状态机武装PRD，告别背锅！",
    subtitle: "页面是皮，状态是骨。三步AI流，让你的评审无懈可击！",
    speech: "页面是皮，状态是骨。没有状态机的PRD，一捏就瘪。希望这套“拆、锁、逼”三步状态机设计工作流，能帮每一个产品人彻底告别开发卡壳，在评审会上一张表挡回所有拷问。赶紧点赞收藏，下期带你解锁更多产品实战干货！",
    bullets: [
      "💡 核心总结：写PRD前，先画状态机表格",
      "🔥 口诀：一拆实体表，二锁状态词，三逼矩阵图",
      "💪 博主加餐：点击右侧，一键复制本套“5大实体状态转移标准矩阵”"
    ],
    visualType: "outro"
  }
];

export const TRANSITION_MATRIX: TransitionRow[] = [
  // Campaign
  { entity: 'Campaign', currentState: '草稿 (Draft)', event: '提交审核 (Submit)', nextState: '待审核 (Pending Audit)', rule: '发起审批流，锁定不可修改' },
  { entity: 'Campaign', currentState: '待审核 (Pending Audit)', event: '审核通过 (Approve)', nextState: '已发布 (Published)', rule: '开启定时生效或立即生效任务' },
  { entity: 'Campaign', currentState: '待审核 (Pending Audit)', event: '审核驳回 (Reject)', nextState: '草稿 (Draft)', rule: '记录驳回原因，退回给创建人' },
  { entity: 'Campaign', currentState: '已发布 (Published)', event: '点击暂停 (Click Pause)', nextState: '已暂停 (Paused)', rule: '隐藏领券入口，已领取券不受任何影响' },
  { entity: 'Campaign', currentState: '已暂停 (Paused)', event: '恢复活动 (Resume)', nextState: '已发布 (Published)', rule: '重新展现领券按钮，继续消耗模板库存' },
  { entity: 'Campaign', currentState: '已发布 (Published)', event: '时间截止/手动结束', nextState: '已结束 (Ended)', rule: '下线活动，进入归档状态，不可再次开启' },
  { entity: 'Campaign', currentState: '已暂停 (Paused)', event: '手动结束 (Click End)', nextState: '已结束 (Ended)', rule: '下线活动，释放券模板的未领取额度' },

  // CouponTemplate
  { entity: 'CouponTemplate', currentState: '生效中 (Active)', event: '券被领完 (Out of Stock)', nextState: '已售罄 (Sold Out)', rule: '用户端领券按钮置灰，显示已抢光' },
  { entity: 'CouponTemplate', currentState: '已售罄 (Sold Out)', event: '增加库存 (Restock)', nextState: '生效中 (Active)', rule: '扣减商家总体预算，重新上架' },
  { entity: 'CouponTemplate', currentState: '生效中 (Active)', event: '暂停活动/人工停用', nextState: '已停用 (Disabled)', rule: '此模板对应的所有渠道均无法继续发放新券' },
  { entity: 'CouponTemplate', currentState: '已售罄 (Sold Out)', event: '活动结束/停用', nextState: '已停用 (Disabled)', rule: '模板封存，不允许追加任何预算或库存' },

  // UserCoupon
  { entity: 'UserCoupon', currentState: '未使用 (Unused)', event: '用户支付核销 (Redeem)', nextState: '已使用 (Used)', rule: '扣减实付金额，写入订单卡券关联表' },
  { entity: 'UserCoupon', currentState: '未使用 (Unused)', event: '到期时间截止 (Expired)', nextState: '已过期 (Expired)', rule: '系统定时器或用户主动查询时判定，置灰不可点' },
  { entity: 'UserCoupon', currentState: '已使用 (Used)', event: '订单退款[允许退券]', nextState: '未使用 (Unused)', rule: '若在券有效期内，退还至卡包并置为未使用，过期不退' },

  // AuditRequest
  { entity: 'AuditRequest', currentState: '待处理 (Pending)', event: '运营审核通过', nextState: '已通过 (Approved)', rule: '自动触发关联Campaign状态由 待审核 -> 已发布' },
  { entity: 'AuditRequest', currentState: '待处理 (Pending)', event: '运营审核拒绝', nextState: '已驳回 (Rejected)', rule: '触发关联Campaign状态由 待审核 -> 草稿，并附驳回意见' },

  // SystemTask
  { entity: 'SystemTask', currentState: '待执行 (Pending)', event: '时间到达/触发器触发', nextState: '执行中 (Running)', rule: '加分布式锁防止重复执行，开启多线程跑批' },
  { entity: 'SystemTask', currentState: '执行中 (Running)', event: '跑批成功 (Success)', nextState: '已完成 (Completed)', rule: '更新数据库并释放资源锁' },
  { entity: 'SystemTask', currentState: '执行中 (Running)', event: '跑批异常/超时', nextState: '已失败 (Failed)', rule: '触发警报，回滚数据库事务，写入重试对列' },
  { entity: 'SystemTask', currentState: '已失败 (Failed)', event: '自动重试/人工干预', nextState: '执行中 (Running)', rule: '限制最高重试3次，超次置为永久挂起' }
];

export const CAMPAIGN_STATES_DETAIL = [
  { state: 'DRAFT', label: '草稿 (Draft)', color: '#6B7280', desc: '活动策划中，可任意编辑内容与时间，不暴露给任何用户' },
  { state: 'PENDING_AUDIT', label: '待审核 (Pending Audit)', color: '#F59E0B', desc: '提请发布，活动字段锁定不可编辑，等待风控和运营审核' },
  { state: 'PUBLISHED', label: '已发布 (Published)', color: '#10B981', desc: '审核通过或到点生效。用户可正常查看，并按规则领取优惠券' },
  { state: 'PAUSED', label: '已暂停 (Paused)', color: '#EF4444', desc: '点击暂停或预算预警。立即关闭用户端领取，但已领取的不受影响' },
  { state: 'ENDED', label: '已结束 (Ended)', color: '#374151', desc: '时间截止或手动提前终止。活动生命周期终结，不可再次开启' }
];

export const COUPON_STATES_DETAIL = [
  { state: 'ACTIVE', label: '生效中 (Active)', color: '#10B981', desc: '模板库存充足，可被正常领用或按计划定时发券' },
  { state: 'SOLD_OUT', label: '已售罄 (Sold Out)', color: '#F59E0B', desc: '库存额度扣减到 0，领用动作不可再发生，可通过追加预算恢复' },
  { state: 'DISABLED', label: '已停用 (Disabled)', color: '#6B7280', desc: '活动已结束、暂停或人工强制下架，对应的卡券再也无法发放' }
];

export const USER_COUPON_STATES_DETAIL = [
  { state: 'UNUSED', label: '未使用 (Unused)', color: '#10B981', desc: '保存在用户卡包中。有独立的过期时间（如领取后x天到期，或绝对到期时间）' },
  { state: 'USED', label: '已使用 (Used)', color: '#3B82F6', desc: '用户已在订单支付中核销该券。在退款期内满足规则可触发退券' },
  { state: 'EXPIRED', label: '已过期 (Expired)', color: '#6B7280', desc: '超出设定的过期时间，卡券不可再在任何订单中勾选，成为死数据' }
];
