import express from 'express';
import { db, connectToDB } from './db.js';

let articlesInfo = [{
    name: 'learn-react',
    upvotes: 0,
    comments: [],
}, {
    name: 'learn-node',
    upvotes: 0,
    comments: [],
},{
    name: 'learn-mongodb',
    upvotes: 0,
    comments: [],
}]

const app = express();
app.use(express.json());

app.get('/api/articles/:name', async (req, res) => {
    const { name } = req.params;
    
    const article = await db.collection('articles').findOne({ name });

    if(article) {
        res.json(article);
    } else {
        res.sendStatus(404).send('Article not found');
    }

});

app.put('/api/articles/:name/upvote', async (req, res) => {
    const { name } = req.params;
    
    await db.collection('articles').updateOne({ name }, {
        $inc: { upvotes: 1 },
    });
    const article = await db.collection('articles').findOne({ name });

    if(article) {
        res.send(`The ${name} article now has ${article.upvotes} upvotes!`);
    } else {
        res.send('That article donsn\'t exist');
    }
});


app.post('/api/articles/:name/comments', async (req, res) => {
    const { postedBy, text } = req.body;
    const { name } = req.params;

    await db.collection('articles').updateOne({ name }, {
        $push: { comments: { postedBy, text } },
    });
    const article = await db.collection('articles').findOne({ name });

    if(article) {
        article.comments.push({ postedBy, text });
        res.send(article.comments);
    } else {
        res.send('That article donsn\'t exist');
    }
    
});

connectToDB(() => {
    console.log("Connected to Mongo Database!");
    app.listen(8000, () => {
        console.log('Server is listening on port 8000');
    });
})



app.post('/hello', (req, res) => {
    res.send(`Hello ${req.body.name}!`);
});

app.get('/hello/:name', (req, res) => {
    const name = req.params.name;
    res.send(`Hello ${ name }!!`);
});