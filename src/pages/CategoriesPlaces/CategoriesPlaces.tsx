import { Box, Button } from "@mui/material";
import { t } from "i18next";
import { CatrgoryCard } from "../../components/cards/CatrgoryCard";
import { useGetCategoriesByType } from "../../hook/useGetCategoriesByType";
import { useNavigate } from "react-router-dom";
export const CategoriesPlaces = () => {
  const { data } = useGetCategoriesByType("place");
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{ display: "flex", justifyContent: "space-between", width: "97%" }}
      >
        <Box
          sx={{ padding: "10px 30px", fontSize: "1.5rem", fontWeight: "800" }}
        >
          {t("Popular Categories")}
        </Box>
        <Box
          component={Button}
          onClick={() => {
            navigate("CategoryPlaces");
          }}
        >
          {" "}
          {t("View All")}
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-around" }}>
        {data?.slice(-3).map((ele) => (
          <CatrgoryCard key={ele.id} category={ele} />
        ))}
      </Box>
    </Box>
  );
};
