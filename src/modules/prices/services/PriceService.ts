import { InternalServerError, NotFoundError } from "@/common";
import { stripe } from "@/libs";
import { PriceDto } from "@/modules/prices";
import Stripe from "stripe";

export class PriceService {
  private stripePriceToDto = (price: Stripe.Price): PriceDto => {
    // Get product ID, handling both string and object formats
    const productId =
      typeof price.product === "string"
        ? price.product
        : price.product?.id || null;

    // Format recurring
    const recurring: PriceDto["recurring"] = price.recurring
      ? {
          interval: price.recurring.interval,
          intervalCount: price.recurring.interval_count,
          trialPeriodDays: price.recurring.trial_period_days,
        }
      : null;

    // Throw error if tiered price does not include `Price.tiers`
    if (!price.tiers && price.billing_scheme == "tiered")
      throw new Error("Tiered price must include tiers object.");

    // Format and map price tiers
    const tiers: PriceDto["tiers"] =
      price.tiers?.flatMap((tier) => {
        if (!tier.unit_amount) return []; // Omit tiers with no unit amount
        return {
          unitAmount: tier.unit_amount,
          upTo: tier.up_to,
        };
      }) || null;

    const priceDto: PriceDto = {
      id: price.id,
      productId,
      lookupKey: price.lookup_key,
      billingScheme: price.billing_scheme,
      currency: price.currency,
      recurring,
      tiers,
      unitAmount: price.unit_amount,
      metadata: price.metadata,
    };

    return priceDto;
  };

  /**
   * Gets price by id.
   *
   * @throws {NotFoundError} If price does not exist.
   * @returns {PriceDto} PriceDto
   */
  getPriceById = async (id: string): Promise<PriceDto> => {
    try {
      // Get price by id
      const price = await stripe.prices.retrieve(id, {
        expand: ["tiers"], // Tiers object required for PriceDto
      });

      // Return PriceDto
      const priceDto = this.stripePriceToDto(price);

      return priceDto;
    } catch (error) {
      // Handle stripe errors
      if (error instanceof Stripe.errors.StripeError)
        switch (error.statusCode) {
          case 404:
            throw new NotFoundError("Price not found.", { error });
        }

      // Otherwise throw InternalServerError and include unrecognized error
      throw new InternalServerError(`Error getting price by id.`, {
        error,
      });
    }
  };

  /**
   * Gets price by stripe filter.
   *
   * @returns {PriceDto[]} PriceDto[]
   */
  getPricesByFilter = async (
    filter: Stripe.PriceListParams
  ): Promise<PriceDto[]> => {
    const prices = await stripe.prices.list({
      ...filter,
      expand: ["data.tiers"],
    });

    // Return array of ProductDtos
    const priceDtos = prices.data.map((price) => this.stripePriceToDto(price));

    return priceDtos;
  };
}
