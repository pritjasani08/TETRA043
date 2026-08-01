export enum NotificationType {
  DETECTION = 'DETECTION',
  COMMUNITY = 'COMMUNITY',
  SYSTEM = 'SYSTEM',
  SECURITY = 'SECURITY',
  WARNING = 'WARNING',
  INFO = 'INFO'
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum NotificationStatus {
  UNREAD = 'UNREAD',
  READ = 'READ'
}

export enum NotificationDeliveryStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
  RETRYING = 'RETRYING'
}

export enum NotificationCategory {
  SYSTEM = 'SYSTEM',
  SECURITY = 'SECURITY',
  COMMUNITY = 'COMMUNITY',
  DETECTION = 'DETECTION',
  AI = 'AI'
}

export enum NotificationChannel {
  DATABASE = 'DATABASE',
  DASHBOARD = 'DASHBOARD',
  BROWSER = 'BROWSER',
  PUSH = 'PUSH',
  VOICE = 'VOICE'
}
