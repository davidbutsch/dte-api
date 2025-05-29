import { DeletePaymentMethodParams, PaymentService } from "@/modules/payments";
import { Request, Response } from "express";

export class PaymentController {
  private paymentService = new PaymentService();

  /**
   * Gets all payment methods associated with customer.
   *
   * Requires middleware(s):
   * - `validateCognitoToken`
   */
  getPaymentMethods = async (_request: Request, response: Response) => {
    const email = response.locals.tokenPayload?.email;
    if (!email) throw new Error("Missing token payload email.");

    const paymentMethods = await this.paymentService.getPaymentMethodsByEmail(
      email
    );

    response.json(paymentMethods);
  };

  /**
   * Creates stripe "setup intent" associated with customer.
   *
   * Requires middleware(s):
   * - `validateCognitoToken`
   */
  createSetupIntent = async (_request: Request, response: Response) => {
    const email = response.locals.tokenPayload?.email;
    if (!email) throw new Error("Missing token payload email.");

    const setupIntent = await this.paymentService.createSetupIntentByEmail(
      email
    );

    response.json(setupIntent);
  };

  /**
   * Creates stripe "setup intent" associated with customer.
   *
   * Requires middleware(s):
   * - `validateRequestParams(DeletePaymentMethodParamsSchema)`
   */
  deletePaymentMethod = async (request: Request, response: Response) => {
    const { paymentMethodId } = request.params as DeletePaymentMethodParams;

    const paymentMethod = await this.paymentService.deletePaymentMethodById(
      paymentMethodId
    );

    response.json(paymentMethod);
  };
}
