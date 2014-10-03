var express = require('express');
var bodyparser = require('body-parser');
var data_handler = require('./csv_handler');
var app = express();

// db connection and configurations
var db = require('./db/db');
var mongoose = require('mongoose');
var User = require('./models/user');
mongoose.connect(db.url);


app.use(bodyparser.json()); // to support url encoded bodies
app.use(bodyparser.urlencoded({extended: false})); // to support json encoded bodies
app.use('/', express.static(__dirname + '/static'));

// template settings
app.set('views', './views');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);


// login site
app.get('/login', function(req, res) {
    res.render('login');
    // if(!req.body) console.log('empty body!');
    // console.log(req.body);
    // var user = req.body.username;
    // var pass = req.body.password;
    // console.log('username: ' + user + ',' + 'password: ' + pass);
});


// handle login POST request
app.post('/login', function(req, res) {
    console.log(req.body);
    if(!req.body.username || !req.body.password) {
        res.redirect('/login');
        return;
    }
    // login...
    User.findOne({'username': req.body.username}, function(err, user) {
        if (err) res.send(err.message);
        if (!user) res.send('user not found.');
        if (!user.isValidPassword(req.body.password)) 
            res.send('wrong password!');

        var price_data = {name: 'csv/price.csv'};
        var demand_data = {name: 'csv/' + req.body.username + '.csv'};
        data_handler.parallel_read([price_data, demand_data],
            function() {
                res.render('user_charts', {
                    price: price_data.data,
                    p_total: price_data.total,
                    demand: demand_data.data,
                    d_total: demand_data.total
                });
            }
        );   
    });


    // signup...
    // User.findOne({'username': req.body.username}, function(err, user) {
    //     if(err) return err;
    //     if(user) {
    //         res.send('User already exists.');
    //     }
    //     else {
    //         user = new User();
    //         user.username = req.body.username;
    //         user.password = user.genHash(req.body.password);
    //         user.save(function(err) {
    //             if(err) console.log(err.message);
    //             res.send(user.username + ' is successfuly saved into db!');
    //         });
    //     }
    // });
});


app.get('/hello.txt', function(req, res){
    res.send('Hello World!');
});

app.get('/', function(req, res) {
    var price_data = {name: 'csv/price.csv'},
        demand_data = {name: 'csv/demand.csv'};
    data_handler.parallel_read([price_data, demand_data], 
        function() {
            res.render('user_charts', {
                price: price_data.data,
                p_total: price_data.total,
                demand: demand_data.data,
                d_total: demand_data.total
            });
        }
    );
    
    
});




var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
