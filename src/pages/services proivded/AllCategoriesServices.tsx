import { Box, Button } from "@mui/material";
import { t } from "i18next";
import IconBack from "../../assets/logo/back.svg";
import { useNavigate } from "react-router-dom";
import { useGetCategoriesByType } from "../../hook/useGetCategoriesByType";
import { CatrgoryServicesCard } from "../../components/cards/CatrgorySevicesCard";

export const AllCategoriesServices = () => {
  const { data } = useGetCategoriesByType("service");
  const navigate = useNavigate();
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
            navigate("/home");
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
          {t("Services we Provide")}
        </Box>
      </nav>
      <Box sx={{ paddingTop: "20px" }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-evenly",
          }}
        >
          {data?.map((ele) => (
            <CatrgoryServicesCard category={ele} />
          ))}
        </Box>
      </Box>
    </>
  );
};
