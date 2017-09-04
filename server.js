var express    = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
const cors = require('cors');
const passport = require('passport');
const config = require('./config/database');

mongoose.connect(config.database)
mongoose.connection.on('connected', () => {
  console.log('Connected to database '+config.database);
});
// On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error: '+ err);
});


const app = express();

// Set port
var port = process.env.PORT || 8080;        // set the port
// CORS Middleware
app.use(cors());
// Express app will use body-parser to get data from POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


require('./config/passport')(passport);
require('./config/projectPassport')(passport);
require('./config/judgePassport')(passport);

const users = require('./routes/users');
app.use('/admin', users);

var projects     = require('./routes/projects');
app.use('/api', projects);
var competitions = require('./routes/competitions');
app.use('/api', competitions);
var categories = require('./routes/categories');
app.use('/api', categories);
var judges = require('./routes/judges');
app.use('/api', judges);
var criteria = require('./routes/criteria');
app.use('/api', criteria);
var grades = require('./routes/grades');
app.use('/api', grades);
// Define a prefix for all routes
// Can define something unique like MyRestAPI
// We'll just leave it so all routes are relative to '/'

/*var routes     = require('../routes/routes');
app.use('/api/', routes);*/

app.use('/', express.static("./www"));
app.use('/administrator/', express.static("./www"));



app.get('/',function(request,response){
       response.sendFile(path.resolve(__dirname + '/./www/client/index.html'));
});

app.get('/administrator/', function(req, res){
     res.sendFile(path.join(__dirname + '/./www/admin/admin.html'));
});

app.get('/administrator/dashboard', passport.authenticate('jwt', {session:false}),function(req, res){
     res.sendFile(path.join(__dirname + '/./www/admin/views/dashboard.html'));
});


// Start server listening on port 8080
app.listen(port);
console.log('RESTAPI listening on port: ' + port);
