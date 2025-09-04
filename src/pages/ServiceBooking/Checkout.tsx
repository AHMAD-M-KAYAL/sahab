import { useState } from "react";
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
import Grid from "@mui/material/GridLegacy";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import { useNavigate } from "react-router-dom";

type PaymentId = "knet" | "mastercard" | "visa" | "applepay" | "googlepay";

export default function ServiceBookingCheckout() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentId>("mastercard");
  const [discount, setDiscount] = useState(0);

  const navigate = useNavigate();

  const bookingAmount = 30.0;
  const total = bookingAmount - discount;

  const handleApplyPromo = () => {
    if (promoCode.trim().toLowerCase() === "save10") setDiscount(3.0);
    else setDiscount(0);
  };

  const paymentMethods: Array<{ id: PaymentId; name: string; icon: "card" | "phone" }> = [
    { id: "knet", name: "Knet", icon: "card" },
    { id: "mastercard", name: "Master Card", icon: "card" },
    { id: "visa", name: "Visa", icon: "card" },
  ];

  const canPay = Boolean(name.trim() && phone.trim());

  return (
    <Box sx={{ minHeight: "100vh", background: (t) => `linear-gradient(135deg, ${t.palette.action.hover}, ${t.palette.action.selected})` }}>
      {/* Header */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 2,
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
          backdropFilter: "blur(6px)",
          boxShadow: 1,
        }}
      >
        <IconButton onClick={()=> navigate(-1)} size="small">
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <Typography variant="h6" fontWeight={700}>
          Checkout
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
        <Grid container sx={{ mb: 3 }}>
          {/* Contact Details */}
          <Grid xs={12} lg={6} container>
            <Card
              variant="outlined"
              sx={{ width: '100%', m:"10px", border: 0, boxShadow: 6, bgcolor: "rgba(255,255,255,0.8)", backdropFilter: "blur(6px)" }}
            >
              <CardHeader title={<Typography variant="h6" fontWeight={700}>Contact Details</Typography>} />
              <CardContent sx={{ display: "grid", gap: 2 }}>
                <Box>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                    Name <Box component="span" sx={{ color: "error.main", ml: 0.5 }}>*</Box>
                  </Typography>
                  <TextField
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter Here"
                    fullWidth
                    size="medium"
                  />
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                    Phone Number <Box component="span" sx={{ color: "error.main", ml: 0.5 }}>*</Box>
                  </Typography>
                  <TextField
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter Here"
                    fullWidth
                    size="medium"
                    inputProps={{ inputMode: "tel" }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Booking Details */}
          <Grid xs={12} lg={6} container>
            <Card
              variant="outlined"
              sx={{ width: '100%', m:"10px", border: 0, boxShadow: 6, bgcolor: "rgba(255,255,255,0.8)", backdropFilter: "blur(6px)" }}
            >
              <CardHeader
                title={
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="h6" fontWeight={700}>Booking Details</Typography>
                    <IconButton onClick={()=> navigate(-1)} size="small">
                      <EditOutlinedIcon fontSize="small" color="action" />
                    </IconButton>
                  </Box>
                }
              />
              <CardContent sx={{ display: "grid", gap: 2 }}>
                <Typography fontWeight={600}>Service Title</Typography>

                <Box sx={{ display: "grid", gap: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5, bgcolor: "action.hover", borderRadius: 2 }}>
                    <Box sx={{ p: 1, bgcolor: "primary.50", borderRadius: 2 }}>
                      <CalendarMonthIcon color="primary" sx={{ fontSize: 18 }} />
                    </Box>
                    <Typography variant="body2">Booking Date : 30/10/2023</Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5, bgcolor: "action.hover", borderRadius: 2 }}>
                    <Box sx={{ p: 1, bgcolor: "secondary.50", borderRadius: 2 }}>
                      <AccessTimeIcon color="secondary" sx={{ fontSize: 18 }} />
                    </Box>
                    <Typography variant="body2">Booking Duration : 06:30PM - 07:00PM</Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, p: 1.5, bgcolor: "action.hover", borderRadius: 2 }}>
                    <Box sx={{ p: 1, bgcolor: "info.50", borderRadius: 2 }}>
                      <PlaceIcon color="info" sx={{ fontSize: 18 }} />
                    </Box>
                    <Typography variant="body2">
                      Address : Muntazah Al Khairan road 278 zone 3, An Nami, Al Khiran, Kuwait
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Promo Code */}
        <Box sx={{ mb: 3 }}>
          <Card
            variant="outlined"
            sx={{ border: 0, boxShadow: 6, bgcolor: "rgba(255,255,255,0.8)", backdropFilter: "blur(6px)" }}
          >
            <CardHeader title={<Typography variant="h6" fontWeight={700}>Promo Code</Typography>} />
            <CardContent>
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                <TextField
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter Promo code Here"
                  fullWidth
                  size="medium"
                />
                <Button onClick={handleApplyPromo} variant="contained" sx={{ height: 48, px: 3, fontWeight: 700 }}>
                  Apply
                </Button>
              </Box>
              {discount > 0 && (
                <Typography variant="body2" color="primary" sx={{ mt: 1.25 }} fontWeight={600}>
                  Promo code applied! You saved {discount.toFixed(3)} KD
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>

        <Grid container sx={{ mb: 3 }}>
          {/* Payment Method (spans 2 columns on lg) */}
          <Grid xs={12} lg={8} container>
            <Card
              variant="outlined"
              sx={{ width: '100%', m:"10px", height: "100%", border: 0, boxShadow: 6, bgcolor: "rgba(255,255,255,0.8)", backdropFilter: "blur(6px)" }}
            >
              <CardHeader title={<Typography variant="h6" fontWeight={700}>Payment Method</Typography>} />
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
                          transition: (t) => t.transitions.create(["border-color", "background-color"]),
                          bgcolor: selected ? "action.selected" : "transparent",
                          "&:hover": { bgcolor: selected ? "action.selected" : "action.hover" },
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
          <Grid xs={12} lg={4} container>
            <Card
              variant="outlined"
              sx={{ width: '100%', m:"10px", height: "100%", border: 0, boxShadow: 6, bgcolor: "rgba(255,255,255,0.8)", backdropFilter: "blur(6px)" }}
            >
              <CardHeader title={<Typography variant="h6" fontWeight={700}>Payment Details</Typography>} />
              <CardContent sx={{ display: "grid", gap: 1.25 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography>Booking Amount</Typography>
                  <Typography fontWeight={600}>{bookingAmount.toFixed(3)} KD</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography>Discount</Typography>
                  <Typography fontWeight={600}>{discount.toFixed(3)} KD</Typography>
                </Box>
                <Divider sx={{ my: 1.25 }} />
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="h6" fontWeight={800} color="primary">Total</Typography>
                  <Typography variant="h6" fontWeight={800} color="primary">{total.toFixed(3)} KD</Typography>
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
            sx={{
              height: 56,
              fontSize: 18,
              fontWeight: 800,
              borderRadius: 3,
              color: canPay ? "common.white" : "text.disabled",
              backgroundImage: canPay ? "linear-gradient(90deg, #2563eb, #1d4ed8)" : "none",
              bgcolor: canPay ? "transparent" : "action.disabledBackground",
              boxShadow: canPay ? 6 : "none",
              transition: (t) =>
                t.transitions.create(["transform", "box-shadow", "background-color"], {
                  duration: t.transitions.duration.shortest,
                }),
              "&:hover": {
                transform: canPay ? "translateY(-2px)" : "none",
                boxShadow: canPay ? 10 : "none",
                backgroundImage: canPay ? "linear-gradient(90deg, #1d4ed8, #1e40af)" : "none",
              },
            }}
          >
            Proceed to payment
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
