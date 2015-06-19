var express = require('express');
var app = express();
app.use(express.static(__dirname + '/app'));
app.listen(process.env.PORT || 3000);

/**
 * Created by kelvinho on 19/6/15.
 */
