var DynChart = {};
DynChart.demand = {prices: [], total: 0};
DynChart.price = {prices: [], total: 0};

DynChart.print_chart = function(demand_name) {
    var lines, price;
    var csv_file_handler = function(file, info, callback: function) {
        $.get(file, function(data) {
            console.log("Reading file: " + file);
            lines = data.split('\n');
            $.each(lines, function(i, line) {
                price = parseFloat(line.split(',')[1]);
                info.prices.push(price);
                info.total += price;
            });
            if (callback) callback();
        });
    };

    csv_file_handler(demand_name, DynChart.demand, function() {
        csv_file_handler('csv/price.csv', DynChart.price, function() {
            console.log('Demand arr: ' + DynChart.demand.prices);
            console.log('Price arr: ' + DynChart.price.prices);
            $('#drawgraphs').click(function() {
                console.log("Clicked on draw graphs button.");
                this.disabled = true;
                $('#demandinfobutton').removeAttr('style');
                $('#totaldemand').html('Original Electrical Energy Demand' +
                    ' for the Day = <b>' + DynChart.demand.total.toFixed(2) +
                    ' kwh </b>');
                // demandchart = new Highcharts.Chart(options);
            });
        });
    });
};
