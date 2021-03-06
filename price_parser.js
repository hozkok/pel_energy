var request = require('request');
var cheerio = require('cheerio');
var Price = require('./models/price');
var cronJob = require('cron').CronJob;

var link = 'http://semorep.sem-o.com/SEMOWebSite/Default.aspx?qpReportServer=http://websemoreport/ReportServer_GOTHAMCITY/&qpReportURL=/SEMO%20Market%20Dashboard%20Reports/SMP%20and%20Load%20Table&prm_GetRunType=EA&prm_GetCurrency=EUR&rpt_Export=1';

var daily_link = 'http://semorep.sem-o.com/SEMOWebSite/Default.aspx?qpReportServer=http://websemoreport/ReportServer_GOTHAMCITY/&qpReportURL=/SEMO%20Market%20Dashboard%20Reports/SMP%20and%20Load%20Table&prm_GetRunType=WD1&prm_GetCurrency=EUR&rpt_Export=1';

var c = function(htmlStr) {
    var $ = cheerio.load(htmlStr);
    tables = $('table');
    prices = [];
    for(var i = 2; i < 50; i++) {
        // console.log(tables[25].children[i].children[5].children[0].children[0].data);
        prices.push(tables[25].children[i].children[5].children[0].children[0].data);
    }
    return prices;
};


exports.getPriceData = function(callback) {
    request(link, function(err, res, html) {
        if(err) return console.log('error!!1');
        
        // return c(html);
        callback(c(html));
    });
};

var getDailyPrice = function(callback) {
    request(daily_link, function(err, res, html) {
        if(err) return console.log('daily price error!');
        if(callback) callback(c(html));
    });
};

exports.saveDaily = function() {
    var saver = function() {
        getDailyPrice(function(data) {
            var priceArr = data;
            var price = new Price();
            price.data = priceArr;
            price.date = new Date();
            price.save(function(err) { 
                if(err) console.log(err.message);
                else console.log(new Date(), 
                    ' - price is successfully saved into db.');
            });
        }); 
    };
    var priceSaver = new cronJob({
        cronTime: '00 00 08 * * *',
        onTick: saver,
        timeZone: 'GMT',
        start: true
    });
    // priceSaver.start();
};

// http = require('http');
// http.get('http://semorep.sem-o.com/SEMOWebSite/Default.aspx?qpReportServer=http://websemoreport/ReportServer_GOTHAMCITY/&qpReportURL=/SEMO%20Market%20Dashboard%20Reports/SMP%20and%20Load%20Table&prm_GetRunType=EA&prm_GetCurrency=EUR&rpt_Export=1', function(res) {
//     data = '';
//     res.on('data', function(d) {
//         data += d;
//         console.log(data);
//     });
// });

// var phantom = require('phantomjs');
// phantom.create(function(ph) {
//     ph.createPage(function(page) {
//         page.open('http://www.sem-o.com/Pages/MDB_SMP_EA_EUR.aspx', function(status) {
//             console.log('page opened: ', status);
//             console.log(page.content);
//         });
//     ph.exit();
//     });
// });


// xpath: //*[@id="P04f1d71324fb4891aad6498c9b6b10f4oReportCell"]/table/tbody/tr[2]/td/table/tbody/tr/td/table/tbody/tr[2]/td[1]/table/tbody/tr[3]/td[6]/div


// var http = require('http');
// var htmlparser = require('htmlparser2');
//
//
//
// http.get(link, function(res) {
//     var dataArr = [];
//     res.on('data', function(data) {
//         dataArr.push(data);
//     });
//     res.on('end', function() {
//         // console.log(dataArr.join(''));
//         c(dataArr.join(''));
//     });
// });
// var f = function(htmlData) {
//     var handler = new htmlparser.DomHandler(function(err, dom) {
//         if(err) return console.log('error: dom handler');
//         else {
//             // console.log(dom.getElementsByTagName('table'));
//             // console.log(dom[1].
//             //     children[3].
//             //     children[1].
//             //     children[11].
//             //     children[0].
//             //     children[10].
//             //     children[1].
//             //     children[0].
//             //     children[0].
//             //     children[0].
//             //     children[0]. //oReportCell div
//             //     children[0]. //table cellspacing 0
//             //     children[0]. //second <tr> of three
//             //     children[0]. //td transparent
//             //     children[0] //div bg transparent
//             //     );
//             // console.log(document.getElementById('rpvResult'));
//         }
//     });
//     var parser = new htmlparser.Parser(handler);
//     parser.write(htmlData);
//     parser.done();
//                                                  
// };
