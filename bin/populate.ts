import { Metric, MetricsHandler } from '../src/metrics'
var metrics = [new Metric('M',11), new Metric('A',12), new Metric('R',13), new Metric('I',14)]

var mongodb = require('mongodb') 
const MongoClient = mongodb.MongoClient
MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, (err: any, client: any) => {
  if(err) throw err
  const db = client.db('mydb')
  metrics.map(metric => {
    new MetricsHandler(db).save(metric, (err: any, result: any) => {
      if (err) console.log(err)
    })
  })
  client.close()
});