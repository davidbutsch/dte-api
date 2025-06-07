import { env, InternalServerError } from "@/common";
import { Logger, stripe } from "@/libs";
import Stripe from "stripe";

class StripeService {
  private events = new Set();

  /**
   * Use the ID of the object in data.object along with the event.type to identify duplicates.
   *
   * @link https://docs.stripe.com/webhooks#handle-duplicate-events
   */
  private isEventDuplicate = (event: Stripe.Event): boolean => {
    // Always check event ID first
    if (this.events.has(event.id)) return true;

    // Identify duplicates by a combo of type + object.id
    if ("id" in event.data.object) {
      const dedupKey = `${event.type}:${event.data.object.id}`;
      if (this.events.has(dedupKey)) return true;
    }

    return false;
  };

  /**
   * Adds event id and type + object id to events set.
   */
  private addEvent(event: Stripe.Event): void {
    // Add event id to set
    this.events.add(event.id);

    // Add dedup key to set
    if ("id" in event.data.object) {
      const dedupKey = `${event.type}:${event.data.object.id}`;
      this.events.add(dedupKey);
    }
  }

  private constructStripeEvent = (
    body: any,
    signature: string
  ): Stripe.Event => {
    try {
      const event = stripe.webhooks.constructEvent(
        body,
        signature,
        env.keys.STRIPE_ENDPOINT_SECRET
      );

      return event;
    } catch (error) {
      throw new InternalServerError(`Error constructing stripe event.`, {
        error,
      });
    }
  };

  handleStripeEvent = async (body: any, signature: string): Promise<void> => {
    const event = this.constructStripeEvent(body, signature);

    const isEventDuplicate = this.isEventDuplicate(event);

    if (isEventDuplicate) {
      Logger.warn(`Recieved duplicate event with id ${event.id}`);
      return;
    }

    Logger.info(`Recieved event ${event.type}:${event.id}`);

    switch (event.type) {
      case "setup_intent.succeeded":
        await this.handleSetupIntentSucceededEvent(event);
        break;
      case "customer.subscription.created":
        await this.handleCustomerSubscriptionCreatedEvent(event);
        break;
      case "customer.subscription.updated":
        await this.handleCustomerSubscriptionUpdatedEvent(event);
        break;
      case "customer.subscription.deleted":
        await this.handleCustomerSubscriptionDeletedEvent(event);
        break;
      // throw internal error if an event has no handler
      default:
        throw new InternalServerError(
          `Event of type: "${event.type}" has no handler.`
        );
    }

    // If processing finishes without errors, add event to events set
    this.addEvent(event);
  };

  /**
   * Handles "setup_intent.succeeded" event.
   *
   * Attaches payment method to customer and sets as default for invoice payments.
   */
  private handleSetupIntentSucceededEvent = async (
    event: Stripe.SetupIntentSucceededEvent
  ): Promise<void> => {
    const setupIntent = event.data.object;

    // Get customer ID, handling both string and object formats
    const customerId =
      typeof setupIntent.customer === "string"
        ? setupIntent.customer
        : setupIntent.customer?.id;

    if (!customerId)
      throw new Error("SetupIntentSucceededEvent must include customer id.");

    const paymentMethodId =
      typeof setupIntent.payment_method === "string"
        ? setupIntent.payment_method
        : setupIntent.payment_method?.id;

    if (!paymentMethodId)
      throw new Error(
        "SetupIntentSucceededEvent must include payment method id."
      );

    try {
      // Attach payment method to customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });

      // Set as default payment method for invoice payments
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      Logger.info(
        `Payment method ${paymentMethodId} attached to customer ${customerId}.`
      );
    } catch (error) {
      throw new InternalServerError(
        "Error handling SetupIntentSucceededEvent.",
        { error }
      );
    }
  };

  /**
   * Handles "customer.subscription.created" event.
   *
   * If subscription is active -> update customer metadata to include `subscribed: "yes"`
   * Otherwise -> update customer metadata to include `subscribed: "no"`
   */
  private handleCustomerSubscriptionCreatedEvent = async (
    event: Stripe.CustomerSubscriptionCreatedEvent
  ): Promise<void> => {
    const subscription = event.data.object;

    // Get customer ID, handling both string and object formats
    const customerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer?.id;

    await stripe.customers.update(customerId, {
      // Stripe does not replace all metadata properties when passing a single metadata property
      // Instead, it extends the current metadata object with this new property
      metadata: {
        subscribed: subscription.status == "active" ? "yes" : "no",
      },
    });

    Logger.info(`Subscription ${subscription.id} created for ${customerId}.`);
  };

  /**
   * Handles "customer.subscription.updated" event.
   *
   * If subscription is active -> update customer metadata to include `subscribed: "yes"`
   * Otherwise -> update customer metadata to include `subscribed: "no"`
   */
  private handleCustomerSubscriptionUpdatedEvent = async (
    event: Stripe.CustomerSubscriptionUpdatedEvent
  ): Promise<void> => {
    const subscription = event.data.object;

    // Get customer ID, handling both string and object formats
    const customerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer?.id;

    await stripe.customers.update(customerId, {
      // Stripe does not replace all metadata properties when passing a single metadata property
      // Instead, it extends the current metadata object with this new property
      metadata: {
        subscribed: subscription.status == "active" ? "yes" : "no",
      },
    });
  };

  /**
   * Handles "customer.subscription.deleted" event.
   *
   * Updates customer metadata to include `subscribed: "no"`
   */
  private handleCustomerSubscriptionDeletedEvent = async (
    event: Stripe.CustomerSubscriptionDeletedEvent
  ): Promise<void> => {
    const subscription = event.data.object;

    // Get customer ID, handling both string and object formats
    const customerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer?.id;

    await stripe.customers.update(customerId, {
      // Stripe does not replace all metadata properties when passing a single metadata property
      // Instead, it extends the current metadata object with this new property
      metadata: {
        subscribed: "no",
      },
    });
  };
}

// Create singleton to track Stripe webhook events
export const stripeService = new StripeService();
