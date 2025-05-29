import { InternalServerError, NotFoundError } from "@/common";
import { stripe } from "@/libs";
import { CustomerService } from "@/modules/customers";
import { PaymentMethodDto } from "@/modules/payments";
import { SetupIntentDto } from "@/modules/stripe";
import Stripe from "stripe";

export class PaymentService {
  private customerService = new CustomerService();

  /**
   * Transforms a Stripe.PaymentMethod object to a PaymentMethodDto for use in service/controller layers.
   *
   * @param {Stripe.PaymentMethod} paymentMethod - Stripe.PaymentMethod
   * @returns {PaymentMethodDto} PaymentMethodDto
   */
  private stripePaymentMethodToDto = (
    paymentMethod: Stripe.PaymentMethod
  ): PaymentMethodDto => {
    if (!paymentMethod.card)
      throw new Error(
        "Payment method must include card details. Alternate payment methods are not supported yet."
      );

    const paymentMethodDto: PaymentMethodDto = {
      id: paymentMethod.id,
      type: paymentMethod.type,
      billing: {
        postalCode: paymentMethod.billing_details.address?.postal_code || null,
        country: paymentMethod.billing_details.address?.country || null,
      },
      card: {
        checks: {
          addressLine: paymentMethod.card.checks?.address_line1_check || null,
          addressPostalCode:
            paymentMethod.card.checks?.address_postal_code_check || null,
          cvc: paymentMethod.card.checks?.cvc_check || null,
        },
        country: paymentMethod.card.country,
        brand: paymentMethod.card.display_brand || paymentMethod.card.brand,
        expires: `${paymentMethod.card.exp_month}/${paymentMethod.card.exp_year}`,
        funding: paymentMethod.card.funding,
        last4: paymentMethod.card.last4,
      },
    };

    return paymentMethodDto;
  };

  /**
   * Gets all Stripe payment methods associated with customer email.
   *
   * @returns {PaymentMethodDto[]} PaymentMethodDto[]
   */
  getPaymentMethodsByEmail = async (
    email: string
  ): Promise<PaymentMethodDto[]> => {
    // Get customer (throws not found)
    const customer = await this.customerService.getCustomerByEmail(email);

    // Get payment methods from stripe
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customer.id,
      type: "card",
    });

    // Return array of PaymentMethodDtos
    const paymentMethodDtos = paymentMethods.data.map((paymentMethod) =>
      this.stripePaymentMethodToDto(paymentMethod)
    );

    return paymentMethodDtos;
  };

  /**
   * Creates Stripe setup-intent associated with customer email.
   *
   * @returns {SetupIntentDto} SetupIntentDto
   */
  createSetupIntentByEmail = async (email: string): Promise<SetupIntentDto> => {
    // Get customer (throws not found)
    const customer = await this.customerService.getCustomerByEmail(email);

    const setupIntent = await stripe.setupIntents.create({
      payment_method_types: ["card"], // Only support card payment methods
      customer: customer.id,
    });

    const setupIntentDto: SetupIntentDto = {
      clientSecret: setupIntent.client_secret,
    };

    return setupIntentDto;
  };

  deletePaymentMethodById = async (
    paymentMethodId: string
  ): Promise<PaymentMethodDto> => {
    try {
      const paymentMethod = await stripe.paymentMethods.detach(paymentMethodId);

      const paymentMethodDto = this.stripePaymentMethodToDto(paymentMethod);

      return paymentMethodDto;
    } catch (error) {
      // Handle stripe errors
      if (error instanceof Stripe.errors.StripeError)
        switch (error.statusCode) {
          case 404:
            throw new NotFoundError("Payment method not found.");
        }

      // Otherwise throw InternalServerError and include unrecognized error
      throw new InternalServerError(`Error getting payment method by id.`, {
        error,
      });
    }
  };
}
