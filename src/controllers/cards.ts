import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';

// Получить все карточки
export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find().populate('likes');
    res.status(200).json(cards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении карточек' });
  }
};

// Создать карточку
export const createCard = async (req: Request, res: Response) => {
  try {
    const { name, link } = req.body;

    if (!name || !link) {
      return res.status(400).json({ message: 'Переданы некорректные данные' });
    }

    const newCard = await Card.create({ name, link });
    res.status(201).json(newCard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при создании карточки' });
  }
};

// Удалить карточку по ID
export const deleteCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(400).json({ message: 'Некорректный ID карточки' });
    }

    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({ message: 'Карточка не найдена' });
    }

    await Card.deleteOne({ _id: cardId });
    res.status(200).json({ message: 'Карточка успешно удалена' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при удалении карточки' });
  }
};

export const likeCard = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { cardId } = req.params;

    if (!userId || !mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(400).json({ message: 'Некорректные данные' });
    }

    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true }
    );

    if (!updatedCard) {
      return res.status(404).json({ message: 'Карточка не найдена' });
    }

    res.status(200).json(updatedCard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при добавлении лайка' });
  }
};

export const dislikeCard = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { cardId } = req.params;

    if (!userId || !mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(400).json({ message: 'Некорректные данные' });
    }

    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true }
    );

    if (!updatedCard) {
      return res.status(404).json({ message: 'Карточка не найдена' });
    }

    res.status(200).json(updatedCard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при удалении лайка' });
  }
};