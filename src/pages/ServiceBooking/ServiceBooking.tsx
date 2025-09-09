import { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate, useParams } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useGetDataTimesForOneService } from "../../hook/useGetDataTimesForOneService";
import { useGetOneServiceDetails } from "../../hook/useGetOneServiceDetails";
import { formatSlotLabel } from "../../utils/format";
import { useTranslation } from "react-i18next";

export default function ServiceBooking() {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [address, setAddress] = useState("");
  const { id } = useParams();
  const { data } = useGetDataTimesForOneService(Number(id));
  const { data: serviceDetail } = useGetOneServiceDetails(Number(id));

  const navigate = useNavigate();

  const enabledDays = useMemo(() => new Set(Object.keys(data ?? {})), [data]);

  const timeOptions = useMemo(() => {
    if (!selectedDate || !data) return [];
    const ymd = format(selectedDate, "yyyy-MM-dd");
    const ranges: [string, string][] = data[ymd] ?? [];
    return ranges.map(([start, end]) => ({
      value: ` ${start}|${end}`,
      label: formatSlotLabel(start, end), // "03:00 PM - 04:00 PM"
    }));
  }, [selectedDate, data]);

  const isFormValid = Boolean(selectedDate && selectedTime && address.trim());

  const goToCheckout = () => {
    localStorage.setItem("selectedDate", String(selectedDate));
    localStorage.setItem("selectedTime", String(selectedTime));
    localStorage.setItem("address", String(address));
    localStorage.setItem("totalServicePrice", String(serviceDetail?.price));
    navigate(`/services/book/${id}/checkout`);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc, #eef2f6)",
      }}
    >
      <Box
        sx={{
          direction: "ltr",
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 2,
          bgcolor: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(6px)",
          borderBottom: 1,
          borderColor: "divider",
          boxShadow: 1,
        }}
      >
        <IconButton onClick={() => navigate(-1)} size="small">
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <Typography variant="h6" fontWeight={700} color="text.primary">
          {t("book your services")}
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
        <Grid container spacing={1}>
          {/* Booking Date */}
          <Grid xs={12} lg={6} container>
            <Card
              variant="outlined"
              sx={{
                m: "10px",
                width: "100%",
                border: 0,
                boxShadow: 6,
                bgcolor: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(6px)",
                transition: (t) => t.transitions.create("box-shadow"),
                "&:hover": { boxShadow: 10 },
              }}
            >
              <CardHeader
                sx={{ pb: 1.5 }}
                title={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{ p: 1, bgcolor: "primary.light", borderRadius: 2 }}
                    >
                      <CalendarMonthIcon
                        sx={{ color: "primary.main", fontSize: 20 }}
                      />
                    </Box>
                    <Typography variant="h6" fontWeight={700}>
                      {t("booking date")}
                    </Typography>
                  </Box>
                }
                subheader={
                  <Typography variant="body2" color="text.secondary">
                    {t("choose your favorite Date")}
                  </Typography>
                }
              />
              <CardContent sx={{ display: "grid", gap: 1.5 }}>
                <Typography variant="body2" fontWeight={600}>
                  {t("choose a date")}
                  <Box component="span" sx={{ color: "error.main" }}>
                    *
                  </Box>
                </Typography>

                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={ar}
                >
                  <DatePicker
                    value={selectedDate}
                    onChange={(newValue) => {
                      setSelectedDate(newValue);
                      setSelectedTime("");
                    }}
                    format="dd/MM/yyyy"
                    slotProps={{
                      field: {
                        clearable: true,
                        onClear: () => setSelectedDate(null),
                      },
                      textField: {
                        fullWidth: true,
                      },
                      popper: { placement: "bottom-end" },
                    }}
                    shouldDisableDate={(day) => {
                      const ymd = format(day as Date, "yyyy-MM-dd");
                      return !enabledDays.has(ymd);
                    }}
                    disablePast
                    closeOnSelect
                    reduceAnimations
                  />
                </LocalizationProvider>
              </CardContent>
            </Card>
          </Grid>

          {/* Booking Time */}
          <Grid xs={12} lg={6} container>
            <Card
              variant="outlined"
              sx={{
                m: "10px",
                width: "100%",
                border: 0,
                boxShadow: 6,
                bgcolor: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(6px)",
                transition: (t) => t.transitions.create("box-shadow"),
                "&:hover": { boxShadow: 10 },
              }}
            >
              <CardHeader
                sx={{ pb: 1.5 }}
                title={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        bgcolor: selectedDate
                          ? "success.light"
                          : "action.hover",
                      }}
                    >
                      <AccessTimeIcon
                        sx={{
                          color: selectedDate
                            ? "success.main"
                            : "text.disabled",
                          fontSize: 20,
                        }}
                      />
                    </Box>
                    <Typography variant="h6" fontWeight={700}>
                      {t("Resrvation Time")}
                    </Typography>
                  </Box>
                }
                subheader={
                  <Typography variant="body2" color="text.secondary">
                    {t("choose your convenient time")}
                  </Typography>
                }
              />
              <CardContent sx={{ display: "grid", gap: 1.5 }}>
                <Typography variant="body2" fontWeight={600}>
                  {t("choose the time")}
                  <Box component="span" sx={{ color: "error.main" }}>
                    *
                  </Box>
                </Typography>

                {!selectedDate ? (
                  <Box
                    sx={{
                      p: 3,
                      textAlign: "center",
                      bgcolor: "action.hover",
                      borderRadius: 3,
                      border: "2px dashed",
                      borderColor: "divider",
                    }}
                  >
                    <AccessTimeIcon
                      sx={{ fontSize: 36, color: "text.disabled", mb: 1 }}
                    />
                    <Typography fontWeight={600} color="text.secondary">
                      {t("select the date first")}
                    </Typography>
                    <Typography variant="body2" color="text.disabled">
                      {t("time will show after selecting the date")}{" "}
                    </Typography>
                  </Box>
                ) : (
                  <TextField
                    select
                    fullWidth
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    placeholder={t("select the time period")}
                    InputProps={{
                      endAdornment: selectedTime ? (
                        <InputAdornment position="end">
                          <CheckCircleIcon color="success" fontSize="small" />
                        </InputAdornment>
                      ) : undefined,
                    }}
                  >
                    {timeOptions.length === 0 ? (
                      <MenuItem disabled>{t("No times available")}</MenuItem>
                    ) : (
                      timeOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))
                    )}
                  </TextField>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Service Address */}
          <Grid xs={12} container>
            <Card
              variant="outlined"
              sx={{
                m: "10px",
                width: "100%",
                border: 0,
                boxShadow: 6,
                bgcolor: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(6px)",
                transition: (t) => t.transitions.create("box-shadow"),
                "&:hover": { boxShadow: 10 },
              }}
            >
              <CardHeader
                sx={{ pb: 1.5 }}
                title={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        bgcolor: address ? "secondary.light" : "action.hover",
                      }}
                    >
                      <PlaceIcon
                        sx={{
                          color: address ? "secondary.main" : "text.disabled",
                          fontSize: 20,
                        }}
                      />
                    </Box>
                    <Typography variant="h6" fontWeight={700}>
                      {t("Service Title")}
                    </Typography>
                  </Box>
                }
              />
              <CardContent sx={{ display: "grid", gap: 1.5 }}>
                <Typography variant="body2" fontWeight={600}>
                  {t("Enter your address")}{" "}
                  <Box component="span" sx={{ color: "error.main" }}>
                    *
                  </Box>
                </Typography>

                <TextField
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={t("Enter your address")}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {address ? (
                          <CheckCircleIcon color="success" fontSize="small" />
                        ) : (
                          <PlaceIcon
                            sx={{ color: "text.disabled" }}
                            fontSize="small"
                          />
                        )}
                      </InputAdornment>
                    ),
                  }}
                />

                {address && (
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "primary.50",
                      borderRadius: 3,
                      border: 1,
                      borderColor: "primary.200",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.5,
                      }}
                    >
                      <PlaceIcon
                        sx={{ color: "primary.main", fontSize: 18, mt: "2px" }}
                      />
                      <Typography variant="body2" color="primary.dark">
                        Abodabi . khalifa Street , 2990
                      </Typography>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Totals + CTA */}
        <Box sx={{ maxWidth: "100%", mx: "auto", display: "grid", gap: 2.5 }}>
          <Card
            elevation={8}
            sx={{
              color: "common.white",
              backgroundImage: "linear-gradient(90deg, #0b1220, #141b2f)",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.7)" }}
                    fontWeight={600}
                  >
                    {t("Total")}
                  </Typography>
                  <Typography variant="h5" fontWeight={800}>
                    {selectedTime
                      ? serviceDetail?.price.toFixed(3)
                      : Number(0).toFixed(3)}{" "}
                    KD
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    {t("Service fee included")}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Button
            fullWidth
            size="large"
            disabled={!isFormValid}
            onClick={goToCheckout}
            sx={{
              height: 56,
              fontSize: 18,
              fontWeight: 800,
              borderRadius: 3,
              color: isFormValid ? "common.white" : "text.disabled",
              backgroundImage: isFormValid
                ? "linear-gradient(90deg, #2563eb, #1d4ed8)"
                : "none",
              bgcolor: isFormValid
                ? "transparent"
                : "action.disabledBackground",
              boxShadow: isFormValid ? 6 : "none",
              transition: (t) =>
                t.transitions.create(
                  ["transform", "box-shadow", "background-color"],
                  { duration: t.transitions.duration.short }
                ),
              "&:hover": {
                transform: isFormValid ? "translateY(-2px)" : "none",
                boxShadow: isFormValid ? 10 : "none",
                backgroundImage: isFormValid
                  ? "linear-gradient(90deg, #1d4ed8, #1e40af)"
                  : "none",
              },
            }}
          >
            {isFormValid ? "Continue to payment" : "Fill all fields"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
