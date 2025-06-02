import { validateRequestQuery } from "@/common";
import {
  NotificationController,
  SendNotificationQueryParamsSchema,
} from "@/modules/notifications";
import { Router } from "express";

export const notificationRouter = Router();
const notificationController = new NotificationController();

notificationRouter.post(
  "/",
  validateRequestQuery(SendNotificationQueryParamsSchema),
  notificationController.createNotification
);
