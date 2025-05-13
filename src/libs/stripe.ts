import { env } from "@/common";
import Stripe from "stripe";

export const stripe = new Stripe(env.keys.STRIPE_SECRET_KEY);
