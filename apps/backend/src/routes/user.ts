import {
	deleteUserRequest,
	editUserRequest,
	getUserRequest,
	updatePasswordRequest,
} from '@backend/controllers/userController';
import express from 'express';

const userRouter = express.Router({ mergeParams: true });

userRouter.get('/', getUserRequest);
userRouter.put('/', editUserRequest);
userRouter.put('/update-password', updatePasswordRequest);
userRouter.delete('/delete-user', deleteUserRequest);

export default userRouter;
