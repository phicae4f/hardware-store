export interface Project {
  id: number;
  title: string;
  address?: string;
  images: string[];
  category: string;
}

export const projectsData: Project[] = [
  {
    id: 1,
    title: "Строительство завода ПЭТ",
    address: "Раменский р-н, с. Никитское, 200/3",
    images: [
      "/img/workExamples/factory/1.png",
      "/img/workExamples/factory/2.png",
      "/img/workExamples/factory/3.png",
      "/img/workExamples/factory/4.png",
    ],
    category: "Промышленные объекты"
  },
  {
    id: 2,
    title: "Бургер Кинг",
    address: "г. Балашиха, шоссе Энтузиастов, 44",
    images: [
      "/img/workExamples/burgerKing/1.png",
      "/img/workExamples/burgerKing/2.png",
      "/img/workExamples/burgerKing/3.png",
      "/img/workExamples/burgerKing/4.png",
      "/img/workExamples/burgerKing/5.png",
      "/img/workExamples/burgerKing/6.png",
    ],
    category: "Общественное питание"
  },
  {
    id: 3,
    title: "Сеть клиник «Точка зрения»",
    address: "г.о. Воскресенск, ул. Железнодорожная, д. 3",
    images: [
      "/img/workExamples/clinic/1.png",
      "/img/workExamples/clinic/2.png",
      "/img/workExamples/clinic/3.png",
      "/img/workExamples/clinic/4.png",
      "/img/workExamples/clinic/5.png",
      "/img/workExamples/clinic/6.png",
    ],
    category: "Медицинские учреждения"
  },
  {
    id: 4,
    title: "Торговый центр",
    address: "г. Люберцы, проспект Комсомольский, 21А",
    images: [
      "/img/workExamples/mallLyb/1.png",
      "/img/workExamples/mallLyb/2.png",
      "/img/workExamples/mallLyb/3.png",
      "/img/workExamples/mallLyb/4.png",
      "/img/workExamples/mallLyb/5.png",
      "/img/workExamples/mallLyb/6.png",
    ],
    category: "Торговые центры"
  },
  {
    id: 5,
    title: "Торговый центр",
    address: "г.о. Ногинск, ул. 3-го Интернационала, 53",
    images: [
      "/img/workExamples/mallNog/1.png",
      "/img/workExamples/mallNog/2.png",
      "/img/workExamples/mallNog/3.png",
      "/img/workExamples/mallNog/4.png",
    ],
    category: "Торговые центры"
  },
  {
    id: 6,
    title: "Реконструкция ангара",
    address: "г. Подольск, ул. Плещеевская, 28",
    images: [
      "/img/workExamples/reconstruction/1.png",
      "/img/workExamples/reconstruction/2.png",
      "/img/workExamples/reconstruction/3.png",
      "/img/workExamples/reconstruction/4.png",
      "/img/workExamples/reconstruction/5.png",
    ],
    category: "Реконструкция"
  },
  {
    id: 7,
    title: "Магазин «Пятерочка»",
    address: "г.о. Воскресенск, д. Непецино",
    images: [
      "/img/workExamples/store/1.png",
      "/img/workExamples/store/2.png",
      "/img/workExamples/store/3.png",
      "/img/workExamples/store/4.png",
    ],
    category: "Торговые объекты"
  }
];