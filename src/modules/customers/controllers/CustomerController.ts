import { CustomerService, UpdateCustomerBody } from "@/modules/customers";
import { Request, Response } from "express";

export class CustomerController {
  private customerService = new CustomerService();

  /**
   * Gets customer using token payload email.
   *
   * Requires middleware(s):
   * - `validateCognitoToken`
   */
  getCustomer = async (_request: Request, response: Response) => {
    const email = response.locals.tokenPayload?.email;
    if (!email) throw new Error("Missing token payload email.");

    const customer = await this.customerService.getCustomerByEmail(email);

    response.json(customer);
  };

  /**
   * Creates customer using token payload details.
   *
   * Requires middleware(s):
   * - `validateCognitoToken`
   */
  createCustomer = async (_request: Request, response: Response) => {
    const tokenPayload = response.locals.tokenPayload;
    if (!tokenPayload) throw new Error("Missing token payload.");

    const customer = await this.customerService.createCustomerByTokenPayload(
      tokenPayload
    );

    response.json(customer);
  };

  /**
   * Updates customer using token payload email and request body.
   *
   * Requires middleware(s):
   * - `validateCognitoToken`
   * - `validateRequestBody(UpdateCustomerBodySchema)`
   */
  updateCustomer = async (request: Request, response: Response) => {
    const email = response.locals.tokenPayload?.email;
    if (!email) throw new Error("Missing token payload email.");

    const body: UpdateCustomerBody = request.body;

    const updatedCustomer = await this.customerService.updateCustomerByEmail(
      email,
      body
    );

    response.json(updatedCustomer);
  };
}
