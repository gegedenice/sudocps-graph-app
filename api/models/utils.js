'use strict';

var  flatten = function (arr) {
        return arr.reduce(function (flat, toFlatten) {
            return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
          }, []);
    } 
module.exports = flatten;
