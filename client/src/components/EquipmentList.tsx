import { ItemCard, type ItemCardProps } from "./ItemCard";

interface EquipmentListProps {
  items: ItemCardProps[];
}

export const EquipmentList = ({ items }: EquipmentListProps) => {
  return (
    <ul className="card-list">
      {items.map((item) => (
        <li className="card-list__item" key={item.id}>
          <ItemCard
            id={item.id}
            imgSrc={item.imgSrc}
            title={item.title}
            loadCapacity={item.loadCapacity}
            arrowLength={item.arrowLength}
            vacuumGrasp={item.vacuumGrasp}
            bodyworkVolume={item.bodyworkVolume}
            frontBucket={item.frontBucket}
            backBucket={item.backBucket}
            diggingDepth={item.diggingDepth}
            hydraulicHammer={item.hydraulicHammer}
            KMY={item.KMY}
            carLoadCapacity={item.carLoadCapacity}
            installationLoadCapacity={item.installationLoadCapacity}
            liftHeight={item.liftHeight}
            volumeBucket={item.volumeBucket}
            dischargeHeight={item.dischargeHeight}
            bucket={item.bucket}
            type={item.type}
            removable={item.removable}
            amount={item.amount}
          />
        </li>
      ))}
    </ul>
  );
};
