import { Telegraf } from 'telegraf';
// eslint-disable-next-line import/no-unresolved
import { ExtraPhoto } from 'telegraf/typings/telegram-types';

const token = import.meta.env.VITE_BOT_TOKEN as string;

const bot = new Telegraf(token);

const sendMessageAsync = (chatId: string, message: string) => {
  return new Promise<void>((resolve, reject) => {
    bot.telegram
      .sendMessage(chatId, message)
      .then(() => resolve())
      .catch((error) => reject(error));
  });
};

const sendPhotoAsync = (chatId: string, photo: string, options: ExtraPhoto) => {
  return new Promise<void>((resolve, reject) => {
    bot.telegram
      .sendPhoto(chatId, photo, options)
      .then(() => resolve())
      .catch((error) => reject(error));
  });
};

export const createNews = async (
  title: string,
  text: string,
  image: string
): Promise<void> => {
  await sendPhotoAsync('@testnewscaph', image, {
    caption: `${title}\n\n${text}`,
  });
};
