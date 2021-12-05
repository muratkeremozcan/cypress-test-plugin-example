import { Factory } from 'fishery'
import { datatype, internet } from 'faker'
import { APIVersion } from '../api-version'
import type { User } from '../interfaces/user'

export class UserFactory extends Factory<User> {
  private readonly accessToken: string
  private readonly version: APIVersion

  constructor(accessToken: string, version: APIVersion = APIVersion.latest) {
    super(({ params }) => {
      const user = {
        email: `qa+${datatype.uuid()}@extend.com`,
        password: internet.password(8, false, undefined, '#1'),
        firstName: 'QA',
        lastName: 'Test User',
        role: 'user'
      }
      if (params.accountId !== undefined)
        Object.assign(user, { accountId: params.accountId })
      return user
    })
    this.accessToken = accessToken
    this.version = version
  }
}
