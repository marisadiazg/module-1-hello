export class Metric {
  public timestamp: string
  public value: number
  public user: string

  constructor(ts: string, v: number, u: string) {
    this.timestamp = ts
    this.value = v
    this.user = u
  }
}


export class MetricsHandler {
  private db: any

  constructor(db:any) { 
    this.db = db
  }

  public save(metric: Metric, callback: (err: Error | null, result?: any) => void) {
    const collection = this.db.collection('documents')
    // Insert some document
    collection.insertOne(
      metric,
      function(err: any, result: any) {
        if(err)

    return callback(err, result)
        console.log("Document inserted into the collection")
        console.log(err)
        console.log(result)
        callback(err, result)
    });
  }

  //GET DOCUMENTS
  public getDocs(params:any, callback: (err: Error | null, result?: any) => void){  
    console.log("User: " + params)
    const collection = this.db.collection('documents');
    var documents = []
    // Find some documents
    collection.find({'user': params}).toArray(function(err: any, docs: object) {
      if(err)
        throw err
      console.log("Found the following documents");
      console.log(docs)
      callback(err, docs);
    });
  }

//DELETE DOCS
  public deleteDocs(params:any, callback: (err: Error | null, result?: any) => void) {
    const collection = this.db.collection('documents');
  // Find some documents
    collection.remove({'user': params}, function(err: any, obj: any) {
      if(err)
        throw err
      console.log("Documents");
      callback(err);
    });
  } 

  public deleteOne(params:any, callback: (err: Error | null, result?: any) => void) {
    const collection = this.db.collection('documents');
    collection.deleteOne({'user': params}, function(err:any, obj: any) {
      if(err)
        throw err
      console.log("Found the following documents");
      callback(err)
    });
  }
}



