import express = require('express')
import bodyparser = require('body-parser')  //ok??
import {Metric, MetricsHandler} from './metrics'
import {UserHandler, User} from './user'
//import morgan = require('morgan')
import path = require('path');


const app = express()

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))

app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');

// Initialize connection once
var db: any
var dbUser: any
var mongodb = require('mongodb') 
const MongoClient = mongodb.MongoClient // Create a new MongoClient

MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, (err: any, client: any) => {
  if(err) throw err
  db = client.db('mydb')
  dbUser = new UserHandler(db)

  // Start the application after the database connection is ready
  const port: string = process.env.PORT || '8115'
  app.listen(port, (err: Error) => {
    if (err) {
      throw err
    }
    console.log(`server is listening on port ${port}`)
  })
});

//Session
import session = require('express-session')
import ConnectMongo = require('connect-mongo')
const MongoStore = ConnectMongo(session)

app.use(session({
  secret: 'user session',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ url: 'mongodb://localhost/mydb' })
}))

/* //morgan
app.use((req: any, res: any, next: any) => {  
  next()
}) */

app.post('/metrics', (req: any, res: any) => {
  if(req.body){
    const metric = new Metric(new Date().getTime().toString(), parseInt(req.body.value));
    new MetricsHandler(db).save(metric, (err: any, result: any) => {
      if (err)
        return res.status(500).json({error: err, result: result});
      res.status(201).json({error: err, result: true})
    })
  }else{
    return res.status(400).json({error: 'Wrong request parameter',});
  }
})

app.get('/metrics', (req: any, res: any) => {
  new MetricsHandler(db).getDocs(req.session.user.username, (err: Error | null, result?: any) => {
    if (err)
      return res.status(500).json({error: err, result: result});
    res.status(201).json({error:err, result:result})
  })
})

/* app.get('/', (req: any, res: any) => {
  res.write('Hello world')
  res.end()
}) */

const authRouter = express.Router()

app.use(authRouter)

app.get('/index/:name', function (req: any, res: any) { return res.render('hello.ejs', { name: req.params.name }); });


//const dbUser = new UserHandler(db)

authRouter.get('/login', function (req: any, res: any) {
  res.render('login')
})

authRouter.post('/login', function (req: any, res: any, next: any) {
  dbUser.get(req.body.username, function (err: Error | null, result: User | null) {
    if (err) next(err)
    if (result === null || !result.validatePassword(req.body.password)) {
      console.log('login')
      res.redirect('/login')
    } else {
      console.log('login2')
      req.session.loggedIn = true
      req.session.user = result
      res.redirect('/')
    }
  })
})

authRouter.get('/signup', function (req: any, res: any) {
  res.render('signup')
})

authRouter.get('/logout', function (req: any, res: any) {
  if (req.session.loggedIn) {
    delete req.session.loggedIn
    delete req.session.user
  }
  res.redirect('/login')
})

app.use(authRouter)

const authCheck = function (req: any, res: any, next: any) {
  if (req.session.loggedIn) {
    next()
  } else res.redirect('/login')
}

app.get('/', authCheck, (req: any, res: any) => {
  res.render('index.ejs', {username: req.session.user.username})
})

const userRouter = express.Router()

userRouter.post('/', function (req: any, res: any, next: any) {
  dbUser.get(req.body.username, function (err: Error | null, result: User | null) {
    if (err) next(err)
    if (result) {
      res.status(409).send("user already exists")
    } else {
      dbUser.save(req.body, function (err: Error | null) {
        if (err) next(err)
        else res.status(201).send("user persisted")
      })
    }
  })
})

userRouter.get('/:username', (req: any, res: any, next: any) => {
  dbUser.get(req.params.username, function (err: Error | null, result: User | null) {
    if (err || result === undefined) {
      res.status(404).send("user not found")
    } else res.status(200).json(result)
  })
})


authRouter.post('/signup', function (req: any, res: any, next: any) {
  dbUser.get(req.body.username, function (err: Error | null, result: User | null){
    if (err) next(err)
    if (result)
    res.status(409).send("User taken")
    else{ 
      dbUser.save(req.body, function (err: Error | null){
        if (err) next(err)
      else res.status(201).send("User created")
      })
  }
  })
})  

app.use(authRouter)


///////
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
 

app.post('/delete', (req:any, res:any)=>{
  var username = req.session.user.username
  new MetricsHandler(db).deleteDocs(username, (err:any, result:any)=>{
    if (err)
      console.log("Error")
  })
  console.log(":)")
  new UserHandler(db).remove(username, (err:any, result:any)=>{
    if (err)
      return res.status(500).json({error:err, result:result});
    res.status(201).json({error:err, result:true})
  })
  if (req.session.loggedIn){
    delete req.session.loggedIn
    delete req.session.user
  }
  res.redirect('/login')
}) 

app.delete('delete-doc', (req:any, res:any)=>{
  var username = req.session.user.username
  new UserHandler(db).remove(username, (err:any, result:any)=> {
    if (err)
      console.log("hello")
  })
})













