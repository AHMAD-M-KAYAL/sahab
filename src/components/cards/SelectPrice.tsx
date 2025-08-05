import React from "react";
import Input from "@mui/joy/Input";
import { Box } from "@mui/material";

interface Props {
  price: number;
  setPrice: (price: number) => void;
}

export default function SelectPrice({ price, setPrice }: Props) {
  // ابدأ بـ price، وتوقع أنه ممكن يصير string من الحقل
  const [inputValue, setInputValue] = React.useState<string | number>(price);

  // حدد نوع e
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // امنع تحديث الصفحة
    // تأكد أن القيمة نصية وحولها
    const val = parseInt(inputValue as string, 10);
    setPrice(isNaN(val) || val < 0 ? 0 : val);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex" }}>
      <Box
        component="button"
        type="submit"
        className="btn btn-primary"
        sx={{ marginRight: "10px", marginLeft: "10px" }}
      >
        set Price
      </Box>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="أدخل السعر"
        sx={{ "--Input-focused": 1, width: 100 }}
      />
    </Box>
  );
}
