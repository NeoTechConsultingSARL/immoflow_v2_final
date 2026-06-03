import { useEffect, useRef, useState } from "react";
import { calculateAmountFromDimensions } from "@/lib/currency";

interface AmountFields {
  land_size: string;
  unit_price: string;
  amount: string;
}

export function useCalculatedAmount(
  data: AmountFields,
  setData: (key: keyof AmountFields, value: string) => void,
) {
  const [amountManual, setAmountManual] = useState(false);
  const skipNextCalc = useRef(false);

  useEffect(() => {
    if (amountManual || skipNextCalc.current) {
      skipNextCalc.current = false;
      return;
    }

    const computed = calculateAmountFromDimensions(data.land_size, data.unit_price);
    if (computed === null) {
      return;
    }

    const next = String(computed);
    if (data.amount !== next) {
      setData("amount", next);
    }
  }, [data.land_size, data.unit_price, amountManual, data.amount, setData]);

  const onAmountChange = (value: string) => {
    setAmountManual(true);
    setData("amount", value);
  };

  const resetManualAmount = () => {
    setAmountManual(false);
    skipNextCalc.current = true;
  };

  return { onAmountChange, resetManualAmount, amountManual };
}
