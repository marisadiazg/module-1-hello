import {expect} from 'chai'
import { Metric, MetricsHandler } from './metrics'
var mongodb = require('mongodb') 

const a: number = 0

var dbMet: MetricsHandler
var db: any
var clientDb: any

var mongoAsync = (callback: any) => {
  const MongoClient = mongodb.MongoClient // Create a new MongoClient
  MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, (err: any, client: any) => {
    if(err) throw err
    callback(client)
  });
}

describe('Metrics', function () {
  it('should save and get', function () {
    expect(a).to.equal(0)
  })
})

describe('Metrics', () => {
    before((done) =>  {
      mongoAsync((client: any) => {
        clientDb = client
        db = clientDb.db('mydb')
        dbMet = new MetricsHandler(db)
        done()
      })
    })
  
    after(() => {
      clientDb.close()
    })
  
    describe('/get', () =>  {
        it('should get empty array', function() {
          dbMet.getDocs({value: 0}, function(err: Error | null, result?: Metric[]) {
            expect(err).to.be.null
            expect(result).to.not.be.undefined
            expect(result).to.be.empty
          })
        })
      })

      describe('/save', () =>  {
        it('should save data', function() {
            const metric: Metric = {
                timestamp: new Date().getTime().toString(),
                 value: 10, user: "marisa"
               }
          dbMet.getDocs(metric, function(err: Error | null, result?: Metric[]) {
            expect(err).to.be.null
            expect(result).to.not.be.undefined
            expect(result).to.not.be.empty
          })
        })
      })


      describe('/delete', () =>  {
        it('should delete data and not fail if it doesnt exist', function() {
          dbMet.deleteDocs('10', function(err: Error | null, result?: Metric[]) {
            expect(err).to.be.null

          })
        })
      })
  })









  