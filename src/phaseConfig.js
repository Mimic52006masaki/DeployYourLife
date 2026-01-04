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