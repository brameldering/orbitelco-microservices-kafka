import express, { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { param } from 'express-validator';
import {
  validateRequest,
  currentUser,
  protect,
  admin,
  ObjectNotFoundError,
} from '@orbitelco/common';
import { User } from '../userModel';

const router = express.Router();

// @desc    Delete user
// @route   DELETE /api/users/v2/:id
// @access  Admin
// @req     params.id
// @res     status(200).{}
//       or status(404).ObjectNotFoundError('User not found')
router.delete(
  '/api/users/v2/:id',
  currentUser,
  protect,
  admin,
  [
    param('id')
      .customSanitizer((value) => isValidObjectId(value))
      .withMessage('Param id has to be a valid id'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    /*  #swagger.tags = ['Users']
      #swagger.description = 'Delete user'
      #swagger.security = [{
        bearerAuth: ['admin']
      }]
      #swagger.parameters['id'] = {
            in: 'path',
            description: 'user id',
            required: 'true',
            type: 'string'
      }
      #swagger.responses[200] = {
          description: 'Empty response',
      }
      #swagger.responses[404] = {
          description: 'ObjectNotFoundError(User not found)',
     } */
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      await User.deleteOne({ _id: user.id });
      res.status(200).send();
    } else {
      throw new ObjectNotFoundError('User not found');
    }
  }
);

export { router as deleteUserRouter };