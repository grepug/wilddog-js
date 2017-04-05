import wilddog = require('wilddog')
import { Query } from './query'

declare const Promise

interface Config {
  syncURL: string,
  authDomain: string
}

export class WilddogApi {

  private config: Config
  public wilddog
  public sync

  constructor (
    config: Config,
  ) {
    this.config = config
  }

  public init (): WilddogApi {
    this.wilddog = wilddog.initializeApp(this.config)
    this.sync = this.wilddog.sync()
    return this
  }

  public query (className: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let path = className
      let ref = this.sync(path).once('value', ss => {
        let val = ss.val()
        let key = ss.key()
        resolve({ key, val })
      })
    })
  }

  public Query (path: string[]) {
    return new Query(this, path)
  }


}
