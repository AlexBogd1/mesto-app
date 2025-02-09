import { getUserById, getUsers , createUser, updateProfile, updateAvatar} from "controllers/users";
import { Router } from "express";


const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserById);
userRouter.post('/', createUser);
userRouter.patch('/me', updateProfile);
userRouter.patch('/me/avatar', updateAvatar);

export default userRouter;