import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { getSite, updateSite } from '../controllers/siteController.js';
import {
  listAllPosts, createPost, updatePost, deletePost,
} from '../controllers/postsController.js';
import {
  listAllResources, createResource, updateResource, deleteResource,
} from '../controllers/resourcesController.js';
import {
  listAllProducts, createProduct, updateProduct, deleteProduct,
} from '../controllers/productsController.js';
import {
  listConsultations, updateConsultation, deleteConsultation, getStats,
} from '../controllers/messagesController.js';

const router = Router();

router.use(requireAdmin);

router.get('/stats', getStats);

router.get('/settings', getSite);
router.put('/settings', updateSite);

router.get('/posts', listAllPosts);
router.post('/posts', createPost);
router.put('/posts/:id', updatePost);
router.delete('/posts/:id', deletePost);

router.get('/resources', listAllResources);
router.post('/resources', createResource);
router.put('/resources/:id', updateResource);
router.delete('/resources/:id', deleteResource);

router.get('/products', listAllProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

router.get('/consultations', listConsultations);
router.patch('/consultations/:id', updateConsultation);
router.delete('/consultations/:id', deleteConsultation);

export default router;
