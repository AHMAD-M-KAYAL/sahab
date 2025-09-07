import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";
import { MoreHoriz } from "@mui/icons-material";

export const ReservationPlaceCard = () => {
  return (
    <Card
      sx={{
        border: "2px solid #1976d2",
        borderRadius: 3,
        "&:hover": { boxShadow: 4 },
      }}
    >
      <CardHeader
        title={""}
        subheader={`ID: ${1}`}
        action={
          <IconButton>
            <MoreHoriz />
          </IconButton>
        }
      />
      <CardContent>
        <Typography>Status: status</Typography>
        <Typography>Category: category</Typography>
        <Typography fontWeight={700}>Amount: amount KD</Typography>
      </CardContent>
    </Card>
  );
};
