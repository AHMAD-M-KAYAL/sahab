import { Box, Button } from "@mui/material";
import IconBack from "../assets/logo/back.svg";
import { useNavigate } from "react-router-dom";
import SearchIcon from "../assets/logo/Search.svg";
import Input from "@mui/joy/Input";
import { useState, useEffect } from "react";
import { useGetSearchPlaces } from "../hook/useGetSearchPlaces";
import { useGetSearchServices } from "../hook/useGetSearchServices";
import { PlacesCard2 } from "../components/cards/PlacesCard2";
import { ServicesCard } from "../components/cards/ServicesCard";

export const SearchHome = () => {
  const navigate = useNavigate();

  const [searchTitle, setSearchTitle] = useState(""); // الكلمة المعتمدة للبحث
  const [inputValue, setInputValue] = useState(""); // النص اللي يكتبه المستخدم
  const [resultType, setResultType] = useState<"Service" | "Places">("Service");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchTitle(inputValue.trim());
    }
  };

  // جلب البيانات
  const { data: PlacesData } = useGetSearchPlaces(searchTitle);
  const { data: ServiceData } = useGetSearchServices(searchTitle);
  const PlacesResult = PlacesData ?? []; // لو API يرجع مصفوفة مباشرة
  const ServiceResult = ServiceData ?? [];

  // للتأكد من التغييرات
  useEffect(() => {
    console.log("Current result type:", resultType);
  }, [resultType]);

  const hasQuery = searchTitle.trim().length > 0;

  return (
    <Box sx={{ direction: "ltr" }}>
      {/* 🟢 شريط البحث */}
      <Box
        sx={{
          padding: "10px",
          width: "100%",
          backgroundColor: "white",
          boxShadow: "0 4px 16px 0 rgba(0,0,0,0.10)",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* زر العودة */}
        <Button
          onClick={() => navigate(-1)}
          sx={{
            width: "10%",
            backgroundColor: "white",
            "&:hover": {
              transform: "translateY(1px) scale(1.201)",
            },
          }}
        >
          <Box component="img" src={IconBack} />
        </Button>

        {/* حقل الإدخال */}
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          color="neutral"
          placeholder="Search"
          size="lg"
          variant="outlined"
          endDecorator={<Box component="img" src={SearchIcon} />}
          sx={{ borderRadius: "50px", width: "60%" }}
        />

        {/* أزرار الاختيار */}
        <Box sx={{ display: "flex", alignItems: "center", direction: "ltr" }}>
          <div
            className="btn-group"
            role="group"
            aria-label="Search type toggle"
          >
            <input
              type="radio"
              className="btn-check"
              name="btnradio"
              id="btnradio1"
              autoComplete="off"
              defaultChecked
              onClick={() => setResultType("Service")}
            />
            <label className="btn btn-outline-primary" htmlFor="btnradio1">
              Services
            </label>

            <input
              type="radio"
              className="btn-check"
              name="btnradio"
              id="btnradio2"
              autoComplete="off"
              onClick={() => setResultType("Places")}
            />
            <label className="btn btn-outline-primary" htmlFor="btnradio2">
              Places
            </label>
          </div>
        </Box>
      </Box>

      {/* 🟢 عرض النتائج */}
      {hasQuery && resultType === "Places" && (
        <Box sx={{ paddingTop: "20px" }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-evenly",
            }}
          >
            {PlacesResult.length > 0 ? (
              PlacesResult.map((ele) => (
                <PlacesCard2 key={ele.id} Places={ele} />
              ))
            ) : (
              <Box sx={{ fontSize: "20px", color: "gray" }}>
                No places found
              </Box>
            )}
          </Box>
        </Box>
      )}

      {hasQuery && resultType === "Service" && (
        <Box sx={{ paddingTop: "20px" }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-evenly",
            }}
          >
            {ServiceResult.length > 0 ? (
              ServiceResult.map((ele) => (
                <ServicesCard key={ele.id} Service={ele} />
              ))
            ) : (
              <Box sx={{ fontSize: "20px", color: "gray" }}>
                {" "}
                No services found{" "}
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};
