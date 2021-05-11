const fs=require('fs');

 const requestHandler=(req,res)=>{
    const url=req.url;
    const method=req.method;
    if(url==='/'){
    res.write('<html>');
    res.write('<head><title>My first page</title></head>');
    res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Click</button></body></form>');
    res.write('</html>');
    return res.end();
    }
    if(url==='/message' && method==='POST'){
        const body=[];
        req.on('data',(chunk)=>{
            console.log(chunk);
            body.push(chunk);
        });
        req.on('end',()=>{
            const parsedBody=Buffer.concat(body).toString();
            // console.log(parsedBody);
            const msz=parsedBody.split('=')[1];
            fs.writeFile('test.txt',msz,err=>{
              console.log('wassup');  
            });
            res.statusCode=302;
        res.setHeader=('Location','/');
       return res.end();
         });
    }
    res.setHeader('Content-Type','text/html');
    res.write('<html>');
    res.write('<head><title>My first page</title></head>');
    res.write('<body><h1>Hello from Node.js</h1></body>');
    res.write('</html>');
    res.end();
};

module.exports= requestHandler;