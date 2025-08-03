import { Box } from "@mui/material";
import { Button } from "@mui/material";

import { t } from "i18next";
import { useNavigate } from "react-router-dom";
import { FeaturedPlacesCard } from "../../components/cards/FeaturedPlacesCard";
import { useGetFeaturedPlaces } from "../../hook/useGetFeaturedPlaces";

export const FeaturedPlacesHome = () => {
  const { data } = useGetFeaturedPlaces();
  const navigate = useNavigate();
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: { sm: "97%", lg: "90%" },
        }}
      >
        <Box sx={{ padding: "40px ", fontSize: "1.5rem", fontWeight: "800" }}>
          {t("Featured Places")}
        </Box>
        <Box
          component={Button}
          onClick={() => {
            navigate("/home/featured");
          }}
        >
          {" "}
          {t("View All")}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "space-evenly" },
          alignContent: { lg: "center" },
          flexDirection: { xs: "row", lg: "column" }, // xs<1200=row ، xl>=1200=column
        }}
      >
        {data?.map((ele) => (
          <FeaturedPlacesCard key={ele.id} featuredPlaces={ele} />
        ))}
      </Box>
    </Box>
  );
};
