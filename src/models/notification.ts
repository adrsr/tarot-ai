export type NotificationType = 'message' | 'info';

export type NotificationSourceType = 'user' | 'system' | 'room' | 'game';

export type Notification<SourceType extends NotificationSourceType = NotificationSourceType> = {
  type: NotificationType;
  sourceType: SourceType;
  userId: SourceType extends 'user' ? string : undefined;
  date: string;
  message: string;
};
