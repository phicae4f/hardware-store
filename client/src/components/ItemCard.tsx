import { IoSettingsSharp } from "react-icons/io5";

export interface ItemCardProps {
  id: number;
  imgSrc: string;
  title: string;
  loadCapacity?: string;
  arrowLength?: string;
  vacuumGrasp?: string;
  bodyworkVolume?: string;
  frontBucket?: string;
  backBucket?: string;
  diggingDepth?: string;
  hydraulicHammer?: string;
  KMY?: string;
  carLoadCapacity?: string;
  installationLoadCapacity?: string;
  liftHeight?: string;
  volumeBucket?: string;
  dischargeHeight?: string;
  bucket?: string;
  type?: string;
  removable?: boolean;
  amount: string;
}

export const ItemCard = (props: ItemCardProps) => {
  const fields = [
    {
      condition: props.loadCapacity,
      label: "Грузоподъемность:",
      value: props.loadCapacity,
    },
    {
      condition: props.arrowLength,
      label: "Длина стрелы:",
      value: props.arrowLength,
    },
    {
      condition: props.vacuumGrasp,
      label: "Вакуумный захват:",
      value: props.vacuumGrasp,
    },
    {
      condition: props.bodyworkVolume,
      label: "Объём кузова:",
      value: props.bodyworkVolume,
    },
    {
      condition: props.frontBucket,
      label: "Фронтальный ковш:",
      value: props.frontBucket,
    },
    {
      condition: props.backBucket,
      label: "Задний ковш:",
      value: props.backBucket,
    },
    {
      condition: props.diggingDepth,
      label: "Глубина копания:",
      value: props.diggingDepth,
    },
    {
      condition: props.hydraulicHammer,
      label: "Гидромолот:",
      value: props.hydraulicHammer,
    },
    { condition: props.KMY, label: "КМУ:", value: props.KMY },
    {
      condition: props.carLoadCapacity,
      label: "Грузоподъемность машины:",
      value: props.carLoadCapacity,
    },
    {
      condition: props.installationLoadCapacity,
      label: "Грузоподъемность установки:",
      value: props.installationLoadCapacity,
    },
    {
      condition: props.liftHeight,
      label: "Высота подъёма:",
      value: props.liftHeight,
    },
    {
      condition: props.volumeBucket,
      label: "Объём ковша:",
      value: props.volumeBucket,
    },
    {
      condition: props.dischargeHeight,
      label: "Высота выгрузки:",
      value: props.dischargeHeight,
    },
    { condition: props.bucket, label: "Ковш:", value: props.bucket },
    { condition: props.type, label: "Тип:", value: props.type },
    {
      condition: props.removable,
      label: undefined,
      value: props.removable
        ? "Сменное: ковш, щётка, вилы, гидромолот"
        : undefined,
      isRemovable: true,
    },
  ];

  return (
    <div className="card">
      <div className="card__img-wrapper">
        <img
          className="card__img"
          src={props.imgSrc}
          alt="Карточка товара"
          width={315}
          height={236}
        />
        <h3 className="card__title">{props.title}</h3>
      </div>
      <ul className="card__info-list">
        {fields.map(
          (field, index) =>
            field.condition &&
            field.value && (
              <li
                className={`card__info-item ${field.isRemovable ? "card__info-item--removable" : ""}`}
                key={index}
              >
                <span className="card__info-item-text card__info-item-text--bold">
                  {field.label}
                </span>
                <span className="card__info-item-text">
                  {field.isRemovable && <IoSettingsSharp size={20} />}
                  {field.value}
                </span>
              </li>
            ),
        )}
      </ul>
      <span className="card__amount">{props.amount}</span>
    </div>
  );
};
