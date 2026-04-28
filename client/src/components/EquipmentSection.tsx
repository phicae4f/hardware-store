import equipmentItems from "../data/data.json";
import { EquipmentList } from "./EquipmentList";
import { NumberComponent } from "./NumberComponent";

export const EquipmentSection = () => {
  return (
    <section className="equipment" id="equipment">
      <div className="container">
        <div className="equipment__wrapper">
          <h2 className="equipment__title">Предоставим в аренду</h2>
          <EquipmentList items={equipmentItems} />
          <NumberComponent />
        </div>
      </div>
    </section>
  );
};
