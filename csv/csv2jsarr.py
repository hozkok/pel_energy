import sys
import os
with open(sys.argv[1], 'r') as f:
    _str = '['
    for line in f:
        _str += line.split(',')[1][:-1] + ', '
    _str += ']'
    with open(sys.argv[1].split('.')[0] + '_arr.js', 'w') as wf:
        wf.write(_str);
