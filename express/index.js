let http = require('http');
let url = require('url');

function createApplication() {
    let app = (req, res) => {
        //取出每一个layer
        //1.获取请求的方法
        let m = req.method.toLowerCase();
        let {
            pathname
        } = url.parse(req.url, true);

        //通过next方法进行迭代

        let index = 0;

        function next(err) {
            //如果数组全部迭代完成还没找到 说明路径不存在
            if (index === app.routes.length) {
                return res.end(`Cannot ${m} ${pathname}`)
            };
            //一开始取第一个use,每次调完就应该取下一个layer
            let {
                method,
                path,
                handler
            } = app.routes[index++];
            if (err) {
                console.log(2222222);

                //如果有错误 我们应该去找错误中间件,错误中间件有4个参数
                if (handler.length === 4) {
                    console.log(err, app.routes.length);

                    handler(err, req, res, next);
                } else {
                    next(err); //继续走下一个layer继续判断
                }
            } else {
                if (method === 'middle' && handler.length === 3) { //处理中间件
                    if (pathname === '/' || path === pathname || pathname.startsWith(path)) {
                        handler(req, res, next);
                    } else {
                        next(); //如果这个中间件没匹配到 name继续走下一个匹配
                    }
                } else { //处理路由
                    if ((method === m || method === 'all') && (path === pathname || path === '*')) {
                        handler(req, res);
                    } else {
                        next();
                    }
                }
            }
        }
        next();
    }
    app.routes = [];

    app.use = function (path, handler) {
        if (typeof handler !== 'function') {
            handler = path;
            path = '/'
        }
        let layer = {
            method: 'middle', //表示中间件
            path,
            handler
        }
        app.routes.push(layer);
    }

    app.use(function (req, res, next) { //express内置中间件
        let {
            pathname,
            query
        } = url.parse(req.url, true);
        let hostname = req.headers['host'].split(':')[0];

        Object.assign(req, {
            path:pathname,
            query,
            hostname
        })
        next();
    })

    app.all = function (path, handler) {
        let layer = {
            method: 'all',
            path,
            handler
        }
        app.routes.push(layer)
    }
    http.METHODS.forEach(method => {
        method = method.toLowerCase()
        app[method] = function (path, handler) {
            let layer = {
                method,
                path,
                handler
            }
            app.routes.push(layer)
        }
    })
    app.listen = function () {
        let server = http.createServer(app);
        server.listen(...arguments)
    }
    return app;
}
module.exports = createApplication