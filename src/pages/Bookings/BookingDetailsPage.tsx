import * as React from "react";
import IconBack from "../../assets/logo/back.svg";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Divider,
  Button,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import {
  PlacesCardForBooking,
  type BookingPlaceDetails,
} from "../../components/cards/PlacesCardForBooking";
import { useGetBookingById } from "../../hook/useGetBookingById";
import { useParams } from "react-router-dom";
import { useCancelBooking } from "../../hook/useCancelBooking";
import { useTranslation } from "react-i18next";
// import apiClient from "../../services/api-client";

const statusColor = (status: string) => {
  const s = (status || "").toLowerCase();
  if (s === "completed") return { bg: "#e8f5e9", color: "#1b5e20" }; // أخضر
  if (s === "placed") return { bg: "#fff8e1", color: "#795548" }; // أصفر/بني فاتح
  if (s === "canceled") return { bg: "#ffebee", color: "#b71c1c" }; // أحمر
  return { bg: "#eceff1", color: "#455a64" }; // رمادي
};
export default function BookingDetailsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [showCancel, setShowCancel] = React.useState(false);
  const token = localStorage.getItem("token")!;
  const { id } = useParams();
  const { data } = useGetBookingById(Number(id), token);
  // const navigate = useNavigate();
  // const handleCancelBooking = async () => {
  //   if (!id) return;

  //   try {
  //     await apiClient.put(
  //       `/api/bookings/${id}`,
  //       { status: "canceled" }, // 👈 البودي المطلوب
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           Accept: "application/json",
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     // نجاح
  //     navigate("/Bookings");
  //   } catch (error) {
  //     console.error("Failed to cancel booking", error);
  //   }
  // };
  const { mutate: cancelBooking } = useCancelBooking(data?.id ?? 0, token);

  const placeProps: BookingPlaceDetails = {
    weekday_price: data?.weekday_price ?? 0,
    title: data?.place_title ?? "",
    address: data?.address ?? "",
    tag: data?.tag ?? "",
    rating: data?.rating ?? "0",
    place_images: data?.images ?? [],
  };
  const sx = statusColor(data?.status ?? "");
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      {/* Header */}
      <nav
        className="navbar"
        style={{
          backgroundColor: "white",
          direction: "ltr",

          boxShadow: "0 4px 16px 0 rgba(0,0,0,0.10)",
        }}
      >
        <Box
          component={Button}
          onClick={() => {
            navigate(-1);
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
          {t("Popular Categories")}
        </Box>
      </nav>
      {/* Main */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* Left column */}
          <Grid size={{ xs: 12, lg: 8 }}>
            {/* Image + basic info */}
            <PlacesCardForBooking bookingPlaceDetails={placeProps} />

            {/* Booking Information */}
            <Card sx={{ mb: 3 }}>
              <CardHeader title="Booking Information" />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 8 }}>
                    <Typography variant="body2" color="text.secondary">
                      data id
                    </Typography>
                    <Typography fontWeight={700}>#{data?.id}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      status
                    </Typography>
                    <Chip
                      label={data?.status}
                      variant="outlined"
                      size="small"
                      sx={{
                        mt: 0.5,
                        fontWeight: 600,
                        color: sx.color,
                        backgroundColor: sx.bg,
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Category
                    </Typography>
                    <Typography fontWeight={700}>
                      {data?.category_title}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Amount
                    </Typography>
                    <Typography fontWeight={800}>{data?.total} $</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Booking Details (dates) */}
            <Card>
              <CardHeader
                title={
                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarMonthIcon fontSize="small" />
                    <Typography variant="h6">Booking Details</Typography>
                  </Box>
                }
              />
              <CardContent>
                <Typography fontWeight={700} gutterBottom>
                  {data?.place_title}
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Start Date
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                      <CalendarMonthIcon fontSize="small" color="action" />
                      <Typography>{data?.starting_date}</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      End Date
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                      <CalendarMonthIcon fontSize="small" color="action" />
                      <Typography>{data?.ending_date}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Right column */}
          <Grid size={{ xs: 12, lg: 4 }}>
            {/* Contact */}
            <Card sx={{ mb: 3 }}>
              <CardHeader
                title={
                  <Box display="flex" alignItems="center" gap={1}>
                    <PersonIcon fontSize="small" />
                    <Typography variant="h6">Contact Details</Typography>
                  </Box>
                }
              />
              <CardContent>
                <Typography fontWeight={700}>{data?.name}</Typography>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  mt={1}
                  color="text.secondary"
                >
                  <PhoneIphoneIcon fontSize="small" />
                  <Typography variant="body2">+963 {data?.phone}</Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Payment */}
            <Card>
              <CardHeader
                title={
                  <Box display="flex" alignItems="center" gap={1}>
                    <CreditCardIcon fontSize="small" />
                    <Typography variant="h6">Payment Details</Typography>
                  </Box>
                }
              />
              <CardContent>
                <Box display="grid" gap={1.2}>
                  <Row
                    label="Payment Method"
                    value={data?.payment_method ?? "payment not found"}
                  />
                  <Row
                    label="Transaction ID"
                    value={data?.transaction_id ?? "transaction_id not found"}
                    mono
                  />
                  <Row
                    label="Reference ID"
                    value={data?.reference_id ?? "reference_id not found"}
                    mono
                  />
                  <Row
                    label="Invoice Reference"
                    value={
                      data?.invoice_reference ?? "invoice_reference not found"
                    }
                    mono
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box display="grid" gap={1.2}>
                  <Row
                    label="Booking Amount"
                    value={`${data?.total_price} $`}
                  />
                  <Row label="Discount" value={`${data?.discount} $`} />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="subtitle1" fontWeight={800}>
                    Total
                  </Typography>
                  <Typography variant="h6" fontWeight={900}>
                    {data?.total} $
                  </Typography>
                </Box>
              </CardContent>
              {data?.status === "placed" && (
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    color="error"
                    variant="contained"
                    onClick={() => setShowCancel((s) => !s)}
                  >
                    Cancel Booking
                  </Button>
                </CardActions>
              )}
            </Card>

            {/* Status helper */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Your booking is currently
                  <Box component="span" fontWeight={700}>
                    {` ${data?.status.toLowerCase()}`}
                  </Box>
                  . You will receive a confirmation once it's processed.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Simple “modal” imitation */}
      {showCancel && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
            zIndex: (t) => t.zIndex.modal,
          }}
          onClick={() => setShowCancel(false)}
        >
          <Card
            sx={{ maxWidth: 420, width: "100%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader
              title={
                <Typography color="error" fontWeight={800}>
                  Cancel Booking
                </Typography>
              }
            />
            <CardContent>
              <Typography color="text.secondary" mb={2}>
                Are you sure you want to cancel this booking? This action cannot
                be undone.
              </Typography>
              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setShowCancel(false)}
                >
                  Keep Booking
                </Button>
                <Button
                  color="error"
                  variant="contained"
                  fullWidth
                  onClick={() => {
                    if (!data?.id) return;
                    // هذا المهم: نمرر الجسم { status: "canceled" }
                    cancelBooking({ status: "canceled" });
                    setShowCancel(false);
                  }}
                >
                  Cancel Booking
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
}

/** Small helper to render label/value rows */
function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontFamily: mono
            ? "ui-monospace, SFMono-Regular, Menlo, monospace"
            : undefined,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}
