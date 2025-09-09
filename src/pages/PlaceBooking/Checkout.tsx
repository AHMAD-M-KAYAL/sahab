import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAddPlaceBooking,
  type CreateBookingRequest,
} from "../../hook/useAddPlaceBooking";
import { localDateOnly } from "../../utils/format";
import { useTranslation } from "react-i18next";
import IconBack from "../../assets/logo/back.svg";

type PaymentMethod = "knet" | "visa" | "googlepay" | "applepay";

export default function PlaceBookingCheckout() {
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("knet");
  const [contactDetails, setContactDetails] = useState({
    name: localStorage.getItem("userName"),
    phone: localStorage.getItem("userPhone"),
  });
  const token = localStorage.getItem("token");
  const { mutate, isPending } = useAddPlaceBooking(String(token));

  const handlePaymentChange = (
    _e: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    setPaymentMethod(value as PaymentMethod);
  };

  const navigate = useNavigate();
  const { id } = useParams();

  const startDate = localStorage.getItem("startDate");
  const endDate = localStorage.getItem("endDate");
  const nights = localStorage.getItem("nights");
  const totalPrice = localStorage.getItem("totalPrice");

  const handleBooking = async () => {
    const body: CreateBookingRequest = {
      code: null,
      starting_date: localDateOnly(new Date(startDate!)),
      ending_date: localDateOnly(new Date(endDate!)),
      payment_method: paymentMethod,
      place_id: Number(id),
      total_price: totalPrice!,
    };
    mutate(body);
  };

  return (
    <>
      {" "}
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
        ></Box>
      </nav>
      <Box dir="rtl" sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, md: 4 } }}>
          {/* Header */}
          <Box
            sx={{
              mb: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <IconButton
                onClick={() => {
                  navigate(-1);
                }}
                size="small"
              >
                <ChevronRightIcon />
              </IconButton>
              <Typography variant="h4" fontWeight={700}>
                {t("payment")}
              </Typography>
            </Box>
          </Box>

          <Grid container>
            {/* Main content */}
            <Grid size={{ xs: 12, md: 7.5 }} sx={{ display: "grid", gap: 2 }}>
              {/* Contact Details */}
              <Card variant="outlined">
                <CardHeader
                  title={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <InfoOutlinedIcon fontSize="small" />
                      <Typography variant="h6" fontWeight={700}>
                        {t("contactDetails")}
                      </Typography>
                    </Box>
                  }
                />
                <CardContent sx={{ display: "grid", gap: 2 }}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      {t("name")}
                    </Typography>
                    <TextField
                      id="name"
                      value={contactDetails.name}
                      onChange={(e) =>
                        setContactDetails((p) => ({
                          ...p,
                          name: e.target.value,
                        }))
                      }
                      placeholder={t("name")}
                      fullWidth
                      size="medium"
                    />
                  </Box>

                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      {t("phone number")}
                    </Typography>
                    <TextField
                      id="phone"
                      value={contactDetails.phone}
                      onChange={(e) =>
                        setContactDetails((p) => ({
                          ...p,
                          phone: e.target.value,
                        }))
                      }
                      placeholder={t("phone number")}
                      fullWidth
                      size="medium"
                      inputProps={{ inputMode: "tel" }}
                    />
                  </Box>
                </CardContent>
              </Card>

              {/* Booking Details */}
              <Card variant="outlined">
                <CardHeader
                  title={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CalendarMonthIcon fontSize="small" />
                      <Typography variant="h6" fontWeight={700}>
                        {t("Booking Details")}
                      </Typography>
                    </Box>
                  }
                />
                <CardContent sx={{ display: "grid", gap: 2 }}>
                  <Grid container>
                    <Grid size={{ xs: 12, md: 5.5 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          p: 1.5,
                          bgcolor: "action.hover",
                          borderRadius: 2,
                        }}
                      >
                        <CalendarMonthIcon color="primary" fontSize="small" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {t("starting Date")}
                          </Typography>
                          <Typography fontWeight={700}>
                            {new Date(startDate!).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 1 }}></Grid>
                    <Grid size={{ xs: 12, md: 5.5 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          p: 1.5,
                          bgcolor: "action.hover",
                          borderRadius: 2,
                        }}
                      >
                        <CalendarMonthIcon color="primary" fontSize="small" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {t("ending Date")}
                          </Typography>
                          <Typography fontWeight={700}>
                            {new Date(endDate!).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid size={{ xs: 5.5 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "start",
                          gap: 2,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {t("number of nights")}
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {nights}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 1 }}></Grid>
                    <Grid size={{ xs: 5.5 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "start",
                          gap: 2,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          عدد الضيوف:
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          1
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card variant="outlined">
                <CardHeader
                  title={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CreditCardIcon fontSize="small" />
                      <Typography variant="h6" fontWeight={700}>
                        {t("payment method")}{" "}
                      </Typography>
                    </Box>
                  }
                />
                <CardContent>
                  <RadioGroup
                    value={paymentMethod}
                    onChange={handlePaymentChange}
                    sx={{ display: "grid", gap: 1.5 }}
                  >
                    {(
                      [
                        { value: "knet", label: "KNET" },
                        { value: "visa", label: "VISA/MASTER" },
                      ] as const
                    ).map(({ value, label }) => {
                      const selected = paymentMethod === value;
                      return (
                        <Box
                          key={value}
                          onClick={() => setPaymentMethod(value)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            p: 2,
                            border: 1,
                            borderRadius: 2,
                            cursor: "pointer",
                            borderColor: selected ? "primary.main" : "divider",
                            bgcolor: selected
                              ? "action.selected"
                              : "transparent",
                            transition: (t) =>
                              t.transitions.create(
                                ["background-color", "border-color"],
                                { duration: t.transitions.duration.shortest }
                              ),
                            "&:hover": {
                              bgcolor: selected
                                ? "action.selected"
                                : "action.hover",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            <Radio checked={selected} value={value} />
                            <Typography fontWeight={600}>{label}</Typography>
                          </Box>
                          <InfoOutlinedIcon fontSize="small" color="action" />
                        </Box>
                      );
                    })}
                  </RadioGroup>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 0.5 }}></Grid>
            {/* Sidebar - Payment Summary */}
            <Grid size={{ xs: 12, lg: 4 }} sx={{ display: "grid", gap: 2 }}>
              <Card variant="outlined">
                <CardHeader
                  title={
                    <Typography variant="h6" fontWeight={700}>
                      {t("payment details")}
                    </Typography>
                  }
                />
                <CardContent sx={{ display: "grid", gap: 2 }}>
                  <Box sx={{ display: "grid", gap: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography>{t("Register price")}</Typography>
                      <Typography fontWeight={600}>
                        $ {Number(totalPrice).toFixed(3)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography>{t("Discount")}</Typography>
                      <Typography fontWeight={600}>
                        $ {Number(0).toFixed(3)}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 1.5 }} />
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="h6" fontWeight={800} color="primary">
                        {t("Total")}
                      </Typography>
                      <Typography variant="h5" fontWeight={800} color="primary">
                        $ {Number(totalPrice).toFixed(3)}
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    onClick={handleBooking}
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={
                      !contactDetails.name?.trim() ||
                      !contactDetails.phone?.trim()
                    }
                    sx={{ mt: 1.5, py: 1.5, fontSize: 16, fontWeight: 700 }}
                    loading={isPending}
                  >
                    {t("continue to payment")}
                  </Button>
                </CardContent>
              </Card>

              {/* Additional Info */}
              <Card variant="outlined">
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{ mb: 1.5 }}
                  >
                    {t("important information")}
                  </Typography>
                  <Box sx={{ display: "grid", gap: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      please make sure of your information
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      we will send you a sms
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      you can cancel your reservation before 24 H{" "}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}
