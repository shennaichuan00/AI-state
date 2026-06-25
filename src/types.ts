export interface Slide {
  id: number;
  title: string;
  subtitle: string;
  speech: string; // Douyin verbal script for this slide
  bullets?: string[];
  visualType: 'hook' | 'pain-point' | 'step-1' | 'step-2' | 'step-3' | 'answer' | 'edge-cases' | 'outro';
}

export type ThemeType = 'editorial-dark' | 'neon-slate' | 'minimal-light' | 'retro-terminal';

export type RatioType = '16:9' | '9:16' | 'fullscreen';

// State machine types for Campaign
export type CampaignState = 'DRAFT' | 'PENDING_AUDIT' | 'PUBLISHED' | 'PAUSED' | 'ENDED';
export interface CampaignStateDetail {
  state: CampaignState;
  label: string;
  color: string;
  desc: string;
}

// State machine types for Coupon Template
export type CouponTemplateState = 'ACTIVE' | 'SOLD_OUT' | 'DISABLED';
export interface CouponTemplateStateDetail {
  state: CouponTemplateState;
  label: string;
  color: string;
  desc: string;
}

// State machine types for User Coupon
export type UserCouponState = 'UNUSED' | 'USED' | 'EXPIRED';
export interface UserCouponStateDetail {
  state: UserCouponState;
  label: string;
  color: string;
  desc: string;
}

// State machine types for Audit Request
export type AuditState = 'PENDING' | 'APPROVED' | 'REJECTED';
export interface AuditStateDetail {
  state: AuditState;
  label: string;
  color: string;
  desc: string;
}

// State machine types for System Task
export type TaskState = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
export interface TaskStateDetail {
  state: TaskState;
  label: string;
  color: string;
  desc: string;
}

export interface TransitionRow {
  entity: 'Campaign' | 'CouponTemplate' | 'UserCoupon' | 'AuditRequest' | 'SystemTask';
  currentState: string;
  event: string;
  nextState: string;
  rule: string;
}
