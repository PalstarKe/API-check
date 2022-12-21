const SampleRouter = require('express').Router();
const SampleController = require('../controllers/samplecontroller');
const middleware = require('../helpers/middleware');

SampleRouter.get('/samples',SampleController.list);
//SampleRouter.get('/sample',SampleController.specificBlog);
SampleRouter.post('/create',middleware.auth,SampleController.create);
SampleRouter.post('/update',middleware.auth,SampleController.update);
SampleRouter.post('/delete',middleware.auth,SampleController.delete);

module.exports = SampleRouter;