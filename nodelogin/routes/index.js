var express = require('express');
var router = express.Router();

router.get('/', function(req,res){
	res.redirect('/welcome');
});

router.get('/welcome', function(req, res){
	if(req.session.nickname){
		var nickname = req.session.nickname;
		res.render('welcome', {msg: nickname + '님 환영합니다.', 
			logout: '로그아웃 하기'});
	} else {
		res.render('welcome', {msg: 'guest님 환영합니다.',
			login: '로그인 하러 가실까요?'});
	}
});
module.exports = router;