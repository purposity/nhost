import { builder } from '../builder'

builder.objectType('StripeCheckoutSessionAfterExpirationRecovery', {
  fields: (t) => ({
    allow_promotion_codes: t.expose('allow_promotion_codes', {
      type: 'Boolean'
    }),
    enabled: t.expose('enabled', {
      type: 'Boolean'
    }),
    expires_at: t.expose('expires_at', {
      type: 'Int',
      nullable: true
    }),
    url: t.expose('url', {
      type: 'String',
      nullable: true
    })
  })
})
