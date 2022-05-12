import faker from '@faker-js/faker'
import { rest } from 'msw'
import { NhostSession } from '../../../src/types'
import { BASE_URL } from '../config'
import fakeUser from '../__mocks__/user'

/**
 * Request handler for MSW to mock a network error when trying to sign in using the MFA TOTP sign in
 * method.
 */
export const mfaTotpNetworkErrorHandler = rest.post(`${BASE_URL}/signin/mfa/totp`, (_req, res) => {
  return res.networkError('Network error')
})

/**
 * Request handler for MSW to mock a successful sign in request when using the MFA TOTP sign in
 * method.
 */
export const correctMfaTotpHandler = rest.post(`${BASE_URL}/signin/mfa/totp`, (_req, res, ctx) => {
  return res(
    ctx.json<{ session: NhostSession }>({
      session: {
        user: fakeUser,
        accessTokenExpiresIn: 900,
        accessToken: faker.datatype.string(40),
        refreshToken: faker.datatype.uuid()
      }
    })
  )
})

/**
 * Request handler for MSW to mock an internal server error when trying to sign in using the MFA
 * TOTP sign in method.
 */
export const mfaTotpInternalErrorHandler = rest.post(
  `${BASE_URL}/signin/mfa/totp`,
  (_req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({ status: 500, error: 'internal-error', message: 'Internal error' })
    )
  }
)
