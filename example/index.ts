// import { WilddogApi } from '../dist/wilddog-api'

// const WilddogApi = require('../dist/index')

import { WilddogApi, WdObject } from '../src/index'
// import wilddog = require('wilddog')

let api = new WilddogApi({
  syncURL: 'https://aiyuke-t.wilddogio.com',
  authDomain: 'aiyuke-t.wilddogio.com/'
})

api.init()

let ref = api.wilddog.sync().ref('Subtournament')

let obj = new WdObject({ ref, wilddog: api.wilddog })
console.log(obj.path)

// .then(ret => console.log(ret))

// api.Query(['User'])
// .equalTo('displayName', 'GrePuG')
// .then(ret => {
//   console.log(ret)
// })

// api.Object(['User', 'b7970208d93a661a0a53893ca811'])
// .save({ test: 123 })
// .then(ret => {
//   console.log(ret)
// })


// api.Object(['User', 'b7970208d93a661a0a53893ca811'])
// .relation('Subtournament', 'mySubtournament')
// // .add(api.Object(['Subtournament', '-Kgt6Jlth2Xev9D62vzv']))
// // .then(ret => {
// //   console.log(ret)
// // })
//
// .query()
// .find()
// .then(ret => {
//   console.log(ret[0].val)
// })
// .equalTo
// .add(api.Object(['Subtournament', '-Kgt6Jlth2Xev9D62vzv']))
// .then(ret => {
//   console.log(ret)
// })
