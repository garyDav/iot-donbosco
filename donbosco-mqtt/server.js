'use strict'

const debug = require('debug')('platziverse:mqtt')
const redis = require('redis')
const chalk = require('chalk')

let aedes = require('aedes')
const mqemitter = require('mqemitter-redis')
const redisPersistence = require('aedes-persistence-redis')

function startAedes () {

  const port = 1883

  aedes = aedes({
    mq: mqemitter({
      port: 6379,
      host: 'localhost',
      family: 4
    }),
    persistence: redisPersistence({
     port: 6379,
      host: 'localhost',
      family: 4 // 4 (IPv4) or 6 (IPv6)
    })
  })

  const server = require('net').createServer(aedes.handle)

  server.listen(port, function () {
    console.log(`${chalk.green('[platziverse-mqtt]')} server is running`)
    aedes.mq.emit({
      topic: "aedes/hello",
      payload: "I'm broker " + aedes.id,
      qos: 0
    })
  })

  aedes.mq.on("aedes/hello", (d, cb) => {
    console.log(d)
    cb()
  })

  aedes.on("subscribe", function(subscriptions, client) {
    console.log(
      "MQTT client \x1b[32m" +
        (client ? client.id : client) +
        "\x1b[0m subscribed to topics: " +
        subscriptions.map(s => s.topic).join("\n"),
      "from broker",
      aedes.id
    )
  })

  aedes.on("unsubscribe", function(subscriptions, client) {
    console.log(
      "MQTT client \x1b[32m" +
        (client ? client.id : client) +
        "\x1b[0m unsubscribed to topics: " +
        subscriptions.join("\n"),
      "from broker",
      aedes.id
    )
  })

  // fired when a client connects
  aedes.on("client", function(client) {
    console.log(
      "Client Connected: \x1b[33m" + (client ? client.id : client) + "\x1b[0m",
      "to broker",
      aedes.id
    )
  })

  // fired when a client disconnects
  aedes.on("clientDisconnect", function(client) {
    console.log(
      "Client Disconnected: \x1b[31m" + (client ? client.id : client) + "\x1b[0m",
      "to broker",
      aedes.id
    )
  })

  // authentication
  aedes.authenticate = (client, username, password, callback) => {
    password = Buffer.from(password, 'base64').toString()
    if (username === 'xyz' && password === 'xyz123') {
      return callback(null, true)
    }
    const error = new Error('Authentication Failed!! Please enter valid credentials.')
    console.log('Authentication failed.')
    return callback(error, false)
  }
  // authorising client topic to publish a message
  aedes.authorizePublish = (client, packet, callback) => {
    if (packet.topic === 'abc') {
      return callback(new Error('wrong topic'))
    }
    if (packet.topic === 'charcha') {
      packet.payload = Buffer.from('overwrite packet payload')
    }
    callback(null)
  }

}
startAedes()
