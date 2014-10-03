var fs = require('fs');


// process current csv files and save data in passed object
var process_file = function(file_info, callback) {
        var lines, curr, data_arr = [], total = 0;
        fs.readFile(file_info.name, 'utf-8', function(err, data) {
            if (err) return err.message;
            console.log('Reading file: ' + file_info.name);
            lines = data.split(/\r?\n/);
            for(var i = 0; i < 48; i++) {
                curr = parseFloat(lines[i].split(',')[1]);
                data_arr.push(curr);
                total += curr;
            }
            console.log('\tArray: ' + data_arr + '\n' + 
                '\tTotal: ' + total + '\n');
            file_info.data = data_arr;
            file_info.total = total;
            if(callback) callback();
        });
};


exports.parallel_read = function (fData, callback) {
    var proc_length = fData.length;
    var procCount = 0;
    fData.forEach(function(fileInfo) {
        process_file(fileInfo, function() {
            if(++procCount == fData.length)
                callback();
        });
    });
}
