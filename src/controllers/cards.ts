import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { HTTP_STATUS, SERVER_ERROR_MESSAGE } from 'constants/constants';
import Card from '../models/card';

// Получить все карточки
export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find().populate('likes');
    res.status(HTTP_STATUS.OK).json(cards);
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: SERVER_ERROR_MESSAGE });
  }
};

// Создать карточку
export const createCard = async (req: Request, res: Response) => {
  try {
    const { name, link } = req.body;

    if (!name || !link) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Переданы некорректные данные' });
    }

    const newCard = await Card.create({ name, link, owner: req.user._id });
    res.status(HTTP_STATUS.CREATED).json(newCard);
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: SERVER_ERROR_MESSAGE });
  }
};

// Удалить карточку по ID
export const deleteCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Некорректный ID карточки' });
    }

    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Карточка не найдена' });
    }

    // Проверка владельца карточки
    if (card.owner.toString() !== userId?.toString()) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({ message: 'Недостаточно прав для удаления карточки' });
    }

    await Card.deleteOne({ _id: cardId });
    res.status(HTTP_STATUS.OK).json({ message: 'Карточка успешно удалена' });
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: SERVER_ERROR_MESSAGE });
  }
};

export const likeCard = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { cardId } = req.params;

    if (!userId || !mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Некорректные данные' });
    }

    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true }
    );

    if (!updatedCard) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Карточка не найдена' });
    }

    res.status(HTTP_STATUS.OK).json(updatedCard);
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: SERVER_ERROR_MESSAGE});
  }
};

export const dislikeCard = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { cardId } = req.params;

    if (!userId || !mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Некорректные данные' });
    }

    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true }
    );

    if (!updatedCard) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Карточка не найдена' });
    }

    res.status(HTTP_STATUS.OK).json(updatedCard);
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: SERVER_ERROR_MESSAGE });
  }
};