import { builder } from '../builder'

builder.objectType('StripeCheckoutSessions', {
  fields: (t) => ({
    object: t.exposeString('object'),
    url: t.exposeString('url'),
    hasMore: t.exposeBoolean('has_more'),
    data: t.expose('data', {
      type: ['StripeCheckoutSession'],
      nullable: false
    })
  })
})
