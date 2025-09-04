import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import { Button, Divider } from "@mui/material";
import { useGetOnePlaceDetails } from "../../hook/useGetOnePlaceDetails";
import { useNavigate, useParams } from "react-router-dom";

interface Props {
  route: string;
}

export default function BookingCard({route}:Props) {
  const { id } = useParams();
  const { data } = useGetOnePlaceDetails(Number(id));
  const navigate = useNavigate();
  
  return (
    <Card
      variant="solid"
      color="primary"
      invertedColors
      sx={{
        boxSizing: "border-box",
        margin: "auto",
        border: "solid 1px  #00000053",
        position: "sticky",
        top: "20px", // المسافة من الأعلى اللي يبلش فيها يثبت
        zIndex: 100, // لو عندك عناصر فوق بعض
        // باقي الستايلايت تبعك...
        backgroundColor: "white",
        boxShadow: "lg",
        width: "98%",

        // to make the demo resizeable
      }}
    >
      <Box
        sx={{
          color: "black",
          fontSize: "40px",
          fontWeight: "500",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {data?.weekday_price}KD{" "}
      </Box>
      <Box
        sx={{
          color: "#18181b99",
          fontSize: "20px",
          fontWeight: "200",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        per night
      </Box>
      <Divider sx={{ my: 1, borderBottomWidth: 1, bgcolor: "primary.main" }} />
      <Button
        disabled={data?.bookable === 0}
        onClick={()=> {navigate(route)}}
        sx={{
          color: "white",
          backgroundColor: data?.bookable === 0 ? "#b0b0b0" : "#18181b",
          "&:hover":
            data?.bookable === 0
              ? {
                  backgroundColor: "#b0b0b0",
                  cursor: "not-allowed", // يد تصير ممنوعة
                  boxShadow: "lg",
                }
              : {
                  backgroundColor: "#18181b6a",
                  boxShadow: "lg",
                },
        }}
      >
        Book Now
      </Button>
      <Box
        sx={{
          color: "#18181be6",
          fontSize: "20px",
          fontWeight: "200",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        You won't be charged yet
      </Box>

      <Divider sx={{ my: 1, borderBottomWidth: 1, bgcolor: "primary.main" }} />
      <Box sx={{ color: "black" }}>Need Help?</Box>
    </Card>
  );
}
