const express = require('express')
const redis = require('redis')
const mariadb = require('mariadb');
const pool = mariadb.createPool({
     host: 'mariadb-crm', 
     user:'ticketing', 
     password: 'ticketapp',
     database:'czcrm_generic',
     connectionLimit: 5
});

const app = express()
const client = redis.createClient({
    host: 'redis-crm',
    port: 6379
})

//Set initial visits
client.set('visits', 1);
client.set('users', 'shivam');
//defining the root endpoint
app.get('/', (req, res) => {
    
    client.get('visits', (err, visits) => {
        res.send(`${process.env.MESSAGE} Number of visits is: ${visits}`)
        const count = parseInt(visits) + 1;
        client.set('visits', count)
    })
})

app.get('/users', (req, res) => {
    client.get('users', (err, users) => {
        res.send('USERS : ' + users)
        client.set('users', 'Suzi')
    })
})

app.get('/users/:userName', (req, res) => {
      client.set('users', req.params.userName)
      res.send('USERS set in redis : ' + req.params.userName)
})

app.get('/test', (req, res) => {
    
  pool.getConnection()
    .then(conn => {    
          conn.query("CREATE TABLE IF NOT EXISTS test (id int, val varchar(255))");
          conn.query("SELECT * from test").then((data) => {
          console.log(data); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
          res.send(JSON.stringify(data))
          conn.end();
        })
        .catch(err => {
          //handle error
          console.log(err); 
          conn.end();
        })
        
    }).catch(err => {
      //not connected
    });
      

})

//specifying the listening port
app.listen(8080, ()=>{
    console.log('Listening on port 8080')
})