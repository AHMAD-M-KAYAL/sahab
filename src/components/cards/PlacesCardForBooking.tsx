import Card from "@mui/joy/Card";
import AspectRatio from "@mui/joy/AspectRatio";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import { Box } from "@mui/material";
import LocationIcon from "../../assets/logo/Location.svg";
import StarIcon from "../../assets/logo/Star.svg";
import { baseURL } from "../../services/api-client";
export interface BookingPlaceDetails {
  weekday_price: number;
  title: string;
  address: string;
  tag: string;
  rating: string;
  place_images: string[];
}
interface Props {
  bookingPlaceDetails: BookingPlaceDetails;
}
//DetailsPlacesWithotBooking
export const PlacesCardForBooking = ({ bookingPlaceDetails }: Props) => {
  const firstImage = bookingPlaceDetails.place_images[0] ?? "/fallback.png";
  return (
    <Card
      color="neutral"
      size="md"
      variant="outlined"
      sx={{
        width: { sm: "100%", lg: "100%" },
        marginBottom: "20px",
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
            {bookingPlaceDetails.title}
          </Typography>
          <Box sx={{ display: "flex", marginBottom: "5px" }}>
            <Box component="img" src={LocationIcon} />
            <Typography level="body-xs">
              {bookingPlaceDetails.address}
            </Typography>
          </Box>
          <Typography
            sx={{
              paddingLeft: "5px",
              marginBottom: "5px",
              paddingRight: "5px",
            }}
            level="body-sm"
          >
            Starting From {bookingPlaceDetails.weekday_price} KD
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
          {bookingPlaceDetails.tag && (
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
              {bookingPlaceDetails.tag}
            </Box>
          )}
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
            {bookingPlaceDetails.rating.substring(0, 3)}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
