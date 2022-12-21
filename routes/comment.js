const CommentRouter=require('express').Router();
const commentcontroller=require('../controllers/commentcontroller')
const middleware=require('../helpers/middleware');

CommentRouter.post('/comments/create',middleware.auth,commentcontroller.create)
CommentRouter.get('/comments',commentcontroller.list)
CommentRouter.post('/comments/update',middleware.auth,commentcontroller.update)
CommentRouter.post('/comments/delete',middleware.auth,commentcontroller.delete)

module.exports = CommentRouter;