import { builder } from '../builder'

builder.objectType('StripeCheckoutSessionAfterExpiration', {
  fields: (t) => ({
    recovery: t.expose('recovery', {
      type: 'StripeCheckoutSessionAfterExpirationRecovery',
      nullable: true
    })
  })
})
