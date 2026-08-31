import { useEffect, useState } from "react";

const UNIT_OPTIONS = [
  {
    value: "pcs",
    unitType: "piece",
    baseUnit: "pcs",
    label: "Pieces (pcs)",
  },
  {
    value: "kg",
    unitType: "weight",
    baseUnit: "kg",
    label: "Kilogram (kg)",
  },
  {
    value: "g",
    unitType: "weight",
    baseUnit: "g",
    label: "Gram (g)",
  },
  {
    value: "L",
    unitType: "volume",
    baseUnit: "L",
    label: "Liter (L)",
  },
  {
    value: "m",
    unitType: "length",
    baseUnit: "m",
    label: "Meter (m)",
  },
];

const DEFAULT_UNIT = UNIT_OPTIONS[0];

function ProductUnitSettings({
  value = null,
  onChange,
}) {
  const [sellingUnit, setSellingUnit] = useState(
    value?.selling_unit ||
      value?.base_unit ||
      DEFAULT_UNIT.value
  );

  useEffect(() => {
    setSellingUnit(
      value?.selling_unit ||
        value?.base_unit ||
        DEFAULT_UNIT.value
    );
  }, [
    value?.selling_unit,
    value?.base_unit,
  ]);

  function handleUnitChange(newSellingUnit) {
    const selectedUnit =
      UNIT_OPTIONS.find(
        (item) =>
          item.value === newSellingUnit
      ) || DEFAULT_UNIT;

    setSellingUnit(selectedUnit.value);

    if (onChange) {
      onChange({
        enabled: true,

        unit_type:
          selectedUnit.unitType,

        base_unit:
          selectedUnit.baseUnit,

        selling_unit:
          selectedUnit.value,

        conversion_factor: 1,
      });
    }
  }

  return (
    <div className="border rounded-xl p-4 bg-gray-50">

      <div>
        <h3 className="font-semibold text-lg">
          Unit
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          Products use Pieces by default. Change
          the unit only when needed.
        </p>
      </div>

      <div className="mt-4">
        <label
          htmlFor="product-selling-unit"
          className="block font-medium mb-2"
        >
          Selling Unit
        </label>

        <select
          id="product-selling-unit"
          value={sellingUnit}
          onChange={(e) =>
            handleUnitChange(
              e.target.value
            )
          }
          className="w-full border rounded-lg p-3 bg-white"
        >
          {UNIT_OPTIONS.map((unit) => (
            <option
              key={unit.value}
              value={unit.value}
            >
              {unit.label}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
}

export default ProductUnitSettings;
