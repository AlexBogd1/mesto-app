import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { HTTP_STATUS, SERVER_ERROR_MESSAGE } from 'constants/constants';
import User from '../models/user';

// Получить всех пользователей
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: SERVER_ERROR_MESSAGE });
  }
};

// Получить пользователя по ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Некорректный ID пользователя' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Пользователь не найден' });
    }

    res.status(HTTP_STATUS.OK).json({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    });
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: SERVER_ERROR_MESSAGE });
  }
};

// Создать пользователя
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, about, avatar } = req.body;

    if (!name || !about || !avatar) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Переданы некорректные данные' });
    }

    const newUser = new User({ name, about, avatar });
    await newUser.save();
    res.status(HTTP_STATUS.CREATED).json(newUser);  // Ответ с созданным пользователем
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: SERVER_ERROR_MESSAGE });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { name, about } = req.body;

    if (!userId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Переданы некорректные данные' });
    }

    if (!name || !about) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Переданы некорректные данные' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Пользователь не найден' });
    }

    res.status(HTTP_STATUS.OK).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: SERVER_ERROR_MESSAGE });
  }
};

export const updateAvatar = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { avatar } = req.body;

    if (!userId || !avatar) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Переданы некорректные данные' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Пользователь не найден' });
    }

    res.status(HTTP_STATUS.OK).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: SERVER_ERROR_MESSAGE });
  }
};