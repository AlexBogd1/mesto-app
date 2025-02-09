import { Request, Response } from 'express';
import User from '../models/user';
import mongoose from 'mongoose';

// Получить всех пользователей
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении пользователей', error });
  }
};

// Получить пользователя по ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Некорректный ID пользователя' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.status(200).json({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении пользователя' });
  }
};

// Создать пользователя
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, about, avatar } = req.body;
    console.log(req.body)
    const newUser = new User({ name, about, avatar });
    await newUser.save();
    res.status(201).json(newUser);  // Ответ с созданным пользователем
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при создании пользователя', error });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { name, about } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Пользователь не авторизован' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обновлении пользователя', error });
  }
};

export const updateAvatar = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { avatar } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Пользователь не авторизован' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обновлении аватара', error });
  }
};