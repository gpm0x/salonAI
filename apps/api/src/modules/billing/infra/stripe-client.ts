import Stripe from "stripe"
import { env } from "@/config/env"
import { ServiceUnavailableError } from "@/shared/domain/errors"

const STRIPE_API_VERSION: Stripe.LatestApiVersion = "2024-06-20"

let cachedClient: Stripe | undefined

// Cliente Stripe unico, com apiVersion fixada (evita que a lib mude o
// shape das respostas (ex.: Invoice.subscription) sob nossos pes numa
// atualizacao do SDK). Reutilizado pelo webhook pra constructEvent tambem.
export function getStripeClient(): Stripe {
  if (!env.stripeSecretKey) {
    throw new ServiceUnavailableError("Stripe nao esta configurado neste ambiente")
  }
  if (!cachedClient) {
    cachedClient = new Stripe(env.stripeSecretKey, { apiVersion: STRIPE_API_VERSION })
  }
  return cachedClient
}
