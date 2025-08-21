import Card from "@mui/joy/Card";
import AspectRatio from "@mui/joy/AspectRatio";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import { Box } from "@mui/material";
import StarIcon from "../../assets/logo/Star.svg";
import type { Service } from "../../hook/useGetServiceForOneCategory";
import { baseURL } from "../../services/api-client";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
interface Props {
  Service: Service;
}
export const ServicesCard = ({ Service }: Props) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => {
        navigate(`/home/CategoriesServices/Service/DetailsPage/${Service.id}`);
      }}
      component="button"
      color="neutral"
      size="md"
      variant="outlined"
      sx={{
        width: { sm: "30%" },
        marginBottom: "20px",
        "&:hover": {
          boxShadow: "0 8px 32px 0 rgba(0,0,0,0.16)",
          backgroundColor: "rgba(var(--second-color),0.09)",
          transform: "translateY(0px) scale(1.001)",
        },
      }}
    >
      <AspectRatio minHeight="120px" maxHeight="200px">
        <img
          src={baseURL + Service.service_images}
          srcSet={baseURL + Service.service_images[0].image}
          loading="lazy"
          alt=""
        />
      </AspectRatio>
      <CardContent orientation="vertical">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          }}
        >
          <Typography sx={{ marginBottom: "5px" }} level="title-lg">
            {Service.title}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              marginBottom: "10px",
            }}
          >
            <Typography level="body-sm">
              Starting From {Service.price} KD
            </Typography>
            <Typography level="body-sm">
              {t("duration")}:{Service.duration} {t("hour")}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
          <Box
            sx={{
              marginRight: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "fit-content",
              padding: "10px",
              borderRadius: "10px",
              fontWeight: 600,
              backgroundColor: "#f3c87a82",
            }}
          >
            <Box component="img" src={StarIcon} />
            {Service.rating.substring(0, 3)}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
