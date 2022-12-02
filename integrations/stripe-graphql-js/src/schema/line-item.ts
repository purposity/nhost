import { builder } from '../builder'

builder.objectType('StripeLineItem', {
  fields: (t) => ({
    id: t.exposeString('id', {
      description: `Unique identifier for the object.`
    }),
    object: t.exposeString('object', {
      description: `String representing the object's type. Objects of the same type share the same value.`
    }),
    amount_discount: t.exposeInt('amount_discount', {
      description: `Total discount amount applied. If no discounts were applied, defaults to 0.`
    }),
    amount_subtotal: t.exposeInt('amount_subtotal', {
      description: `Total before any discounts or taxes are applied.`
    }),
    amount_tax: t.exposeInt('amount_tax', {
      description: `Total tax amount applied. If no tax was applied, defaults to 0.`
    }),
    amount_total: t.exposeInt('amount_total', {
      description: `Total after discounts and taxes.`
    }),
    currency: t.exposeString('currency', {
      description: `Three-letter [ISO currency code](https://www.iso.org/iso-4217-currency-codes.html), in lowercase. Must be a [supported currency](https://stripe.com/docs/currencies).`
    }),
    description: t.exposeString('description', {
      description: `An arbitrary string attached to the object. Often useful for displaying to users.`,
      nullable: true
    }),
    // todo: discounts
    price: t.expose('price', {
      description: `The price of the line item.`,
      type: 'StripePrice',
      nullable: true
    }),
    quantity: t.exposeInt('quantity', {
      description: `The quantity of the subscription, if the line item is a subscription or a proration.`,
      nullable: true
    })
    // todo: taxes
  })
})
