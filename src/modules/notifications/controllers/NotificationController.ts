import {
  NotificationService,
  SendNotificationQueryParams,
} from "@/modules/notifications";
import { Request, Response } from "express";

export class NotificationController {
  private notificationService = new NotificationService();

  /**
   * Sends SMS notification to all registered customer phone numbers.
   *
   * @todo Implement recipient filter.
   *
   * Requires middleware(s):
   * - `validateRequestQuery(SendNotificationQueryParams)`
   */
  createNotification = async (request: Request, response: Response) => {
    const query = request.query as typeof request.query &
      SendNotificationQueryParams;

    const notificationsSent = await this.notificationService.sendNotifications(
      query.message
    );

    response.json(notificationsSent);
  };
}
