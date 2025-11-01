export interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
  media?: string[];
}

export const mockReviews: Review[] = [
  {
    id: '1',
    name: 'Мария Петрова',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    rating: 5,
    text: 'Невероятное качество! Платье пришло точно как на фото, сидит идеально. Ткань очень приятная, швы аккуратные. Доставка быстрая, упаковка красивая. Анна, спасибо за отличный сервис! Буду заказывать еще 💕',
    date: '2 дня назад',
    media: [
      'https://images.pexels.com/photos/1007034/pexels-photo-1007034.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
    ]
  },
  {
    id: '2',
    name: 'Елена Козлова',
    avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    rating: 5,
    text: 'Заказывала блузку для работы. Очень довольна покупкой! Материал качественный, не мнется, цвет насыщенный. Размер подошел идеально, консультация была на высоте. Рекомендую всем подругам!',
    date: '5 дней назад',
    media: [
      'https://images.pexels.com/photos/1006991/pexels-photo-1006991.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
    ]
  },
  {
    id: '3',
    name: 'Анастасия Волкова',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    rating: 4,
    text: 'Юбка классная, но пришлось немного подшить по длине. В целом качество хорошее, цена адекватная. Продавец отзывчивый, быстро отвечает на вопросы.',
    date: '1 неделю назад'
  },
  {
    id: '4',
    name: 'Ольга Сидорова',
    avatar: 'https://images.pexels.com/photos/1722198/pexels-photo-1722198.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    rating: 5,
    text: 'Потрясающий магазин! Заказывала сразу несколько вещей для отпуска. Все пришло в срок, качество на высоте. Особенно понравился сарафан - очень удобный и стильный. Анна, вы молодец! ✨',
    date: '1 неделю назад',
    media: [
      'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
      'https://images.pexels.com/photos/1394939/pexels-photo-1394939.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
      'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
    ]
  },
  {
    id: '5',
    name: 'Татьяна Иванова',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    rating: 5,
    text: 'Уже третий раз заказываю у Анны. Каждый раз получаю невероятное удовольствие от покупок! Вещи качественные, стильные, всегда в тренде. Доставка аккуратная, общение приятное. Однозначно рекомендую! 🥰',
    date: '2 недели назад'
  },
  {
    id: '6',
    name: 'Кристина Морозова',
    avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    rating: 4,
    text: 'Заказывала джинсы. Качество хорошее, посадка отличная. Единственное - цвет оказался чуть темнее, чем на фото. Но в целом довольна покупкой!',
    date: '2 недели назад',
    media: [
      'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
    ]
  },
  {
    id: '7',
    name: 'Виктория Лебедева',
    avatar: 'https://images.pexels.com/photos/1484801/pexels-photo-1484801.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    rating: 5,
    text: 'Восхитительное пальто! Заказывала на осень, получилось очень стильно и тепло. Ткань премиум качества, фурнитура надежная. Много комплиментов получаю. Спасибо за такую красоту! 🧥',
    date: '3 недели назад',
    media: [
      'https://images.pexels.com/photos/1375849/pexels-photo-1375849.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
      'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
    ]
  }
];