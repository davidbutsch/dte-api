import { ConflictError, NotFoundError } from "@/common";
import { stripe } from "@/libs";
import { CustomerDto, UpdateCustomerBody } from "@/modules/customers";
import Stripe from "stripe";

export class CustomerService {
  /**
   * Maps a Stripe.Customer object to a CustomerDto for use in the service/controller layers.
   *
   * @param {Stripe.Customer} customer - Stripe.Customer
   * @returns {CustomerDto} CustomerDto
   */
  stripeCustomerToDto(customer: Stripe.Customer): CustomerDto {
    // Get default payment method ID, handling both string and object formats
    const defaultPaymentMethodId =
      typeof customer.invoice_settings.default_payment_method === "string"
        ? customer.invoice_settings.default_payment_method
        : customer.invoice_settings.default_payment_method?.id || null;

    const customerDto: CustomerDto = {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phoneNumber: customer.phone || null,
      defaultPaymentMethodId,
      metadata: customer.metadata,
    };

    return customerDto;
  }

  /**
   * Gets Stripe customer by email.
   *
   * @throws {NotFoundError} If customer does not exist.
   * @returns {CustomerDto} CustomerDto
   */
  getCustomerByEmail = async (email: string): Promise<CustomerDto> => {
    // Get Stripe customer by email
    const customers = await stripe.customers.list({
      email,
      limit: 1,
    });

    const customer = customers.data[0];

    if (!customer) throw new NotFoundError("Customer not found.");

    // Return CustomerDto
    const customerDto = this.stripeCustomerToDto(customer);

    return customerDto;
  };

  /**
   * Creates Stripe customer with details from Cognito token payload.
   *
   * @throws {ConflictError} If customer already exists.
   * @returns {CustomerDto} CustomerDto
   */
  async createCustomerByTokenPayload(tokenPayload: any): Promise<CustomerDto> {
    // Check if this customer already exists
    const customersWithEmail = await stripe.customers.list({
      email: tokenPayload.email,
    });

    if (customersWithEmail.data.length > 0)
      throw new ConflictError("Customer with this email already exists.");

    // Create stripe customer
    const customer = await stripe.customers.create({
      name: `${tokenPayload.given_name} ${tokenPayload.family_name}`,
      email: tokenPayload.email,
      phone: tokenPayload.phone_number,
    });

    // Return CustomerDto
    const customerDto = this.stripeCustomerToDto(customer);

    return customerDto;
  }

  /**
   * Updates Stripe customer by email and returns updated customer.
   *
   * @returns {CustomerDto} CustomerDto
   */
  async updateCustomerByEmail(
    email: string,
    update: UpdateCustomerBody
  ): Promise<CustomerDto> {
    // Get customer by email
    const customer = await this.getCustomerByEmail(email);

    // Update Stripe customer
    const updatedCustomer = await stripe.customers.update(customer.id, update);

    // Return CustomerDto
    const updatedCustomerDto = this.stripeCustomerToDto(updatedCustomer);

    return updatedCustomerDto;
  }
}
