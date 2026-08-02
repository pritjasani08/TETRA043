import { INotificationRepository } from './notification.repository';
import { 
  RawNotificationEntity, 
  RawDeviceTokenEntity, 
  CreateNotificationDto, 
  RegisterDeviceTokenDto 
} from './notification.types';
import { NotificationType } from '../../core/enums';
import { query } from '../../database';
import { ApiError } from '../../core/utils/ApiError';

export class SqlNotificationRepository implements INotificationRepository {
  async createNotification(data: CreateNotificationDto): Promise<RawNotificationEntity> {
    const text = `
      INSERT INTO notifications (user_id, category, type, title, message, priority, related_detection_id, metadata)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [
      data.userId,
      data.category,
      data.type,
      data.title,
      data.message,
      data.priority,
      data.relatedDetectionId || null,
      data.metadata ? JSON.stringify(data.metadata) : null
    ];
    
    const result = await query(text, values);
    return result.rows[0];
  }

  async getNotifications(
    userId: string, 
    limit: number, 
    offset: number, 
    isRead?: boolean, 
    type?: NotificationType
  ): Promise<{ data: RawNotificationEntity[], total: number }> {
    let whereClause = 'user_id = $1';
    const values: any[] = [userId];
    let idx = 2;

    if (isRead !== undefined) {
      whereClause += ` AND is_read = $${idx++}`;
      values.push(isRead);
    }

    if (type !== undefined) {
      whereClause += ` AND type = $${idx++}`;
      values.push(type);
    }

    const countText = `SELECT COUNT(*) FROM notifications WHERE ${whereClause}`;
    const countResult = await query(countText, values);
    const total = parseInt(countResult.rows[0].count, 10);

    const dataText = `
      SELECT * FROM notifications 
      WHERE ${whereClause} 
      ORDER BY created_at DESC 
      LIMIT $${idx++} OFFSET $${idx++}
    `;
    values.push(limit, offset);
    
    const dataResult = await query(dataText, values);

    return {
      data: dataResult.rows,
      total
    };
  }

  async getUnreadNotifications(userId: string): Promise<RawNotificationEntity[]> {
    const text = 'SELECT * FROM notifications WHERE user_id = $1 AND is_read = FALSE ORDER BY created_at DESC';
    const result = await query(text, [userId]);
    return result.rows;
  }

  async markAsRead(userId: string, notificationId: string): Promise<RawNotificationEntity | null> {
    const text = `
      UPDATE notifications 
      SET is_read = TRUE, read_at = CURRENT_TIMESTAMP 
      WHERE id = $1 AND user_id = $2 
      RETURNING *
    `;
    const result = await query(text, [notificationId, userId]);
    return result.rows[0] || null;
  }

  async markAllAsRead(userId: string): Promise<number> {
    const text = `
      UPDATE notifications 
      SET is_read = TRUE, read_at = CURRENT_TIMESTAMP 
      WHERE user_id = $1 AND is_read = FALSE
    `;
    const result = await query(text, [userId]);
    return result.rowCount || 0;
  }

  async deleteNotification(userId: string, notificationId: string): Promise<boolean> {
    const text = 'DELETE FROM notifications WHERE id = $1 AND user_id = $2';
    const result = await query(text, [notificationId, userId]);
    return (result.rowCount || 0) > 0;
  }

  async registerDeviceToken(userId: string, data: RegisterDeviceTokenDto): Promise<RawDeviceTokenEntity> {
    // Upsert token
    const text = `
      INSERT INTO device_tokens (user_id, device_token, platform, device_name, app_version, is_active, last_used_at)
      VALUES ($1, $2, $3, $4, $5, TRUE, CURRENT_TIMESTAMP)
      ON CONFLICT (device_token) 
      DO UPDATE SET 
        user_id = EXCLUDED.user_id,
        platform = EXCLUDED.platform,
        device_name = EXCLUDED.device_name,
        app_version = EXCLUDED.app_version,
        is_active = TRUE,
        last_used_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const values = [
      userId,
      data.deviceToken,
      data.platform || null,
      data.deviceName || null,
      data.appVersion || null
    ];

    const result = await query(text, values);
    return result.rows[0];
  }

  async removeDeviceToken(userId: string, tokenId: string): Promise<boolean> {
    const text = 'DELETE FROM device_tokens WHERE id = $1 AND user_id = $2';
    const result = await query(text, [tokenId, userId]);
    return (result.rowCount || 0) > 0;
  }

  async getDeviceTokens(userId: string): Promise<RawDeviceTokenEntity[]> {
    const text = 'SELECT * FROM device_tokens WHERE user_id = $1 ORDER BY last_used_at DESC';
    const result = await query(text, [userId]);
    return result.rows;
  }
}
