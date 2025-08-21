/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from "@mui/joy/Card";
import AspectRatio from "@mui/joy/AspectRatio";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import { Box } from "@mui/material";
import LocationIcon from "../../assets/logo/Location.svg";
import StarIcon from "../../assets/logo/Star.svg";
import { type FeaturedPlaces } from "../../hook/useGetFeaturedPlaces";
import type { Places } from "../../hook/useGetPlacesForOneCategorie";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../services/api-client";
interface Props {
  Places: FeaturedPlaces | Places;
}

export const PlacesCard2 = ({ Places }: Props) => {
  const firstImage = Places.place_images?.[0]?.image ?? "/fallback.png";
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => {
        navigate(`/home/CategoryPlaces/places/DetailsPage/${Places.id}`);
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
        <Box
          component="img"
          src={baseURL + firstImage}
          sx={{ marginBottom: "10px" }}
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
            {Places.title}
          </Typography>
          <Box sx={{ display: "flex", marginBottom: "5px" }}>
            <Box component="img" src={LocationIcon} />
            <Typography level="body-xs"> {Places.address}</Typography>
          </Box>
          <Typography
            sx={{
              paddingLeft: "5px",
              marginBottom: "5px",
              paddingRight: "5px",
            }}
            level="body-sm"
          >
            Starting From {Places.weekday_price} KD
          </Typography>
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
              backgroundColor: "#567ab88c",
            }}
          >
            {Places.tag}
          </Box>
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
            {Places.rating.substring(0, 3)}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
