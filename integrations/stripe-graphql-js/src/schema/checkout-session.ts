import Stripe from 'stripe'
import { builder } from '../builder'
import { StripePaymentIntent } from '../types'
import { stripe } from '../utils'

builder.objectType('StripeCheckoutSession', {
  description: 'Checkout sessions',
  fields: (t) => {
    return {
      id: t.exposeString('id', {
        description:
          'Unique identifier for the object. Used to pass to `redirectToCheckout` in Stripe.js.'
      }),

      object: t.exposeString('object', {
        description:
          "String representing the object's type. Objects of the same type share the same value."
      }),

      after_expiration: t.expose('after_expiration', {
        type: 'StripeCheckoutSessionAfterExpiration',
        nullable: true,
        description:
          'When set, provides configuration for actions to take if this Checkout Session expires.'
      }),

      allow_promotion_codes: t.exposeBoolean('allow_promotion_codes', {
        nullable: true,
        description: 'Enables user redeemable promotion codes.'
      }),

      amount_subtotal: t.exposeInt('amount_subtotal', {
        nullable: true,
        description: 'Total of all items before discounts or taxes are applied.'
      }),

      amount_total: t.exposeInt('amount_total', {
        nullable: true,
        description: 'Total of all items after discounts and taxes are applied.'
      }),

      /**
       // TODO
       * automatic_tax
       * @type {import('stripe').Stripe.Checkout.Session.AutomaticTax}
       */
      // t.expose({ type:'', description: ""})

      /**
       // TODO
       * billing_address_collection
       * @type {import('stripe').Stripe.Checkout.Session.BillingAddressCollection | null}
       */
      // t.expose({ type:'', description: "Describes whether Checkout should collect the customer's billing address."})

      cancel_url: t.exposeString('cancel_url', {
        description:
          'The URL the customer will be directed to if they decide to cancel payment and return to your website.'
      }),

      client_reference_id: t.exposeString('client_reference_id', {
        nullable: true,
        description:
          'A unique string to reference the Checkout Session. This can be a customer ID, a cart ID, or similar, and can be used to reconcile the Session with your internal systems.'
      }),

      /**
       // TODO
       * consent
       * @type {import('stripe').Stripe.Checkout.Session.Consent | null}
       */
      // t.expose({ type:'', description: "Results of `consent_collection` for this session."})

      /**
       // TODO
       * consent_collection
       * @type {import('stripe').Stripe.Checkout.Session.ConsentCollection | null}
       */
      // t.expose({ type:'', description: "When set, provides configuration for the Checkout Session to gather active consent from customers."})

      currency: t.exposeString('currency', {
        nullable: true,
        description:
          'Three-letter [ISO currency code](https://www.iso.org/iso-4217-currency-codes.html), in lowercase. Must be a [supported currency](https://stripe.com/docs/currencies).'
      }),

      /**
       // TODO
       * customer
       * @type {string | import('stripe').Stripe.Customer | import('stripe').Stripe.DeletedCustomer | null}
       */
      // t.expose({ type:'', description: "The ID of the customer for this Session. For Checkout Sessions in `payment` or `subscription` mode, Checkout will create a new customer object based on information provided during the payment flow unless an existing customer was provided when the Session was created."})

      /**
       // TODO
       * customer_creation
       * @type {import('stripe').Stripe.Checkout.Session.CustomerCreation | null}
       */
      // t.expose({ type:'', description: "Configure whether a Checkout Session creates a Customer when the Checkout Session completes."})

      /**
       // TODO
       * customer_details
       * @type {import('stripe').Stripe.Checkout.Session.CustomerDetails | null}
       */
      // t.expose({ type:'', description: "The customer details including the customer's tax exempt status and the customer's tax IDs. Only the customer's email is present on Sessions in `setup` mode."})

      customer_email: t.exposeString('customer_email', {
        nullable: true,
        description:
          'If provided, this value will be used when the Customer object is created. If not provided, customers will be asked to enter their email address. Use this parameter to prefill customer data if you already have an email on file. To access information about the customer once the payment flow is complete, use the `customer` attribute.'
      }),

      expires_at: t.exposeInt('expires_at', {
        nullable: true,
        description: 'The timestamp at which the Checkout Session will expire.'
      }),

      line_items: t.field({
        type: 'StripeLineItems',
        nullable: true,
        description: 'The line items purchased by the customer.',
        args: {
          limit: t.arg.int({
            description:
              'A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 10.',
            required: false,
            defaultValue: undefined
          }),
          startingAfter: t.arg.string({
            description:
              'A cursor for use in pagination. `starting_after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with `obj_foo`, your subsequent call can include `starting_after=obj_foo` in order to fetch the next page of the list.',
            required: false,
            defaultValue: undefined
          }),
          endingBefore: t.arg.string({
            description:
              'A cursor for use in pagination. `ending_before` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, starting with `obj_bar`, your subsequent call can include `ending_before=obj_bar` in order to fetch the previous page of the list.',
            required: false,
            defaultValue: undefined
          })
        },
        resolve: async (checkoutSession, { limit, startingAfter, endingBefore }) => {
          if (!checkoutSession.line_items) {
            const listLineItems = await stripe.checkout.sessions.listLineItems(checkoutSession.id, {
              expand: ['data.price.product'],
              limit: limit ?? undefined,
              starting_after: startingAfter ?? undefined,
              ending_before: endingBefore ?? undefined
            })
            return listLineItems
          }
          return checkoutSession.line_items as Stripe.ApiList<Stripe.LineItem>
        }
      }),

      /**
       // TODO
       * livemode
       * @type {boolean}
       */
      // t.expose({ type:'', description: "Has the value `true` if the object exists in live mode or the value `false` if the object exists in test mode."})

      /**
       // TODO
       * locale
       * @type {import('stripe').Stripe.Checkout.Session.Locale | null}
       */
      // t.expose({ type:'', description: "The IETF language tag of the locale Checkout is displayed in. If blank or `auto`, the browser's locale is used."})

      metadata: t.expose('metadata', {
        type: 'JSON',
        nullable: true,
        description:
          'Set of [key-value pairs](https://stripe.com/docs/api/metadata) that you can attach to an object. This can be useful for storing additional information about the object in a structured format.'
      }),

      /**
       // TODO
       * mode
       * @type {import('stripe').Stripe.Checkout.Session.Mode}
       */
      // t.expose({ type:'', description: "The mode of the Checkout Session."})

      payment_intent: t.field({
        type: 'StripePaymentIntent',
        nullable: true,
        description: 'The ID of the PaymentIntent for Checkout Sessions in `payment` mode.',
        resolve: async (checkoutSession) => {
          const { payment_intent } = checkoutSession

          if (!payment_intent) {
            return null
          }

          const paymentIntentData = await stripe.paymentIntents.retrieve(payment_intent as string)

          return paymentIntentData as Stripe.Response<StripePaymentIntent>
        }
      }),

      /**
       // TODO
       * payment_link
       * @type {string | import('stripe').Stripe.PaymentLink | null}
       */
      // t.expose({ type:'', description: "The ID of the Payment Link that created this Session."})

      /**
       // TODO
       * payment_method_collection
       * @type {import('stripe').Stripe.Checkout.Session.PaymentMethodCollection | null}
       */
      // t.expose({ type:'', description: "Configure whether a Checkout Session should collect a payment method."})

      /**
       // TODO
       * payment_method_options
       * @type {import('stripe').Stripe.Checkout.Session.PaymentMethodOptions | null}
       */
      // t.expose({ type:'', description: "Payment-method-specific configuration for the PaymentIntent or SetupIntent of this CheckoutSession."})

      payment_method_types: t.exposeStringList('payment_method_types', {
        description:
          'A list of the types of payment methods (e.g. card) this Checkout Session is allowed to accept.'
      }),

      /**
       // TODO
       * payment_status
       * @type {import('stripe').Stripe.Checkout.Session.PaymentStatus}
       */
      // t.expose({ type:'', description: "The payment status of the Checkout Session, one of `paid`, `unpaid`, or `no_payment_required`. You can use this value to decide when to fulfill your customer's order."})

      /**
       // TODO
       * phone_number_collection
       * @type {import('stripe').Stripe.Checkout.Session.PhoneNumberCollection}
       */
      // t.expose({ type:'', description: ""})

      recovered_from: t.exposeString('recovered_from', {
        nullable: true,
        description:
          'The ID of the original expired Checkout Session that triggered the recovery flow.'
      }),

      /**
       // TODO
       * setup_intent
       * @type {string | import('stripe').Stripe.SetupIntent | null}
       */
      // t.expose({ type:'', description: "The ID of the SetupIntent for Checkout Sessions in `setup` mode."})

      /**
       // TODO
       * shipping_address_collection
       * @type {import('stripe').Stripe.Checkout.Session.ShippingAddressCollection | null}
       */
      // t.expose({ type:'', description: "When set, provides configuration for Checkout to collect a shipping address from a customer."})

      /**
       // TODO
       * shipping_cost
       * @type {import('stripe').Stripe.Checkout.Session.ShippingCost | null}
       */
      // t.expose({ type:'', description: "The details of the customer cost of shipping, including the customer chosen ShippingRate."})

      /**
       // TODO
       * shipping_details
       * @type {import('stripe').Stripe.Checkout.Session.ShippingDetails | null}
       */
      // t.expose({ type:'', description: "Shipping information for this Checkout Session."})

      /**
       // TODO
       * shipping_options
       * @type {Array<import('stripe').Stripe.Checkout.Session.ShippingOption>}
       */
      // t.expose({ type:'', description: "The shipping rate options applied to this Session."})

      status: t.exposeString('status', {
        nullable: true,
        description: 'The status of the Checkout Session, one of `open`, `complete`, or `expired`.'
      }),

      /**
       // TODO
       * submit_type
       * @type {import('stripe').Stripe.Checkout.Session.SubmitType | null}
       */
      // t.expose({ type:'', description: "Describes the type of transaction being performed by Checkout in order to customize relevant text on the page, such as the submit button. `submit_type` can only be specified on Checkout Sessions in `payment` mode, but not Checkout Sessions in `subscription` or `setup` mode."})

      /**
       // TODO
       * subscription
       * @type {string | import('stripe').Stripe.Subscription | null}
       */
      // t.expose({ type:'', description: "The ID of the subscription for Checkout Sessions in `subscription` mode."})

      success_url: t.exposeString('success_url', {
        description:
          'The URL the customer will be directed to after the payment or subscription creation is successful.'
      }),

      /**
       // TODO
       * tax_id_collection
       * @type {import('stripe').Stripe.Checkout.Session.TaxIdCollection}
       */
      // t.expose({ type:'', description: ""})

      /**
       // TODO
       * total_details
       * @type {import('stripe').Stripe.Checkout.Session.TotalDetails | null}
       */
      // t.expose({ type:'', description: "Tax and discount details for the computed total amount."})

      url: t.exposeString('url', {
        nullable: true,
        description:
          "The URL to the Checkout Session. Redirect customers to this URL to take them to Checkout. If you're using [Custom Domains](https://stripe.com/docs/payments/checkout/custom-domains), the URL will use your subdomain. Otherwise, it'll use `checkout.stripe.com.` This value is only present when the session is active."
      })
    }
  }
})
