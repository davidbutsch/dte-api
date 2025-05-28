import { ForbiddenError, NotFoundError } from "@/common";
import { stripe } from "@/libs";
import { CouponDto, PromotionDto } from "@/modules/coupons";
import { CustomerService } from "@/modules/customers";
import Stripe from "stripe";

export class CouponService {
  private customerService = new CustomerService();

  stripeCouponToDto(coupon: Stripe.Coupon): CouponDto {
    const couponDto: CouponDto = {
      id: coupon.id,
      name: coupon.name,
      valid: coupon.valid,
      amountOff: coupon.amount_off,
      percentOff: coupon.percent_off,
      productIds: coupon.applies_to?.products || [],
      duration: coupon.duration,
      durationInMonths: coupon.duration_in_months,
      redeemBy: coupon.redeem_by,
      metadata: coupon.metadata,
    };

    return couponDto;
  }

  stripePromotionToDto(promotion: Stripe.PromotionCode): PromotionDto {
    // Get customer ID, handling both string and object formats
    const customerId =
      typeof promotion.customer == "string"
        ? promotion.customer
        : promotion.customer?.id || null;

    const promotionDto: PromotionDto = {
      id: promotion.id,
      active: promotion.active,
      code: promotion.code,
      coupon: this.stripeCouponToDto(promotion.coupon),
      customerId,
      expiresAt: promotion.expires_at,
      maxRedemptions: promotion.max_redemptions,
      restrictions: {
        firstTimeTransaction: promotion.restrictions.first_time_transaction,
        minimumAmount: promotion.restrictions.minimum_amount,
      },
      timesRedeemed: promotion.times_redeemed,
      metadata: promotion.metadata,
    };

    return promotionDto;
  }

  getPromotionByCode = async (
    email: string,
    code: string
  ): Promise<PromotionDto> => {
    // Get customer with email (throws not found)
    const customer = await this.customerService.getCustomerByEmail(email);

    // Get list of promotions with code
    const promotionsList = await stripe.promotionCodes.list({
      code,
    });

    // If list is empty throw not found error
    if (promotionsList.data.length == 0)
      throw new NotFoundError("Promotion not found.");

    const promotion = promotionsList.data[0];

    // Map to dto
    const promotionDto = this.stripePromotionToDto(promotion);

    // Verify that promotion is available to customer
    if (promotionDto.customerId && customer.id !== promotionDto.customerId)
      throw new ForbiddenError("Promotion not available for current customer.");

    return promotionDto;
  };
}
