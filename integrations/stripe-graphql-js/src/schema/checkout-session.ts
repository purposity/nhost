import Stripe from 'stripe'
import { builder } from '../builder'
import { StripePaymentIntent } from '../types'
import { stripe } from '../utils'

builder.objectType('StripeCheckoutSession', {
  description: 'Checkout sessions',
  fields: (t) => {
    return {
      /**
       * Unique identifier for the object. Used to pass to `redirectToCheckout`
       * in Stripe.js.
       */
      // id: string;
      id: t.exposeString('id'),

      /**
       * String representing the object's type. Objects of the same type share the same value.
       */
      // object: 'checkout.session';
      object: t.exposeString('object'),

      /**
       * When set, provides configuration for actions to take if this Checkout Session expires.
       */
      // after_expiration: Session.AfterExpiration | null;
      after_expiration: t.expose('after_expiration', {
        type: 'StripeCheckoutSessionAfterExpiration',
        nullable: true,
        description:
          'When set, provides configuration for actions to take if this Checkout Session expires.'
      }),

      /**
       * Enables user redeemable promotion codes.
       */
      // allow_promotion_codes: boolean | null;
      allow_promotion_codes: t.exposeBoolean('allow_promotion_codes', {
        nullable: true
      }),

      /**
       * Total of all items before discounts or taxes are applied.
       */
      // amount_subtotal: number | null;
      amount_subtotal: t.exposeInt('amount_subtotal', {
        nullable: true
      }),

      /**
       * Total of all items after discounts and taxes are applied.
       */
      // amount_total: number | null;
      amount_total: t.exposeInt('amount_total', {
        nullable: true
      }),

      // automatic_tax: Session.AutomaticTax;

      /**
       * Describes whether Checkout should collect the customer's billing address.
       */
      // billing_address_collection: Session.BillingAddressCollection | null;

      /**
       * The URL the customer will be directed to if they decide to cancel payment and return to your website.
       */
      // cancel_url: string;
      cancel_url: t.exposeString('cancel_url'),

      /**
       * A unique string to reference the Checkout Session. This can be a
       * customer ID, a cart ID, or similar, and can be used to reconcile the
       * Session with your internal systems.
       */
      // client_reference_id: string | null;
      client_reference_id: t.exposeString('client_reference_id', { nullable: true }),

      /**
       * Results of `consent_collection` for this session.
       */
      // consent: Session.Consent | null;

      /**
       * When set, provides configuration for the Checkout Session to gather active consent from customers.
       */
      // consent_collection: Session.ConsentCollection | null;

      /**
       * Three-letter [ISO currency code](https://www.iso.org/iso-4217-currency-codes.html), in lowercase. Must be a [supported currency](https://stripe.com/docs/currencies).
       */
      // currency: string | null;
      currency: t.exposeString('currency', { nullable: true }),

      /**
       * The ID of the customer for this Session.
       * For Checkout Sessions in `payment` or `subscription` mode, Checkout
       * will create a new customer object based on information provided
       * during the payment flow unless an existing customer was provided when
       * the Session was created.
       */
      // customer: string | Stripe.Customer | Stripe.DeletedCustomer | null;

      /**
       * Configure whether a Checkout Session creates a Customer when the Checkout Session completes.
       */
      // customer_creation: Session.CustomerCreation | null;

      /**
       * The customer details including the customer's tax exempt status and the customer's tax IDs. Only the customer's email is present on Sessions in `setup` mode.
       */
      // customer_details: Session.CustomerDetails | null;

      /**
       * If provided, this value will be used when the Customer object is created.
       * If not provided, customers will be asked to enter their email address.
       * Use this parameter to prefill customer data if you already have an email
       * on file. To access information about the customer once the payment flow is
       * complete, use the `customer` attribute.
       */
      // customer_email: string | null;
      customer_email: t.exposeString('customer_email', { nullable: true }),

      /**
       * The timestamp at which the Checkout Session will expire.
       */
      // expires_at: number;
      expires_at: t.exposeInt('expires_at', {
        nullable: true
      }),

      /**
       * The line items purchased by the customer.
       */
      // line_items?: ApiList<Stripe.LineItem>;
      line_items: t.field({
        type: 'StripeLineItems',
        nullable: true,
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
      // t.expose('line_items', {
      //   type: 'LineItems',
      //   nullable: true
      // }),

      /**
       * Has the value `true` if the object exists in live mode or the value `false` if the object exists in test mode.
       */
      // livemode: boolean;
      // livemode: t.e

      /**
       * The IETF language tag of the locale Checkout is displayed in. If blank or `auto`, the browser's locale is used.
       */
      // locale: Session.Locale | null;

      /**
       * Set of [key-value pairs](https://stripe.com/docs/api/metadata) that you can attach to an object. This can be useful for storing additional information about the object in a structured format.
       */
      // metadata: Stripe.Metadata | null;
      metadata: t.expose('metadata', {
        type: 'JSON',
        nullable: true
      }),

      /**
       * The mode of the Checkout Session.
       */
      // mode: Session.Mode;

      /**
       * The ID of the PaymentIntent for Checkout Sessions in `payment` mode.
       */
      // payment_intent: string | Stripe.PaymentIntent | null;
      payment_intent: t.field({
        type: 'StripePaymentIntent',
        nullable: true,
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
       * The ID of the Payment Link that created this Session.
       */
      // payment_link: string | Stripe.PaymentLink | null;

      /**
       * Configure whether a Checkout Session should collect a payment method.
       */
      // payment_method_collection: Session.PaymentMethodCollection | null;

      /**
       * Payment-method-specific configuration for the PaymentIntent or SetupIntent of this CheckoutSession.
       */
      // payment_method_options: Session.PaymentMethodOptions | null;

      /**
       * A list of the types of payment methods (e.g. card) this Checkout
       * Session is allowed to accept.
       */
      // payment_method_types: Array<string>;
      payment_method_types: t.exposeStringList('payment_method_types'),

      /**
       * The payment status of the Checkout Session, one of `paid`, `unpaid`, or `no_payment_required`.
       * You can use this value to decide when to fulfill your customer's order.
       */
      // payment_status: Session.PaymentStatus;

      // phone_number_collection?: Session.PhoneNumberCollection;

      /**
       * The ID of the original expired Checkout Session that triggered the recovery flow.
       */
      // recovered_from: string | null;
      recovered_from: t.exposeString('recovered_from', { nullable: true }),

      /**
       * The ID of the SetupIntent for Checkout Sessions in `setup` mode.
       */
      // setup_intent: string | Stripe.SetupIntent | null;

      /**
       * When set, provides configuration for Checkout to collect a shipping address from a customer.
       */
      // shipping_address_collection: Session.ShippingAddressCollection | null;

      /**
       * The details of the customer cost of shipping, including the customer chosen ShippingRate.
       */
      // shipping_cost: Session.ShippingCost | null;

      /**
       * Shipping information for this Checkout Session.
       */
      // shipping_details: Session.ShippingDetails | null;

      /**
       * The shipping rate options applied to this Session.
       */
      // shipping_options: Array<Session.ShippingOption>;

      /**
       * The status of the Checkout Session, one of `open`, `complete`, or `expired`.
       */
      // status: Session.Status | null;
      status: t.exposeString('status', { nullable: true }),

      /**
       * Describes the type of transaction being performed by Checkout in order to customize
       * relevant text on the page, such as the submit button. `submit_type` can only be
       * specified on Checkout Sessions in `payment` mode, but not Checkout Sessions
       * in `subscription` or `setup` mode.
       */
      // submit_type: Session.SubmitType | null;

      /**
       * The ID of the subscription for Checkout Sessions in `subscription` mode.
       */
      // subscription: string | Stripe.Subscription | null;

      /**
       * The URL the customer will be directed to after the payment or
       * subscription creation is successful.
       */
      // success_url: string;
      success_url: t.exposeString('success_url'),

      // tax_id_collection?: Session.TaxIdCollection;

      /**
       * Tax and discount details for the computed total amount.
       */
      // total_details: Session.TotalDetails | null;

      /**
       * The URL to the Checkout Session. Redirect customers to this URL to take them to Checkout. If you're using [Custom Domains](https://stripe.com/docs/payments/checkout/custom-domains), the URL will use your subdomain. Otherwise, it'll use `checkout.stripe.com.`
       * This value is only present when the session is active.
       */
      // url: string | null;
      url: t.exposeString('url', { nullable: true })
    }
  }
})
