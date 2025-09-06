// ServicesForOneCategory.tsx
import { Box, Button, Stack, Chip } from "@mui/material";
import { t } from "i18next";
import IconBack from "../../../assets/logo/back.svg";
import { useNavigate, useParams } from "react-router-dom";
import { ServicesCard } from "../../../components/cards/ServicesCard";
import {
  useGetServiceForOneCategory,
  type Service,
} from "../../../hook/useGetServiceForOneCategory";
import { useState, useEffect } from "react";
import SelectPrice from "../../../components/cards/SelectPrice";

export const ServicesForOneCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [price, setPrice] = useState(0);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetServiceForOneCategory(
    Number(id),
    price,
    page
  );

  // نتائج الخدمات
  const service = Array.isArray(data?.data?.services?.data)
    ? data!.data.services.data
    : [];

  // ميتاداتا التصفح
  const currentPage = data?.data?.services?.current_page ?? page;
  const lastPage = data?.data?.services?.last_page; // يجي من الـ API

  const canPrev = currentPage > 1;
  const canNext =
    typeof lastPage === "number" ? currentPage < lastPage : service.length > 0;

  // كلما تغيّر الفلتر رجّع للصفحة الأولى
  useEffect(() => {
    setPage(1);
  }, [price, id]);

  const CategoryType = localStorage.getItem("CategoryType");

  return (
    <>
      <nav
        className="navbar"
        style={{
          backgroundColor: "white",
          direction: "ltr",

          boxShadow: "0 4px 16px 0 rgba(0,0,0,0.10)",
        }}
      >
        <Box
          component={Button}
          onClick={() => navigate("/home/CategoryServices")}
          sx={{
            width: "10%",
            backgroundColor: "white",
            "&:hover": { transform: "translateY(1px) scale(1.201)" },
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
          {t("Services we Provide")}/{CategoryType}
        </Box>
      </nav>

      {/* الفلاتر + عرض رقم الصفحة */}
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
        <SelectPrice price={price} setPrice={setPrice} />

        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label={`Page ${currentPage}${lastPage ? ` / ${lastPage}` : ""}`}
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        </Stack>
      </Box>

      {/* المحتوى */}
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
          {isLoading && (
            <Box sx={{ color: "gray", fontSize: 18, py: 6 }}>
              {t("Loading")}...
            </Box>
          )}

          {!isLoading &&
            service.length > 0 &&
            service.map((ele: Service) => (
              <ServicesCard Service={ele} key={ele.id} />
            ))}

          {!isLoading && service.length === 0 && (
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

        {/* أزرار التصفح */}
        <Stack
          direction="row"
          justifyContent="center"
          spacing={2}
          sx={{ mt: 3, mb: 6 }}
        >
          <Button
            variant="outlined"
            disabled={!canPrev}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            {t("Prev")}
          </Button>
          <Button
            variant="contained"
            disabled={!canNext}
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
