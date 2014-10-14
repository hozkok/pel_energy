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
        if (err) return res.send(err.message);
        if (!user) return res.send('user not found.');
        if (!user.isValidPassword(req.body.password)) 
            return res.send('wrong password!');

        // var price_data = {name: 'csv/price.csv'};
        // var demand_data = {name: 'csv/' + req.body.username + '.csv'};
        // data_handler.parallel_read([price_data, demand_data],
        //     function() {
        //         res.render('user_charts', {
        //             price: price_data.data,
        //             p_total: price_data.total,
        //             demand: demand_data.data,
        //             d_total: demand_data.total
        //         });
        //     }
        console.log('user data: ', user.data);
        var price_data = {name: 'csv/price.csv'};
        data_handler.parallel_read([price_data], function() {
            res.render('user_charts', {
                price: price_data.data,
                p_total: price_data.total,
                demand: user.data,
                d_total: user.data.reduce(
                    function(sum, num) {
                        return sum + num;
                    }
                )
            });
        });
    });

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
//    User.findOne({'username': 'qwe'}, function(err, user) {
//        console.log('trying to find user...');
//        if(err) console.log(err.message);
//        else {
//            if(user) console.log('user is found.');
//            console.log('user data: ', user.data);
//            user.data = [0.15, 0.09, 1.7, 3.0, 6, 4, 1.5, 0.37, 0.67, 0.27, 0.77, 0.67, 0.17, 1, 0.37, 0.77, 0.67, 0.47, 0.97, 0.87, 0.37, 0.97, 1, 1.2, 1.84, 3.79, 7, 5.34, 1.97, 1.77, 1.97, 0.37, 0.57, 0.27, 0.17, 0.67, 0.97, 0.77, 0.85, 0.65, 0.63, 0.53, 0.3, 0.2, 0.2, 0.6, 0.4, 0.3]
//            user.save(function(err) {
//                if(err) console.log(err.message);
//                console.log('array is successfuly saved into db.');
//            });
//        }
//    });
});
