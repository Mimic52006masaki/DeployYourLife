export const PART_TIME_JOBS = [
  {
    id: 'convenience',
    name: 'コンビニ',
    income: 80000,
    actionModifier: 0,
    fatigue: 1,
    studyBonus: 1.1,
  },
  {
    id: 'warehouse',
    name: '軽作業',
    income: 120000,
    actionModifier: -1,
    fatigue: 2,
  },
  {
    id: 'fulltime',
    name: 'フルタイム飲食',
    income: 180000,
    actionModifier: -2,
    fatigue: 3,
    studyBonus: 0.8,
  },
];

export const PHASES = {
  student: {
    label: '学生',
    can: [
      'learn',
      'post',
      'rest',
      'develop',
      'deploy',
    ],
    cannot: [
      'job',
      'hire',
      'incorporate',
    ],
  },

  parttime: {
    label: 'バイト',
    can: [
      'learn',
      'post',
      'rest',
      'change_parttime',
      'job',
      'low_task',
      'develop',
      'deploy',
    ],
    cannot: [
      'hire',
      'incorporate',
    ],
  },

  employee: {
    label: '会社員',
    can: [
      'learn',
      'post',
      'rest',
      'job',
      'mid_task',
      'develop',
      'deploy',
    ],
    cannot: [
      'hire',
      'incorporate',
    ],
    actionPenalty: -1,
  },

  freelance: {
    label: 'フリーランス',
    can: [
      'learn',
      'post',
      'rest',
      'job',
      'high_task',
      'hire',
      'assign_employee',
      'develop',
      'deploy',
      'payment',
      'fix_bug',
      'ui_improve',
      'marketing',
    ],
    cannot: [],
  },

  corporation: {
    label: '法人',
    can: [
      'hire',
      'assign_employee',
      'corp_task',
      'auto_income',
      'develop',
      'payment',
      'fix_bug',
      'ui_improve',
      'marketing',
    ],
    cannot: ['job'],
  },
};

export function canDo(action, state) {
  const phase = state.game.phase;
  return PHASES[phase]?.can.includes(action) ?? false;
}

export function getLockReason(action, state) {
  const phase = state.game.phase;
  if (PHASES[phase]?.can.includes(action)) return null;

  // ロック理由のマップ
  const lockReasons = {
    hire: 'フリーランス到達で解放',
    incorporate: '法人設立条件を満たすと解放',
    job: '学生フェーズでは制限',
  };
  return lockReasons[action] || 'このフェーズでは使用できません';
}