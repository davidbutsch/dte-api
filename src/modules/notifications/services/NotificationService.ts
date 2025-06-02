import { InternalServerError } from "@/common";
import { snsClient, stripe } from "@/libs";
import { PublishCommand } from "@aws-sdk/client-sns";

export class NotificationService {
  /**
   * Sends SMS notification to all registered customer phone numbers.
   *
   * @todo Refactor and split into multiple reusable methods
   *
   * @param message - String message
   * @returns Number of notifications sent
   */
  sendNotifications = async (message: string): Promise<number> => {
    try {
      // Get all customer phone numbers
      const customersList = await stripe.customers.list();

      const phoneNumbers = customersList.data.map(
        (customer) => customer.phone || null
      );

      const validPhoneNumbers = phoneNumbers.filter((name) => name !== null);

      // Loop through phone numbers and send text messages

      const notificationSendPromises = validPhoneNumbers.map(
        async (phoneNumber) => {
          const command = new PublishCommand({
            Message: message,
            PhoneNumber: phoneNumber, // E.164 format: +1234567890
          });

          await snsClient.send(command);
        }
      );

      await Promise.all(notificationSendPromises);
      return validPhoneNumbers.length;
    } catch (error) {
      // Throw InternalServerError and include unrecognized error
      throw new InternalServerError(`Error sending all notifications.`, {
        error,
      });
    }
  };
}
