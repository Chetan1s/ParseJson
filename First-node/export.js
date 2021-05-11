// const http=require('http');


const express=require('express');

const bodyParser=require('body-parser');

const app = express();

const routeAdmin=require('./exprss/admin.js');
const routeShop=require('./exprss/shop.js');

app.use(bodyParser.urlencoded({extended: false}));

app.use(routeShop);
app.use(routeAdmin);


app.use((req,res,next)=>{
    res.status(404).send('<h1>page not found</h1>');
});
app.listen(3000);


// const routes=require('./routes');
// console.log(routes.somText);
// app.use('/add-product',(req,res,next)=>{
//     res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit"></button>')     
// });

// app.use('/product',(req,res,next)=>{
//     console.log(req.body);
//     res.redirect('/');
// });



// app.use('/',(req,res,next)=>{
//     res.send('<h1>Hello from express.js</h1>');
// })
// const server=http.createServer(app);

// server.listen(3000);

