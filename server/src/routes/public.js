import { Router } from 'express';
import { getSite } from '../controllers/siteController.js';
import { listPosts, getPostBySlug } from '../controllers/postsController.js';
import { listResources, getResourceBySlug } from '../controllers/resourcesController.js';
import { listProducts, getProductBySlug } from '../controllers/productsController.js';
import { createConsultation } from '../controllers/messagesController.js';

const router = Router();

// Read-only endpoints used by every visitor (no login required)
router.get('/site', getSite);
router.get('/posts', listPosts);
router.get('/posts/:slug', getPostBySlug);
router.get('/resources', listResources);
router.get('/resources/:slug', getResourceBySlug);
router.get('/products', listProducts);
router.get('/products/:slug', getProductBySlug);
router.post('/consultations', createConsultation);

export default router;
