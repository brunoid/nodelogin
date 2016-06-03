var express = require('express');
var router = express.Router();
var pool = require('../dbconnect');
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();


router.get('/login', login);
router.post('/login', loginPostHandler);
router.get('/register', register);
router.post('/register', registerPostHandler);
router.get('/logout', logout);

function login(req, res){
	res.render('auth/login');
}
function loginPostHandler(req, res){
	var email = req.body.email;
	var password = req.body.password;

	pool.getConnection(function(err, conn){
		if(err) throw err;
		var sql = 'select * from users where email = "' + email +'";';
		conn.query(sql, function(err, rows, fields){
 			
 			if(rows[0].email === email){
 				hasher({password: password, salt: rows[0].salt},
 					function(err, pass, salt, hash){
 						if(hash == rows[0].password){
		 					req.session.nickname = rows[0].nickname;
		 					return req.session.save(function(){
		 						res.redirect('/welcome');
		 						conn.release();
		 					});
		 					
		 				} else {
		 					console.log('잘못된 비번');
		 					conn.release();
		 				}
 					});
 			} else {
 				console.log('잘못된 아이디와 비번입니다.');
 				conn.release();
 			}
		});
	});
}

function register(req,res){
	res.render('auth/register')
}
function registerPostHandler(req, res){
	hasher({password: req.body.password}, function(err, pass, salt, hash){
		pool.getConnection(function(err, conn){
			if(err) throw err;
			var sqlParams = {
				email: req.body.email,
				password: hash,
				nickname: req.body.nickname,
				salt: salt
			}
			var sql = 'insert into users SET ?'
			conn.query(sql, sqlParams,function(err, rows, fields){
				if(err) throw err;
				req.session.nickname = req.body.nickname;
				res.redirect('/welcome');
				conn.release();
			});
		});
	});
}

function logout(req, res){
	delete req.session.nickname;
	req.session.save(function(){
		res.redirect('/welcome');
	});
}

module.exports = router;