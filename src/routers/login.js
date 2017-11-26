'use strict'
/**
 * router
 */
import path from 'path';

module.exports = function (done) {

    $.router.get('/api/login_user', async function (req, res, next) {
        // res.apiSuccess({ user: req.session.user, token: req.session.logout_token });
        res.apiSuccess({ user: req.session.user, token: req.session.logout_token });
    });

    $.router.post('/api/login', async function (req, res, next) {

        if (!req.body.password) return next(new Error('missing password'));
        // 频率限制
        const key = `login:${req.body.name}:${$.utils.date('Ymd')}`;
        {
            const limit = 5;
            const ok = await $.limiter.incr(key, limit);
            if (!ok) throw new Error('out of limit');
        }

        const user = await $.method('user.get').call(req.body);
        if (!user) return next(new Error('user does not exists'));

        if (!$.utils.validatePassword(req.body.password, user.password)) {
            return next(new Error('incorrect password'));
        }

        req.session.user = user;
        req.session.logout_token = $.utils.randomString(20);

        // 重置登录次数
        await $.limiter.reset(key);
        res.apiSuccess({ token: req.session.logout_token });
    })

    $.router.post('/api/loginout', async function (req, res, next) {
        // if (req.session.logout_token && req.query.token !== req.session.logout_token) {
        //     return next(new Error('invalid token'));
        // }

        delete req.session.user;
        delete req.session.logout_token;

        res.apiSuccess({});
    });

    $.router.post('/api/siginup', async function (req, res, next) {
        // 频率限制
        {
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const key = `signup:${ip}:${$.utils.date('Ymd')}`;
            const limit = 2;
            const ok = await $.limiter.incr(key, limit);
            if (!ok) throw new Error('out of limit');
        }
        const user = await $.method('user.add').call(req.body);

        // $.method('mail.sendTemplate').call({
        //     to: user.email,
        //     subject: '欢迎',
        //     template: 'welcome',
        //     data: user,
        // }, err => {
        //     if (err) console.error(err);
        // });
        res.apiSuccess({ user: user });
    });

    // 必须done才会执行methods, 注意要理解一下中间件机制
    done();
}