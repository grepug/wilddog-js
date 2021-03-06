import { Wilddog, WilddogApi, Relation, Query } from './index'
import { getPath, makePath, toPathArr, warn } from './libs/util'
import wilddog = require('wilddog')
import _ = require('lodash')

declare const Promise: any

export interface ObjectOptions {
  path?: string[] | string,
  val?: any,
  ref?: wilddog.sync.Reference,
}

export class WdObject {

  public path: string[]
  public val: any
  private pathStr: string
  private ref: wilddog.sync.Reference
  private wd: WilddogApi

  constructor (
    options: ObjectOptions,
    wd: WilddogApi
  ) {
    this.wd = wd
    this.val = options.val
    this.path = options.ref ? getPath(options.ref.toString()) : toPathArr(options.path)
    this.ref = options.ref ? options.ref : this.wd.sync.ref(makePath(this.path))
  }

  async set (obj: Object): Promise<WdObject> {
    obj = this.setCreatedAndUpdated(obj)
    await this.ref.set(obj)
    return this
  }

  get (key: string): Promise<WdObject> {
    return this.wd.Query({ path: this.path }).get(key)
  }

  async push (obj: Object): Promise<WdObject> {
    obj = this.setCreatedAndUpdated(obj)
    let ref: wilddog.sync.Reference = await this.ref.push(obj)
    return this.wd.Object({ ref })
  }

  async save (obj: Object): Promise<WdObject> {
    if (this.path.length === 2) {
      _.extend(obj, {
        updatedAt: new Date().getTime()
      })
    }
    await this.ref.update(obj)
    return this
  }

  // remove (): Promise<any> {
  //   return this.ref.remove()
  // }

  async savePointer (targetClassName: string, pointerName: string, targetObj: WdObject | string): Promise<WdObject> {
    if (this.path.length !== 2) throw new Error('save pointer must have a 2 length path')
    let pointer = `_pointer_${targetClassName}_${pointerName}`
    let key: string = _.isString(targetObj) ? targetObj : targetObj.key()
    await this.ref.update({ [pointer]: key })
    return this
  }

  child (childPath: string[]): WdObject {
    let childPathStr: string = makePath(childPath)
    return this.wd.Object({ ref: this.ref.child(childPathStr) })
  }

  relation (relationClassName: string, relationName: string): Relation {
    return new Relation({
      path: this.path,
      relationName,
      relationClassName,
      object: this
    })
  }

  key (): string {
    return this.ref.key()
  }

  toJSON (): any | null {
    if (!this.val) {
      warn('has no val')
      return null
    }
    return _.map(this.val, (v, k) => _.extend(v, {_objectId_: k}))[0]
  }

  private setCreatedAndUpdated (obj: Object): Object {
    if (this.path.length === 1) {
      return _.extend(obj, {
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime()
      })
    }
    return obj
  }

}
