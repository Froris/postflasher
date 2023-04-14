import { Telegraf } from 'telegraf';
// eslint-disable-next-line import/no-unresolved
import { ExtraPhoto } from 'telegraf/typings/telegram-types';

// тут достём из переменных окружения (.env) токен, который мы получили при создания бота
const token = import.meta.env.VITE_BOT_TOKEN as string;
// инициализируем интерфейс бота, через который мы будем отдавать ему команды и присылать пост
const bot = new Telegraf(token);

const sendMessageAsync = (chatId: string, message: string) => {
  return new Promise<string | number>((resolve, reject) => {
    bot.telegram
      .sendMessage(chatId, message)
      .then((response) => {
        resolve(response.message_id);
      })
      .catch((error) => reject(error));
  });
};

const sendPhotoAsync = (chatId: string, photo: string, options: ExtraPhoto) => {
  return new Promise<string | number>((resolve, reject) => {
    bot.telegram
      .sendPhoto(chatId, photo, options)
      .then((response) => {
        resolve(response.message_id);
      })
      .catch((error) => reject(error));
  });
};

export const deleteMessage = async (messageId: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    bot.telegram
      .deleteMessage('@testnewscaph', messageId)
      .then((response: boolean) => {
        if (response) {
          resolve('Пост успішно видалено в Telegram!');
        }
      })
      .catch((err) => {
        console.error(err);
        reject(`Не вдалося видалити пост у Telegram!`);
      });
  });
};

export const publishToTelegram = async (
  title: string,
  text: string,
  image?: string
): Promise<string | number> => {
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
