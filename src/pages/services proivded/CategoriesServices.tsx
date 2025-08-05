import { Box, Button } from "@mui/material";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
import { useGetCategoriesByType } from "../../hook/useGetCategoriesByType";
import { CatrgoryServicesCard } from "../../components/cards/CatrgorySevicesCard";
export const CategoriesServices = () => {
  const { data } = useGetCategoriesByType("service");
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
          {t("Services we Provide")}
        </Box>
        <Box
          component={Button}
          onClick={() => {
            navigate("CategoryServices.");
          }}
        >
          {" "}
          {t("View All")}
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-around" }}>
        {data?.slice(-3).map((ele) => (
          <CatrgoryServicesCard key={ele.id} category={ele} />
        ))}
      </Box>
    </Box>
  );
};
