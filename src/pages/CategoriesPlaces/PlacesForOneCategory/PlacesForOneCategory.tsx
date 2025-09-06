import { Box, Button, Stack, Chip } from "@mui/material";
import { t } from "i18next";
import IconBack from "../../../assets/logo/back.svg";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetPlacesForOneCategorie,
  type Places,
} from "../../../hook/useGetPlacesForOneCategorie";
import { PlacesCard2 } from "../../../components/cards/PlacesCard2";
import TagForm from "../../../components/cards/TagForm";
import { useEffect, useState } from "react";
import SelectPrice from "../../../components/cards/SelectPrice";

export const PlacesForOneCategory = () => {
  const { id } = useParams(); // id is a string
  const navigate = useNavigate();

  const [type, setType] = useState("none");
  const [price, setPrice] = useState(0);
  const [page, setPage] = useState(1); // ← NEW: الصفحة الحالية

  // كل ما تغيّري الفلاتر ارجعي للصفحة الأولى
  useEffect(() => {
    setPage(1);
  }, [type, price]);

  // مهم: مرّري page كوسيط رابع للهوك
  const { data, isLoading } = useGetPlacesForOneCategorie(
    Number(id),
    type,
    price,
    page
  );

  const places = Array.isArray(data?.data?.places?.data)
    ? data!.data.places.data
    : [];

  const currentPage = data?.data?.places?.current_page ?? page;
  const lastPage = data?.data?.places?.last_page; // إن وُجد من الـ API

  // منطق التعطيل للأزرار:
  const canGoPrev = currentPage > 1;
  // لو ما عندك last_page من الـ API، خلي next فعّال طالما فيه نتائج
  const canGoNext =
    typeof lastPage === "number" ? currentPage < lastPage : places.length > 0;

  const CategoryType = localStorage.getItem("CategoryType");

  return (
    <>
      <nav
        className="navbar"
        style={{
          backgroundColor: "white",
          boxShadow: "0 4px 16px 0 rgba(0,0,0,0.10)",
        }}
      >
        <Box
          component={Button}
          onClick={() => {
            navigate("/home/CategoryPlaces"); // شلت النقطة الزائدة
          }}
          sx={{
            width: "10%",
            backgroundColor: "white",
            "&:hover": {
              transform: "translateY(1px) scale(1.201)",
            },
          }}
        >
          <Box component="img" src={IconBack} />
        </Box>
        <Box
          sx={{
            padding: "10px",
            fontWeight: "800",
            fontSize: "30px",
            width: "80%",
          }}
        >
          {t("Popular Categories")}/{CategoryType}
        </Box>
      </nav>

      {/* فلاتر + معلومات الصفحة */}
      <Box
        sx={{
          display: "flex",
          margin: "10px",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <TagForm type={type} setType={setType} />
        <SelectPrice price={price} setPrice={setPrice} />

        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label={`Page ${currentPage}${lastPage ? ` / ${lastPage}` : ""}`}
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        </Stack>
      </Box>

      <Box sx={{ paddingTop: "20px" }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-evenly",
            gap: 2,
            minHeight: 180,
          }}
        >
          {isLoading && <Box sx={{ py: 6 }}>{t("loading")}...</Box>}

          {!isLoading &&
            places.length > 0 &&
            places.map((ele: Places) => (
              <PlacesCard2 Places={ele} key={ele.id} />
            ))}

          {!isLoading && places.length === 0 && (
            <Box
              sx={{
                color: "var(--main-color)",
                fontSize: "30px",
                fontWeight: "400",
                py: 6,
              }}
            >
              {t("No Places To Show")}
            </Box>
          )}
        </Box>

        {/* أزرار التنقل بين الصفحات */}
        <Stack
          direction="row"
          justifyContent="center"
          spacing={2}
          sx={{ mt: 3, mb: 6 }}
        >
          <Button
            variant="outlined"
            disabled={!canGoPrev}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            {t("Prev")}
          </Button>
          <Button
            variant="contained"
            disabled={!canGoNext}
            onClick={() => setPage((p) => p + 1)}
            sx={{ backgroundColor: "var(--main-color)" }}
          >
            {t("Next")}
          </Button>
        </Stack>
      </Box>
    </>
  );
};
