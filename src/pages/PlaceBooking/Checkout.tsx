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
import Grid from "@mui/material/GridLegacy";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useNavigate } from "react-router-dom";

type PaymentMethod = "knet" | "visa" | "googlepay" | "applepay";

export default function PlaceBookingCheckout() {
  const [promoCode, setPromoCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("knet");
  const [contactDetails, setContactDetails] = useState({ name: "", phone: "" });

  const bookingDetails = {
    startDate: "2025/08/31",
    endDate: "2025/08/31",
    nights: 1,
    guests: 1,
    baseAmount: 0.0,
    discount: 0.0,
    total: 0.0,
  };

  const handlePaymentChange = (_e: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setPaymentMethod(value as PaymentMethod);
  };

  const navigate = useNavigate();
  
  return (
    <Box dir="rtl" sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <IconButton onClick={()=> {navigate(-1)}} size="small">
              <ChevronRightIcon />
            </IconButton>
            <Typography variant="h4" fontWeight={700}>
              الدفع
            </Typography>
          </Box>
        </Box>

        <Grid container>
          {/* Main content */}
          <Grid xs={12} lg={7.5} sx={{ display: "grid", gap: 2 }}>
            {/* Contact Details */}
            <Card variant="outlined">
              <CardHeader
                title={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <InfoOutlinedIcon fontSize="small" />
                    <Typography variant="h6" fontWeight={700}>تفاصيل الاتصال</Typography>
                  </Box>
                }
              />
              <CardContent sx={{ display: "grid", gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    الاسم *
                  </Typography>
                  <TextField
                    id="name"
                    value={contactDetails.name}
                    onChange={(e) => setContactDetails((p) => ({ ...p, name: e.target.value }))}
                    placeholder="أدخل اسمك"
                    fullWidth
                    size="medium"
                  />
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    رقم الهاتف *
                  </Typography>
                  <TextField
                    id="phone"
                    value={contactDetails.phone}
                    onChange={(e) => setContactDetails((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="أدخل رقم الهاتف"
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
                    <Typography variant="h6" fontWeight={700}>تفاصيل الحجز</Typography>
                  </Box>
                }
              />
              <CardContent sx={{ display: "grid", gap: 2 }}>
                <Grid container>
                  <Grid xs={12} md={5.5}>
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
                          تاريخ البدء
                        </Typography>
                        <Typography fontWeight={700}>{bookingDetails.startDate}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid xs={1}></Grid>
                  <Grid xs={12} md={5.5}>
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
                          تاريخ الانتهاء
                        </Typography>
                        <Typography fontWeight={700}>{bookingDetails.endDate}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                <Grid container>
                  <Grid xs={5.5}>
                    <Box sx={{ display: "flex", justifyContent: "start", gap:2 }}>
                      <Typography variant="body2" color="text.secondary">عدد الليالي:</Typography>
                      <Typography variant="body2" fontWeight={600}>{bookingDetails.nights}</Typography>
                    </Box>
                  </Grid>
                  <Grid xs={1}></Grid>
                  <Grid xs={5.5}>
                    <Box sx={{ display: "flex", justifyContent: "start", gap:2 }}>
                      <Typography variant="body2" color="text.secondary">عدد الضيوف:</Typography>
                      <Typography variant="body2" fontWeight={600}>{bookingDetails.guests}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Promotional Code */}
            <Card variant="outlined">
              <CardHeader
                title={<Typography variant="h6" fontWeight={700}>الرمز الترويجي</Typography>}
              />
              <CardContent>
                <Box sx={{ display: "flex", gap: 1.5 }}>
                  <TextField
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="أدخل الرمز الترويجي هنا"
                    fullWidth
                  />
                  <Button variant="contained" disabled={!promoCode.trim()} sx={{ px: 4 }}>
                    تطبيق
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card variant="outlined">
              <CardHeader
                title={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CreditCardIcon fontSize="small" />
                    <Typography variant="h6" fontWeight={700}>طريقة الدفع</Typography>
                  </Box>
                }
              />
              <CardContent>
                <RadioGroup value={paymentMethod} onChange={handlePaymentChange} sx={{ display: "grid", gap: 1.5 }}>
                  {([
                    { value: "knet", label: "KNET" },
                    { value: "visa", label: "VISA/MASTER" },
                    { value: "googlepay", label: "GooglePay" },
                    { value: "applepay", label: "Apple Pay" },
                  ] as const).map(({ value, label }) => {
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
                          bgcolor: selected ? "action.selected" : "transparent",
                          transition: (t) => t.transitions.create(["background-color", "border-color"], { duration: t.transitions.duration.shortest }),
                          "&:hover": { bgcolor: selected ? "action.selected" : "action.hover" },
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
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
          <Grid xs={0.5}></Grid>
          {/* Sidebar - Payment Summary */}
          <Grid xs={12} lg={4} sx={{ display: "grid", gap: 2 }}>
            <Card
              variant="outlined"
            >
              <CardHeader
                title={<Typography variant="h6" fontWeight={700}>تفاصيل الدفع</Typography>}
              />
              <CardContent sx={{ display: "grid", gap: 2 }}>
                <Box sx={{ display: "grid", gap: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography>مبلغ الحجز</Typography>
                    <Typography fontWeight={600}>KD {bookingDetails.baseAmount.toFixed(3)}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography>الخصم</Typography>
                    <Typography fontWeight={600}>KD {bookingDetails.discount.toFixed(3)}</Typography>
                  </Box>
                  <Divider sx={{ my: 1.5 }} />
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="h6" fontWeight={800} color="primary">الإجمالي</Typography>
                    <Typography variant="h5" fontWeight={800} color="primary">KD {bookingDetails.total.toFixed(3)}</Typography>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={!contactDetails.name.trim() || !contactDetails.phone.trim()}
                  sx={{ mt: 1.5, py: 1.5, fontSize: 16, fontWeight: 700 }}
                >
                  المتابعة للدفع
                </Button>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card variant="outlined">
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
                  معلومات مهمة
                </Typography>
                <Box sx={{ display: "grid", gap: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">• يرجى التأكد من صحة البيانات المدخلة</Typography>
                  <Typography variant="body2" color="text.secondary">• سيتم إرسال تأكيد الحجز عبر الرسائل النصية</Typography>
                  <Typography variant="body2" color="text.secondary">• يمكن إلغاء الحجز قبل 24 ساعة من الموعد</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
