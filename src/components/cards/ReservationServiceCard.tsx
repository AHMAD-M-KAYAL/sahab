import { Card, CardHeader, CardContent, Typography, Chip } from "@mui/material";

export const ReservationServiceCard = () => {
  return (
    <Card
      sx={{
        border: "1px solid #ddd",
        borderRadius: 3,
        "&:hover": { boxShadow: 4 },
      }}
    >
      <CardHeader
        title={"name"}
        subheader={`Provider: ${1}`}
        action={<Chip label={status} size="small" />}
      />
      <CardContent>
        <Typography>ID: id</Typography>
        <Typography>Booking: bookingId</Typography>
        <Typography fontWeight={700}>Amount: amount $</Typography>
      </CardContent>
    </Card>
  );
};
