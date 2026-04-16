export const TimeCategory = {
  FELLOWSHIP: 'FELLOWSHIP',
  STUDY: 'STUDY',
  WORKOUT: 'WORKOUT'
} as const;

export type TimeCategory = (typeof TimeCategory)[keyof typeof TimeCategory];

export const TaskStatus = {
  TODO: 'TODO',
  DOING: 'DOING',
  DONE: 'DONE'
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export const BucketName = {
  UBER: 'UBER',
  EMERGENCY: 'EMERGENCY',
  TUITION: 'TUITION',
  GOAL: 'GOAL'
} as const;

export type BucketName = (typeof BucketName)[keyof typeof BucketName];
