import { SavedPost } from '../pages/Root';

export type AdminsList = Array<{
  login: string;
  password: string;
  firstName?: string;
  midName?: string;
  lastName?: string;
}>;

export const adminsList: AdminsList = [
  {
    login: 'admin@admin',
    password: 'admin',
  },
  {
    login: 'random@mail',
    password: 'random',
    firstName: 'Олександр',
    midName: 'Ігорович',
    lastName: 'Коноваленко',
  },
  {
    login: 'fox@mail',
    password: 'fox',
    firstName: 'Юлія',
    midName: 'Володимирівна',
    lastName: 'Григоренко',
  },
  {
    login: 'joe@mail',
    password: 'joe',
    firstName: 'Анастасія',
    midName: 'Миколаївна',
    lastName: 'Лисенко',
  },
  {
    login: 'fluff@mail',
    password: 'fluff',
    firstName: 'Олег',
    midName: 'Вікторович',
    lastName: 'Ковальчук',
  },
];

export const preRenderedPosts: SavedPost[] = [
  {
    id: 0,
    author: 'admin@admin',
    text: 'Сьогодні студенти кафедри інформаційних технологій провели майстер-клас для школярів з місцевої школи № 00. Студенти розповіли про різні галузі IT-індустрії та провели практичні заняття з програмування на мові Python. Школярі були в захваті від занять і висловили бажання продовжувати вивчення програмування. Ми сподіваємося, що ця зустріч допоможе привернути молодих людей до IT-галузі та підготувати нове покоління фахівців.',
    title: 'Майстер-клас для школярів',
    imageUrl: 'https://kp.ua/img/article/6385/66_news_big-v1639334384.webp',
    publishedTo: {
      telegram: [true, 9999],
      facebook: [true, '243668514742506'],
    },
    time: '12:04 13.04.2023',
  },
  {
    id: 1,
    author: 'fox@mail',
    text: 'Сьогодні кафедра економіки провела онлайн-семінар з експертом з США, професором Університету Бостона. Тема семінару була присвячена новим методам аналізу економічних даних. Студенти та викладачі запитали багато питань експерту, і він дав цінні поради та рекомендації щодо роботи з даними. Ми вдячні професору за цікавий та пізнавальний семінар, і сподіваємося на подальшу співпрацю.',
    title: 'Онлайн-семінар з експертом з США',
    imageUrl:
      'https://proforientator.ru/publications/articles/New%20Folder/prezent2.jpg',
    publishedTo: {
      telegram: [true, 99990],
      facebook: [true, '243670734742284'],
    },
    time: '12:09 13.04.2023',
  },
];
