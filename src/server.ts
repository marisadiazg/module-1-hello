import express = require('express')
import bodyparser = require('body-parser')  //ok??

const app = express()
import path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))

app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');

app.get('/', (req: any, res: any) => {
  res.write('Hello world')
  res.end()
})

app.get('/hello/:name', function (req: any, res: any) { return res.render('hello.ejs', { name: req.params.name }); });

import {Metric, MetricsHandler} from './metrics'

app.get('/metrics.json', (req: any, res: any) => {
  MetricsHandler.get((err: Error | null, result?: any) => {
    if (err) {
      throw err
    }
    res.json(result)
  })
})

app.get('/metrics/:number', (req: any, res: any) => {
   new MetricsHandler(db).getDocs(req.params.number, (err: any, result: any) => {
    if (err)
      return res.status(500).json({error: err, result: result});
    res.status(201).json({result: result})
   })
})

app.delete('/metrics/:number', (req: any, res: any) => {
    new MetricsHandler(db).deleteDocs(req.params.number, (err: any, result: any) => {
     if (err)
       return res.status(500).json({error: err, result: result});
     res.status(201).json({result: result})
    })
 })



// Initialize connection once
var db: any
var mongodb = require('mongodb') 
const MongoClient = mongodb.MongoClient // Create a new MongoClient
MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, (err: any, client: any) => {
  if(err) throw err
  db = client.db('mydb')

  // Start the application after the database connection is ready
  const port: string = process.env.PORT || '8115'
  app.listen(port, (err: Error) => {
    if (err) {
      throw err
    }
    console.log(`server is listening on port ${port}`)
  })
});

app.post('/metrics', (req: any, res: any) => {
  if(req.body){
    const metric = new Metric('1', parseInt(req.body.value));
    new MetricsHandler(db).save(metric, (err: any, result: any) => {
      if (err)
        return res.status(500).json({error: err, result: result});
      res.status(201).json({error: err, result: true})
    })
  }else{
    return res.status(400).json({error: 'Wrong request parameter',});
  }
})


