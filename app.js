const express = require('express')
const { connectToDb, getDB} = require('./db')
const { ObjectId } = require('mongodb')

//init app and middleware
const app = express()
app.use(express.json())


//db Connection
let database

// app.listen(3000, () => {
//     console.log('App listening on the port 3000')
// })

connectToDb((err) => {
    if(!err){
        //listen to port number 3000
        app.listen(3000, () => {
            console.log('App listening on port 3000')
        })
        //FETCH, UPDATE DATA
        database = getDB()
    }
    else{
        console.log(err)
    }
})

// connectToDb();


// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', './client')
app.set(express.static('client'));

//routes
app.get('/cars', (req, res) => {
    const page = req.query.p || 0
    const carsPerPage = 7

    let cars = []

    database.collection('cars')
        .find() //RETURNS CURSOR toArray ForEach (RETURNS IN BATCHES)
        .sort({
            Model: 1
        })
        .skip(page * carsPerPage) //SKIP THE AMOUNT OF CARS TIMES THE PAGE
        .limit(carsPerPage) //LIMIT THE AMOUNT OF CARS DISPLAYED IN ONE PAGE EQUAL TO THE VALUE
        .forEach(car => cars.push(car))
        // .toArray()
        .then(() =>{
            res.status(200).json(cars)
        })
        .catch(() =>{
            res.status(200).json({
                error: 'Could Not Fetch Documents'
            })
        })
})



app.get('/cars/:id', (req, res) => {
    
    if (ObjectId.isValid(req.params.id)) {
        const objectId = new ObjectId(req.params.id); // Construct ObjectId instance with new keyword
    
        database.collection('cars')
            .findOne({ _id: objectId })
            .then(doc => {
                if (doc) {
                    res.status(200).json(doc);
                } else {
                    res.status(404).json({ error: 'Car not found' });
                }
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: 'Could not fetch document' });
            });
    } else {
        res.status(500).json({ error: 'Invalid Document ID' });
    }})
    
app.post('/cars', (req, res) => {
    const car = req.body
    
    database.collection('cars')
    .insertOne(car)
    .then(result => {
        res.status(201).json(result)
    })
    .catch(err => {
        res.status(500).json({
            err: 'Could not create a new document'
        })
    })

})

app.delete('/cars/:id', (req, res) => {
    if (ObjectId.isValid(req.params.id)) {
        database.collection('cars')
            .deleteOne({ _id: new ObjectId(req.params.id)})
            .then(result => {
                if (result) {
                    res.status(200).json(result);
                } else {
                    res.status(404).json({ error: 'Document Cannot be Deleted' });
                }
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: 'Could not fetch document' });
            });
    } else {
        res.status(500).json({ error: 'Invalid Document ID' });
}})

app.patch('/cars/:id', (req, res) =>{
    const updates = req.body

    if (ObjectId.isValid(req.params.id)) {
        database.collection('cars')
            .updateOne({ _id: new ObjectId(req.params.id)}, {$set: updates})
            .then(result => {
                if (result) {
                    res.status(200).json(result);
                } else {
                    res.status(404).json({ error: 'Document Cannot be Deleted' });
                }
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: 'Could not update document' });
            });
    } else {
        res.status(500).json({ error: 'Invalid Document ID' });
}})


app.get('/', (req, res) => {
    res.render('index')
})

