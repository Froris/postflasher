import { Telegraf } from 'telegraf';
// eslint-disable-next-line import/no-unresolved
import { ExtraPhoto } from 'telegraf/typings/telegram-types';

const token = import.meta.env.VITE_BOT_TOKEN as string;

const bot = new Telegraf(token);

const sendMessageAsync = (chatId: string, message: string) => {
  return new Promise<string>((resolve, reject) => {
    bot.telegram
      .sendMessage(chatId, message)
      .then((response) => {
        resolve(response.message_id.toString());
      })
      .catch((error) => reject(error));
  });
};

const sendPhotoAsync = (chatId: string, photo: string, options: ExtraPhoto) => {
  return new Promise<string>((resolve, reject) => {
    bot.telegram
      .sendPhoto(chatId, photo, options)
      .then((response) => resolve(response.photo[0].file_id))
      .catch((error) => reject(error));
  });
};

export const createNews = async (
  title: string,
  text: string,
  image?: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (image) {
      sendPhotoAsync('@testnewscaph', image, {
        caption: `${title}\n\n${text}`,
      })
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          console.error(err);
          reject(`Error! Не вдалося опублікувати на Telegram!`);
        });
    } else {
      sendMessageAsync('@testnewscaph', `${title}\n\n${text}`)
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          console.error(err);
          reject(`Error! Не вдалося опублікувати на Telegram!`);
        });
    }
  });
};
