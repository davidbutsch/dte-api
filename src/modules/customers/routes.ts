import { validateCognitoToken, validateRequestBody } from "@/common";
import {
  CustomerController,
  UpdateCustomerBodySchema,
} from "@/modules/customers";
import { Router } from "express";

export const customerRouter = Router();
const customerController = new CustomerController();

customerRouter.get("/me", validateCognitoToken, customerController.getCustomer);

customerRouter.post(
  "/me",
  validateCognitoToken,
  customerController.createCustomer
);

customerRouter.patch(
  "/me",
  validateCognitoToken,
  validateRequestBody(UpdateCustomerBodySchema),
  customerController.updateCustomer
);
