import { Router } from 'express';

import { SpecialController } from '../controllers/special.controller';

const router: Router = Router();
const specialController = new SpecialController();

router.get('/', specialController.getAllSpecials.bind(specialController));
router.get('/active', specialController.getActiveSpecials.bind(specialController));
router.get('/:id', specialController.getSpecialById.bind(specialController));
router.post('/', specialController.createSpecial.bind(specialController));
router.put('/:id', specialController.updateSpecial.bind(specialController));
router.delete('/:id', specialController.deleteSpecial.bind(specialController));

export { router as specialRoutes };
