import { useEffect, useState } from "react";

const UNIT_OPTIONS = [
  {
    type: "weight",
    label: "Weight",
    units: [
      { value: "kg", label: "Kilogram (kg)" },
      { value: "g", label: "Gram (g)" },
    ],
  },
  {
    type: "volume",
    label: "Volume",
    units: [
      { value: "L", label: "Liter (L)" },
      { value: "ml", label: "Milliliter (ml)" },
    ],
  },
  {
    type: "length",
    label: "Length",
    units: [
      { value: "m", label: "Meter (m)" },
      { value: "cm", label: "Centimeter (cm)" },
    ],
  },
  {
    type: "piece",
    label: "Piece",
    units: [
      { value: "pcs", label: "Pieces (pcs)" },
    ],
  },
];

function ProductUnitSettings({ value = null, onChange }) {
  const [enabled, setEnabled] = useState(
    value?.enabled || false
  );

  const [unitType, setUnitType] = useState(
    value?.unit_type || ""
  );

  const [baseUnit, setBaseUnit] = useState(
    value?.base_unit || ""
  );

  const [sellingUnit, setSellingUnit] = useState(
    value?.selling_unit || ""
  );

  const [conversionFactor, setConversionFactor] = useState(
    value?.conversion_factor || 1
  );

  useEffect(() => {
    setEnabled(value?.enabled || false);
    setUnitType(value?.unit_type || "");
    setBaseUnit(value?.base_unit || "");
    setSellingUnit(value?.selling_unit || "");
    setConversionFactor(
      value?.conversion_factor || 1
    );
  }, [value]);

  function emitChange({
    newEnabled = enabled,
    newUnitType = unitType,
    newBaseUnit = baseUnit,
    newSellingUnit = sellingUnit,
    newConversionFactor = conversionFactor,
  }) {
    if (!onChange) {
      return;
    }

    onChange({
      enabled: newEnabled,
      unit_type: newUnitType,
      base_unit: newBaseUnit,
      selling_unit: newSellingUnit,
      conversion_factor:
        Number(newConversionFactor) || 1,
    });
  }

  function handleEnabledChange(newEnabled) {
    setEnabled(newEnabled);

    if (!newEnabled) {
      setUnitType("");
      setBaseUnit("");
      setSellingUnit("");
      setConversionFactor(1);

      emitChange({
        newEnabled: false,
        newUnitType: "",
        newBaseUnit: "",
        newSellingUnit: "",
        newConversionFactor: 1,
      });

      return;
    }

    emitChange({
      newEnabled: true,
    });
  }

  function handleUnitTypeChange(newType) {
    setUnitType(newType);

    const selectedType = UNIT_OPTIONS.find(
      (item) => item.type === newType
    );

    const firstUnit =
      selectedType?.units?.[0]?.value || "";

    setBaseUnit(firstUnit);
    setSellingUnit(firstUnit);

    emitChange({
      newEnabled: true,
      newUnitType: newType,
      newBaseUnit: firstUnit,
      newSellingUnit: firstUnit,
      newConversionFactor: conversionFactor,
    });
  }

  function handleBaseUnitChange(newBaseUnit) {
    setBaseUnit(newBaseUnit);

    emitChange({
      newEnabled: true,
      newUnitType: unitType,
      newBaseUnit,
      newSellingUnit: sellingUnit,
      newConversionFactor: conversionFactor,
    });
  }

  function handleSellingUnitChange(newSellingUnit) {
    setSellingUnit(newSellingUnit);

    emitChange({
      newEnabled: true,
      newUnitType: unitType,
      newBaseUnit: baseUnit,
      newSellingUnit,
      newConversionFactor: conversionFactor,
    });
  }

  function handleConversionFactorChange(newValue) {
    setConversionFactor(newValue);

    emitChange({
      newEnabled: true,
      newUnitType: unitType,
      newBaseUnit: baseUnit,
      newSellingUnit: sellingUnit,
      newConversionFactor: newValue,
    });
  }

  const selectedType = UNIT_OPTIONS.find(
    (item) => item.type === unitType
  );

  const availableUnits = selectedType?.units || [];

  return (
    <div className="border rounded-xl p-4 bg-gray-50 space-y-4">

      <div className="flex items-center justify-between gap-4">

        <div>
          <h3 className="font-semibold text-lg">
            Unit Settings
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Enable this only when the product is sold
            by weight, volume, length, or pieces.
          </p>
        </div>

        <label className="flex items-center gap-2 cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) =>
              handleEnabledChange(e.target.checked)
            }
            className="w-4 h-4"
          />

          <span className="font-medium">
            Enable
          </span>
        </label>

      </div>

      {enabled && (
        <div className="space-y-4">

          {/* UNIT TYPE */}

          <div>
            <label className="block font-medium mb-2">
              Unit Type
            </label>

            <select
              value={unitType}
              onChange={(e) =>
                handleUnitTypeChange(e.target.value)
              }
              className="w-full border rounded-lg p-3 bg-white"
            >
              <option value="">
                Select Unit Type
              </option>

              {UNIT_OPTIONS.map((item) => (
                <option
                  key={item.type}
                  value={item.type}
                >
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* BASE UNIT */}

          <div>
            <label className="block font-medium mb-2">
              Base Unit
            </label>

            <select
              value={baseUnit}
              onChange={(e) =>
                handleBaseUnitChange(e.target.value)
              }
              disabled={!unitType}
              className="w-full border rounded-lg p-3 bg-white disabled:bg-gray-100"
            >
              <option value="">
                Select Base Unit
              </option>

              {availableUnits.map((unit) => (
                <option
                  key={unit.value}
                  value={unit.value}
                >
                  {unit.label}
                </option>
              ))}
            </select>
          </div>

          {/* CONVERSION FACTOR */}

          <div>
            <label className="block font-medium mb-2">
              Conversion Factor
            </label>

            <input
              type="number"
              min="0.000001"
              step="any"
              value={conversionFactor}
              onChange={(e) =>
                handleConversionFactorChange(
                  e.target.value
                )
              }
              className="w-full border rounded-lg p-3 bg-white"
              placeholder="Example: 1000"
            />

            <p className="text-sm text-gray-500 mt-1">
              Example: 1 kg = 1000 g, so the
              conversion factor is 1000.
            </p>
          </div>

          {/* SELLING UNIT */}

          <div>
            <label className="block font-medium mb-2">
              Default Selling Unit
            </label>

            <select
              value={sellingUnit}
              onChange={(e) =>
                handleSellingUnitChange(
                  e.target.value
                )
              }
              disabled={!unitType}
              className="w-full border rounded-lg p-3 bg-white disabled:bg-gray-100"
            >
              <option value="">
                Select Selling Unit
              </option>

              {availableUnits.map((unit) => (
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
      )}

    </div>
  );
}

export default ProductUnitSettings;