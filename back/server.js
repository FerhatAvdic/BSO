var express    = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
const cors = require('cors');
const passport = require('passport');
const config = require('../back/config/database');

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


require('../back/config/passport')(passport);
require('../back/config/projectPassport')(passport);
require('../back/config/judgePassport')(passport);

const users = require('../back/routes/users');
app.use('/admin', users);

var projects     = require('../back/routes/projects');
app.use('/api', projects);
var competitions = require('../back/routes/competitions');
app.use('/api', competitions);
var categories = require('../back/routes/categories');
app.use('/api', categories);
var judges = require('../back/routes/judges');
app.use('/api', judges);
var criteria = require('../back/routes/criteria');
app.use('/api', criteria);
var grades = require('../back/routes/grades');
app.use('/api', grades);
// Define a prefix for all routes
// Can define something unique like MyRestAPI
// We'll just leave it so all routes are relative to '/'

/*var routes     = require('../back/routes/routes');
app.use('/api/', routes);*/

app.use('/', express.static("../front"));
app.use('/administrator/', express.static("../front"));



app.get('/',function(request,response){
       response.sendFile(path.resolve(__dirname + '/../front/client/index.html'));
});

app.get('/administrator/', function(req, res){
     res.sendFile(path.join(__dirname + '/../front/admin/admin.html'));
});

app.get('/administrator/dashboard', passport.authenticate('jwt', {session:false}),function(req, res){
     res.sendFile(path.join(__dirname + '/../front/admin/views/dashboard.html'));
});


// Start server listening on port 8080
app.listen(port);
console.log('RESTAPI listening on port: ' + port);
