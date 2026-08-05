import Barcode from "react-barcode";

function BarcodeGenerator({ value }) {

  return (
    <div className="flex justify-center">

      <Barcode
        value={value}
        width={2}
        height={70}
        fontSize={14}
        displayValue={true}
      />

    </div>
  );

}

export default BarcodeGenerator;