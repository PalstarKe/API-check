const BlogRouter = require('express').Router();
const blogController = require('../controllers/blogcontroller');
const middleware = require('../helpers/middleware');

BlogRouter.get('/blogs',blogController.list);
BlogRouter.get('/Blog',blogController.specificBlog);
BlogRouter.post('/create',middleware.auth,blogController.create);
BlogRouter.post('/update',middleware.auth,blogController.update);
BlogRouter.post('/delete',middleware.auth,blogController.delete);

module.exports = BlogRouter;