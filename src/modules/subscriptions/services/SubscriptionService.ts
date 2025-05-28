import { ForbiddenError, InternalServerError, NotFoundError } from "@/common";
import { stripe } from "@/libs";
import { CustomerService } from "@/modules/customers";
import {
  CreateSubscriptionBody,
  SubscriptionDto,
  UpdateSubscriptionBody,
} from "@/modules/subscriptions";
import Stripe from "stripe";

export class SubscriptionService {
  private customerService = new CustomerService();

  private stripeSubscriptionToDto = (
    subscription: Stripe.Subscription
  ): SubscriptionDto => {
    // Get customer ID, handling both string and object formats
    const customerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id;

    // Get latest invoice ID, handling both string and object formats
    const latestInvoiceId =
      typeof subscription.latest_invoice === "string"
        ? subscription.latest_invoice
        : subscription.latest_invoice?.id || null;

    // Format and map subscription items
    const items: SubscriptionDto["items"] = subscription.items.data.map(
      (item) => {
        // Get price's product ID, handling both string and object formats
        const productId =
          typeof item.price.product === "string"
            ? item.price.product
            : item.price.product.id;

        // Format recurring
        const recurring = item.price.recurring
          ? {
              interval: item.price.recurring.interval,
              intervalCount: item.price.recurring.interval_count,
              trialPeriodDays: item.price.recurring.trial_period_days,
            }
          : null;

        return {
          id: item.id,
          currentPeriodStart: item.current_period_start,
          currentPeriodEnd: item.current_period_end,
          quantity: item.quantity || null,
          subscriptionId: item.subscription,
          price: {
            id: item.price.id,
            productId,
            billingScheme: item.price.billing_scheme,
            currency: item.price.currency,
            recurring,
            unitAmount: item.price.unit_amount,
            metadata: item.price.metadata,
          },
          metadata: item.metadata,
        };
      }
    );

    const subscriptionDto: SubscriptionDto = {
      id: subscription.id,
      billingCycleAnchor: subscription.billing_cycle_anchor,
      cancelAt: subscription.cancel_at,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at,
      customerId,
      latestInvoiceId,
      status: subscription.status,
      items,
      metadata: subscription.metadata,
    };

    return subscriptionDto;
  };

  /**
   * Gets subscription by id.
   *
   * @throws {NotFoundError} If subscription does not exist.
   * @returns {SubscriptionDto} SubscriptionDto
   */
  getSubscriptionById = async (id: string): Promise<SubscriptionDto> => {
    try {
      // Get subscription by id
      const subscription = await stripe.subscriptions.retrieve(id);

      // Return SubscriptionDto
      const subscriptionDto = this.stripeSubscriptionToDto(subscription);

      return subscriptionDto;
    } catch (error) {
      // Handle stripe errors
      if (error instanceof Stripe.errors.StripeError)
        switch (error.statusCode) {
          case 404:
            throw new NotFoundError("Subscription not found.", { error });
        }

      // Otherwise throw InternalServerError and include unrecognized error
      throw new InternalServerError(`Error getting subscription by id.`, {
        error,
      });
    }
  };

  /**
   * Gets all Stripe subscriptions associated with customer email.
   *
   * @returns {SubscriptionDto[]} SubscriptionDto[]
   */
  getSubscriptionListByEmail = async (
    email: string
  ): Promise<SubscriptionDto[]> => {
    // Get Stripe customer by email (throws not found)
    const customer = await this.customerService.getCustomerByEmail(email);

    // Get all customer subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
    });

    // Return SubscriptionDto array
    // Return SubscriptionDto array
    const subscriptionDtos = subscriptions.data.map((subscription) =>
      this.stripeSubscriptionToDto(subscription)
    );

    return subscriptionDtos;
  };

  /**
   * Creates Stripe subscription associated with email.
   *
   * @returns {SubscriptionDto} SubscriptionDto
   */
  createSubscriptionByEmail = async (
    email: string,
    body: CreateSubscriptionBody
  ): Promise<SubscriptionDto> => {
    // Get customer from email (throws not found)
    const customer = await this.customerService.getCustomerByEmail(email);

    // Create stripe subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: body.items,
      metadata: body.metadata,
    });

    const newSubscriptionDto = this.stripeSubscriptionToDto(subscription);

    return newSubscriptionDto;
  };

  /**
   * Update Stripe subscription.
   *
   * @throws {ForbiddenError} If subscription is not associated with email.
   * @returns {SubscriptionDto} SubscriptionDto
   */
  updateSubscriptionById = async (
    email: string,
    subscriptionId: string,
    update: UpdateSubscriptionBody
  ): Promise<SubscriptionDto> => {
    // Get customer with email (throws not found)
    const customer = await this.customerService.getCustomerByEmail(email);

    // Get subscription with id (throws not found)
    const subscription = await this.getSubscriptionById(subscriptionId);

    // Verify subscription is associated with email
    if (customer.id !== subscription.customerId)
      throw new ForbiddenError(
        "Subscription cannot be updated by current customer."
      );

    // Update stripe subscription
    const updatedSubscription = await stripe.subscriptions.update(
      subscriptionId,
      update
    );

    // Return SubscriptionDto

    const subscriptionDto = this.stripeSubscriptionToDto(updatedSubscription);

    return subscriptionDto;
  };
}
