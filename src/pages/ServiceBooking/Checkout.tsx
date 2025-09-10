import { useState } from "react";
import IconBack from "../../assets/logo/back.svg";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  TextField,
  Typography,
  Divider,
  RadioGroup,
  Radio,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import { useNavigate, useParams } from "react-router-dom";
import { formatTo12Hour, parseSlot } from "../../utils/format";
import {
  useAddServiceBooking,
  type CreateServiceBookingRequest,
} from "../../hook/useAddServiceBooking";
import { useTranslation } from "react-i18next";

type PaymentId = "knet" | "mastercard" | "visa" | "applepay" | "googlepay";

const readLS = (key: string): string | null => {
  const v = localStorage.getItem(key);
  if (v === null) return null;
  const trimmed = v.trim();
  return trimmed && trimmed !== "null" && trimmed !== "undefined"
    ? trimmed
    : null;
};

export default function ServiceBookingCheckout() {
  const { t } = useTranslation();
  const [name, setName] = useState(localStorage.getItem("userName"));
  const [phone, setPhone] = useState(localStorage.getItem("userPhone"));
  const [paymentMethod, setPaymentMethod] = useState<PaymentId>("mastercard");
  const token = localStorage.getItem("token");
  const { mutate, isPending } = useAddServiceBooking(String(token));

  const navigate = useNavigate();

  const paymentMethods: Array<{
    id: PaymentId;
    name: string;
    icon: "card" | "phone";
  }> = [
    { id: "knet", name: "Knet", icon: "card" },
    { id: "mastercard", name: "Master Card", icon: "card" },
    { id: "visa", name: "Visa", icon: "card" },
  ];

  const canPay = Boolean(name?.trim() && phone?.trim());

  const selectedSlotRaw = readLS("selectedTime") ?? readLS("selectedDate");
  const address = readLS("address") ?? "";
  const totalPriceNum = Number(readLS("totalServicePrice") ?? 0);
  const { id } = useParams();
  const serviceId = Number(id);

  const handleBooking = async () => {
    // basic validation (replace with your toast/snackbar)
    if (!selectedSlotRaw) {
      return;
    }
    if (!address.trim()) {
      return;
    }
    if (!serviceId || Number.isNaN(serviceId)) {
      return;
    }
    if (!totalPriceNum || Number.isNaN(totalPriceNum)) {
      return;
    }

    let slot;
    try {
      slot = parseSlot(selectedSlotRaw);
    } catch {
      return;
    }

    const body: CreateServiceBookingRequest = {
      code: null,
      date: slot.date, // "yyyy-MM-dd"
      starting_time: slot.startTime, // "HH:mm:ss"
      ending_time: slot.endTime, // "HH:mm:ss"
      address,
      payment_method: paymentMethod, // from your state
      service_id: serviceId,
      total_price: String(totalPriceNum),
    };

    mutate(body);
  };
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: (t) =>
          `linear-gradient(135deg, ${t.palette.action.hover}, ${t.palette.action.selected})`,
      }}
    >
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
        ></Box>
      </nav>
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
        <Grid container sx={{ mb: 3 }}>
          {/* Contact Details */}
          <Grid size={{ xs: 12, lg: 6 }} container>
            <Card
              variant="outlined"
              sx={{
                width: "100%",
                m: "10px",
                border: 0,
                boxShadow: 6,
                bgcolor: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(6px)",
                borderRadius: "7px",
              }}
            >
              <CardHeader
                title={
                  <Typography variant="h6" fontWeight={700}>
                    {t("contact Details")}
                  </Typography>
                }
              />
              <CardContent sx={{ display: "grid", gap: 2 }}>
                <Box>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                    {t("name")}
                    <Box component="span" sx={{ color: "error.main", ml: 0.5 }}>
                      *
                    </Box>
                  </Typography>
                  <TextField
                    id="name"
                    disabled
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("Enter your name")}
                    fullWidth
                    size="medium"
                  />
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                    {t("phone number")}{" "}
                    <Box component="span" sx={{ color: "error.main", ml: 0.5 }}>
                      *
                    </Box>
                  </Typography>
                  <TextField
                    id="phone"
                    disabled
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t("Enter your phone number")}
                    fullWidth
                    size="medium"
                    inputProps={{ inputMode: "tel" }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Booking Details */}
          <Grid size={{ xs: 12, lg: 6 }} container>
            <Card
              variant="outlined"
              sx={{
                width: "100%",
                m: "10px",
                border: 0,
                boxShadow: 6,
                bgcolor: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(6px)",
                borderRadius: "7px",
              }}
            >
              <CardHeader
                title={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="h6" fontWeight={700}>
                      {t("Booking Details")}
                    </Typography>
                    <IconButton onClick={() => navigate(-1)} size="small">
                      <EditOutlinedIcon fontSize="small" color="action" />
                    </IconButton>
                  </Box>
                }
              />
              <CardContent sx={{ display: "grid", gap: 2 }}>
                <Typography fontWeight={600}>{t("Service Title")}</Typography>

                <Box sx={{ display: "grid", gap: 1.5 }}>
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
                    <Box sx={{ p: 1, bgcolor: "primary.50", borderRadius: 2 }}>
                      <CalendarMonthIcon
                        color="primary"
                        sx={{ fontSize: 18 }}
                      />
                    </Box>
                    <Typography variant="body2">
                      {t("booking date")} :{" "}
                      {new Date(
                        parseSlot(selectedSlotRaw!).date
                      ).toLocaleDateString()}
                    </Typography>
                  </Box>

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
                    <Box
                      sx={{ p: 1, bgcolor: "secondary.50", borderRadius: 2 }}
                    >
                      <AccessTimeIcon color="secondary" sx={{ fontSize: 18 }} />
                    </Box>
                    <Typography variant="body2">
                      {t("booking duration")}:{" "}
                      {formatTo12Hour(parseSlot(selectedSlotRaw!).startTime)} -{" "}
                      {formatTo12Hour(parseSlot(selectedSlotRaw!).endTime)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1.5,
                      p: 1.5,
                      bgcolor: "action.hover",
                      borderRadius: 2,
                    }}
                  >
                    <Box sx={{ p: 1, bgcolor: "info.50", borderRadius: 2 }}>
                      <PlaceIcon color="info" sx={{ fontSize: 18 }} />
                    </Box>
                    <Typography variant="body2">
                      {t("address")} : {address}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container sx={{ mb: 3 }}>
          {/* Payment Method */}
          <Grid size={{ xs: 12, lg: 8 }} container>
            <Card
              variant="outlined"
              sx={{
                width: "100%",
                m: "10px",
                height: "100%",
                border: 0,
                boxShadow: 6,
                bgcolor: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(6px)",
                borderRadius: "7px",
              }}
            >
              <CardHeader
                title={
                  <Typography variant="h6" fontWeight={700}>
                    {t("payment method")}
                  </Typography>
                }
              />
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onChange={(_, v) => setPaymentMethod(v as PaymentId)}
                  sx={{ display: "grid", gap: 1.5 }}
                >
                  {paymentMethods.map((m) => {
                    const selected = paymentMethod === m.id;
                    return (
                      <Box
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          p: 2,
                          gap: 1.5,
                          borderRadius: 2,
                          border: 2,
                          borderColor: selected ? "primary.main" : "divider",
                          cursor: "pointer",
                          transition: (t) =>
                            t.transitions.create([
                              "border-color",
                              "background-color",
                            ]),
                          bgcolor: selected ? "action.selected" : "transparent",
                          "&:hover": {
                            bgcolor: selected
                              ? "action.selected"
                              : "action.hover",
                          },
                        }}
                      >
                        <Radio checked={selected} value={m.id} />
                        <Box
                          sx={{
                            width: 32,
                            height: 24,
                            borderRadius: 1,
                            bgcolor: "action.hover",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mr: 1,
                          }}
                        >
                          {m.icon === "card" ? (
                            <CreditCardIcon fontSize="small" />
                          ) : (
                            <SmartphoneIcon fontSize="small" />
                          )}
                        </Box>
                        <Typography fontWeight={600}>{m.name}</Typography>
                      </Box>
                    );
                  })}
                </RadioGroup>
              </CardContent>
            </Card>
          </Grid>

          {/* Payment Details */}
          <Grid size={{ xs: 12, lg: 4 }} container>
            <Card
              variant="outlined"
              sx={{
                width: "100%",
                m: "10px",
                height: "100%",
                border: 0,
                boxShadow: 6,
                bgcolor: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(6px)",
                borderRadius: "7px",
              }}
            >
              <CardHeader
                title={
                  <Typography variant="h6" fontWeight={700}>
                    {t("payment details")}
                  </Typography>
                }
              />
              <CardContent sx={{ display: "grid", gap: 1.25 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography> {t("Register price")}</Typography>
                  <Typography fontWeight={600}>
                    {Number(totalPriceNum).toFixed(3)} $
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
                    {Number(0).toFixed(3)} $
                  </Typography>
                </Box>
                <Divider sx={{ my: 1.25 }} />
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
                  <Typography variant="h6" fontWeight={800} color="primary">
                    {Number(totalPriceNum).toFixed(3)} $
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* CTA */}
        <Box sx={{ maxWidth: 480, mx: "auto" }}>
          <Button
            fullWidth
            size="large"
            disabled={!canPay}
            onClick={handleBooking}
            loading={isPending}
            sx={{
              height: 56,
              fontSize: 18,
              fontWeight: 800,
              borderRadius: 3,
              color: canPay ? "common.white" : "text.disabled",
              backgroundImage: canPay
                ? "linear-gradient(90deg, #2563eb, #1d4ed8)"
                : "none",
              bgcolor: canPay ? "transparent" : "action.disabledBackground",
              boxShadow: canPay ? 6 : "none",
              transition: (t) =>
                t.transitions.create(
                  ["transform", "box-shadow", "background-color"],
                  {
                    duration: t.transitions.duration.shortest,
                  }
                ),
              "&:hover": {
                transform: canPay ? "translateY(-2px)" : "none",
                boxShadow: canPay ? 10 : "none",
                backgroundImage: canPay
                  ? "linear-gradient(90deg, #1d4ed8, #1e40af)"
                  : "none",
              },
            }}
          >
            {t("book now")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
