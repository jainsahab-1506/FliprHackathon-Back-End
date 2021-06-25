const bodyparser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
require('dotenv').config();

const app = express();

const login = require('./login');
const oauthloginroutes = require('./oauthlogin.js');
const register = require('./register');

const emailGroupRouter = require('./email-group/routes');

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(
	'mongodb+srv://admin-naman:' +
		process.env.CLUSTER_PASSWORD +
		'@cluster0.3djy5.mongodb.net/FliperDB?retryWrites=true&w=majority',
	{ useNewUrlParser: true },
	() => {
		console.log('Database connected.');
	}
);

app.use(
	session({
		secret: 'Our little secret.',
		resave: false,
		saveUninitialized: false,
	})
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));

app.get('/', function (req, res) {
	res.send('Hello');
});

app.post('/register', register);
app.post('/login', login);

app.use('/', oauthloginroutes);

app.get('/logout', function (req, res) {
	console.log('call');
	req.logout();
	res.redirect('/');
});

app.get(
	'/auth/google/secrets',
	passport.authenticate('google', {
		scope: ['profile', 'email'],
		failureRedirect: '/',
	}),
	function (req, res) {
		// Successful authentication, redirect to secrets.
		res.send('Login');
	}
);

// Handles all the routes related to email groups
app.use('/email-group', emailGroupRouter);

app.listen(process.env.PORT || 3000, function (req, res) {
	console.log('Running');
});
