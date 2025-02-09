import { Router } from 'express';
import { getCards, createCard, deleteCard, likeCard, dislikeCard } from 'controllers/cards';

const cardRouter = Router();

// Роуты для карточек
cardRouter.get('/', getCards);
cardRouter.post('/', createCard);
cardRouter.delete('/:cardId', deleteCard);
cardRouter.put('/:cardId/likes', likeCard);
cardRouter.delete('/:cardId/likes', dislikeCard);

export default cardRouter;