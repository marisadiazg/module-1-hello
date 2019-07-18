export class Metric {
  public timestamp: string
  public value: number

  constructor(ts: string, v: number) {
    this.timestamp = ts
    this.value = v
  }
}


export class MetricsHandler {
  static get(callback: (error: Error | null, result?: Metric[]) => void) {
    const result = [
      new Metric('2013-11-04 14:00 UTC', 12),
      new Metric('2013-11-04 14:30 UTC', 15)
    ]
    callback(null, result)
  }

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
        callback(err, result)
    });
  }

  //GET DOCUMENTS
  public getDocs(params:any, callback: (err: Error | null, result?: any) => void){  
    //console.log(params)
    const collection = this.db.collection('documents');
    // Find some documents
    collection.find({'value': parseInt(params)}).toArray(function(err: any, docs: object) {
      if(err)
        throw err
      console.log("Found the following documents");
      callback(err, docs);
    });
  }

//DELETE DOCS
  public deleteDocs(params:any, callback: (err: Error | null, result?: any) => void) {
    const collection = this.db.collection('documents');
  // Find some documents
    collection.remove({'value': parseInt(params)}, function(err: any, docs: object) {
      if(err)
        throw err
      console.log("Documents");
      callback(err, docs);
    });
  } 

}



