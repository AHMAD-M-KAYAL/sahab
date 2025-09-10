/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import IconBack from "../../assets/logo/back.svg";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  Divider,
  Skeleton,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
} from "@mui/material";
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

/** خريطة الساعات: 'yyyy-MM-dd' -> مصفوفة فترات [start,end] */
type SlotsMap = Record<string, [string, string][]>;

export default function ServiceBooking() {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  const navigate = useNavigate();
  const { id } = useParams();

  // جلب الساعات والتفاصيل (مع حالات التحميل)
  const { data: timesData, isLoading: isLoadingTimes } =
    useGetDataTimesForOneService(Number(id));
  const { data: serviceDetail, isLoading: isLoadingService } =
    useGetOneServiceDetails(Number(id));

  const slotsMap = (timesData ?? {}) as SlotsMap;

  /** الأيام المفعّلة القادمة من API */
  const enabledDays = useMemo(() => new Set(Object.keys(slotsMap)), [slotsMap]);

  /** خيارات الوقت (Chips) لليوم المختار */
  const timeOptions = useMemo(() => {
    if (!selectedDate) return [] as { value: string; label: string }[];
    const ymd = format(selectedDate, "yyyy-MM-dd");
    const ranges: [string, string][] =
      (slotsMap as Record<string, [string, string][]>)[ymd] ?? [];
    return ranges.map(([start, end]) => ({
      value: `${start}|${end}`,
      label: formatSlotLabel(start, end),
    }));
  }, [selectedDate, slotsMap]);

  const selectedTimeLabel =
    timeOptions.find((o) => o.value === selectedTime)?.label ?? "";

  const isFormValid = Boolean(selectedDate && selectedTime && address.trim());

  const goToCheckout = () => {
    localStorage.setItem("selectedDate", String(selectedDate));
    localStorage.setItem("selectedTime", String(selectedTime));
    localStorage.setItem("address", String(address));
    localStorage.setItem(
      "totalServicePrice",
      String(serviceDetail?.price ?? 0)
    );
    navigate(`/services/book/${id}/checkout`);
  };

  /** تحديد الخطوة النشطة في الـ Stepper */
  let activeStep = 0;
  if (selectedDate) activeStep = 1;
  if (selectedDate && selectedTime) activeStep = 2;
  if (selectedDate && selectedTime && address.trim()) activeStep = 3;

  /** ستايل عام للكارد */
  const proCardSx = {
    position: "relative" as const,
    overflow: "hidden",
    border: "1px solid",
    borderColor: "divider",
    bgcolor: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(8px)",
    boxShadow: "0 10px 30px rgba(2,10,40,0.08)",
    transition: (t: any) =>
      t.transitions.create(["transform", "box-shadow"], {
        duration: t.transitions.duration.short,
      }),
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 16px 42px rgba(2,10,40,0.14)",
    },
    "&::after": {
      content: '""',
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background:
        "radial-gradient(80% 60% at -10% -20%, rgba(99,102,241,.09), transparent 50%), radial-gradient(70% 50% at 120% -10%, rgba(56,189,248,.08), transparent 50%)",
    },
  };

  /** حاوية لكل كارد: عرض شبه كامل + هوامش جانبية بسيطة + مسافة طولية */
  const sectionSx = {
    mx: "auto",
    maxWidth: "100%",
    px: { xs: 1.5, sm: 2.5 }, // مسافات جانبية بسيطة (12-20px)
    my: { xs: 1.5, md: 2.5 }, // مسافات طولية بين الكروت
  };

  const Header = ({
    icon,
    title,
    subtitle,
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
  }) => (
    <CardHeader
      sx={{ pb: 1.5 }}
      title={
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: "action.hover",
              boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04)",
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" fontWeight={800}>
            {title}
          </Typography>
        </Box>
      }
      subheader={
        subtitle ? (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        ) : undefined
      }
    />
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        overflowX: "hidden", // يمنع أي سكرول أفقي محتمل
        background:
          "linear-gradient(120deg, #f7f9fc 0%, #eef2f6 50%, #f8fafc 100%)",
      }}
    >
      {/*  navbar كما هو */}
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
            navigate("/home");
          }}
          sx={{
            width: "10%",
            backgroundColor: "white",
            "&:hover": { transform: "translateY(1px) scale(1.201)" },
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
        />
      </nav>

      {/* شريط خطوات  */}
      <Box sx={{ ...sectionSx, pt: 2 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          <Step completed={!!selectedDate}>
            <StepLabel>{t("booking date")}</StepLabel>
          </Step>
          <Step completed={!!selectedTime && !!selectedDate}>
            <StepLabel>{t("Resrvation Time")}</StepLabel>
          </Step>
          <Step completed={!!address && !!selectedTime && !!selectedDate}>
            <StepLabel>{t("Enter your address")}</StepLabel>
          </Step>
          <Step completed={isFormValid}>
            <StepLabel>{t("Review & Pay")}</StepLabel>
          </Step>
        </Stepper>
      </Box>

      {(isLoadingTimes || isLoadingService) && (
        <LinearProgress sx={{ my: 1, opacity: 0.6 }} />
      )}

      {/* بطاقة التاريخ */}
      <Box sx={sectionSx}>
        <Card
          variant="outlined"
          sx={{ ...proCardSx, width: "100%", borderRadius: 2 }}
        >
          <Header
            icon={
              <CalendarMonthIcon sx={{ color: "primary.main", fontSize: 22 }} />
            }
            title={t("booking date")}
            subtitle={t("choose your favorite Date")}
          />
          <CardContent sx={{ display: "grid", gap: 2 }}>
            <Typography variant="body2" fontWeight={800}>
              {t("choose a date")}{" "}
              <Box component="span" sx={{ color: "error.main" }}>
                *
              </Box>
            </Typography>

            {isLoadingTimes ? (
              <Box>
                <Skeleton variant="rounded" height={56} />
                <Skeleton
                  variant="text"
                  sx={{ mt: 1, width: "60%" }}
                  height={24}
                />
              </Box>
            ) : (
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
                      sx: {
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor: "background.paper",
                        },
                      },
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
            )}

            <Box
              sx={{
                mt: 1,
                p: 2,
                borderRadius: 2,
                bgcolor: "action.hover",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <CalendarMonthIcon
                sx={{ fontSize: 18, color: "text.disabled" }}
              />
              <Typography variant="body2" color="text.secondary">
                {selectedDate
                  ? format(selectedDate, "dd/MM/yyyy")
                  : t("select the date first")}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* بطاقة الوقت */}
      <Box sx={sectionSx}>
        <Card
          variant="outlined"
          sx={{ ...proCardSx, width: "100%", borderRadius: 2 }}
        >
          <Header
            icon={
              <AccessTimeIcon
                sx={{
                  color: selectedDate ? "success.main" : "text.disabled",
                  fontSize: 22,
                }}
              />
            }
            title={t("Resrvation Time")}
            subtitle={t("choose your convenient time")}
          />
          <CardContent sx={{ display: "grid", gap: 2 }}>
            <Typography variant="body2" fontWeight={800}>
              {t("choose the time")}{" "}
              <Box component="span" sx={{ color: "error.main" }}>
                *
              </Box>
            </Typography>

            {isLoadingTimes ? (
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    variant="rounded"
                    width={120}
                    height={36}
                    sx={{ borderRadius: 2 }}
                  />
                ))}
              </Stack>
            ) : !selectedDate ? (
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
                <Typography fontWeight={700} color="text.secondary">
                  {t("select the date first")}
                </Typography>
                <Typography variant="body2" color="text.disabled">
                  {t("time will show after selecting the date")}
                </Typography>
              </Box>
            ) : timeOptions.length === 0 ? (
              <Box
                sx={{
                  p: 2.5,
                  textAlign: "center",
                  bgcolor: "error.50",
                  color: "error.main",
                  borderRadius: 2,
                  border: "1px dashed",
                  borderColor: "error.light",
                  fontWeight: 700,
                }}
              >
                {t("No times available")}
              </Box>
            ) : (
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {timeOptions.map((opt) => {
                  const selected = selectedTime === opt.value;
                  return (
                    <Chip
                      key={opt.value}
                      label={opt.label}
                      onClick={() => setSelectedTime(opt.value)}
                      variant={selected ? "filled" : "outlined"}
                      color={selected ? "primary" : "default"}
                      sx={{
                        px: 1.2,
                        py: 0.2,
                        borderRadius: 2,
                        fontWeight: 700,
                      }}
                      icon={
                        selected ? (
                          <CheckCircleIcon sx={{ fontSize: 18 }} />
                        ) : undefined
                      }
                    />
                  );
                })}
              </Stack>
            )}

            <Box
              sx={{
                mt: 1,
                p: 2,
                borderRadius: 2,
                bgcolor: "action.hover",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <AccessTimeIcon sx={{ fontSize: 18, color: "text.disabled" }} />
              <Typography variant="body2" color="text.secondary">
                {selectedTime ? selectedTimeLabel : t("select the time first")}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* بطاقة العنوان */}
      <Box sx={sectionSx}>
        <Card
          variant="outlined"
          sx={{ ...proCardSx, width: "100%", borderRadius: 2 }}
        >
          <Header
            icon={
              <PlaceIcon
                sx={{
                  color: address ? "secondary.main" : "text.disabled",
                  fontSize: 22,
                }}
              />
            }
            title={t("Service Title")}
          />
          <CardContent sx={{ display: "grid", gap: 2 }}>
            <Typography variant="body2" fontWeight={800}>
              {t("Enter your address")}{" "}
              <Box component="span" sx={{ color: "error.main" }}>
                *
              </Box>
            </Typography>

            {isLoadingService ? (
              <Skeleton variant="rounded" height={56} />
            ) : (
              <TextField
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t("Enter your address")}
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
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
            )}

            {address && (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "primary.200",
                  bgcolor: "primary.50",
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
                >
                  <PlaceIcon
                    sx={{ color: "primary.main", fontSize: 18, mt: "2px" }}
                  />
                  <Typography variant="body2" color="primary.dark">
                    {address}
                  </Typography>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* بطاقة الملخّص + الإجمالي */}
      <Box sx={sectionSx}>
        <Card
          elevation={0}
          sx={{
            ...proCardSx,
            width: "100%",
            borderRadius: 2,
            boxShadow: "0 16px 42px rgba(2,10,40,0.20)",
            background:
              "linear-gradient(90deg, rgba(11,18,32,1) 0%, rgba(23,32,56,1) 100%)",
            color: "common.white",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
                gap: 4,
              }}
            >
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "rgba(255,255,255,0.7)" }}
                  gutterBottom
                >
                  {t("Review")}
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gap: 1,
                    p: 1.2,
                    borderRadius: 2,
                    bgcolor: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {isLoadingTimes ? (
                    <>
                      <Skeleton
                        variant="text"
                        height={22}
                        sx={{ bgcolor: "rgba(255,255,255,0.12)" }}
                      />
                      <Skeleton
                        variant="text"
                        height={22}
                        sx={{ bgcolor: "rgba(255,255,255,0.12)" }}
                      />
                      <Skeleton
                        variant="text"
                        height={22}
                        sx={{ bgcolor: "rgba(255,255,255,0.12)" }}
                      />
                    </>
                  ) : (
                    <>
                      <Row
                        label={t("Date")}
                        value={
                          selectedDate
                            ? format(selectedDate, "dd/MM/yyyy")
                            : "—"
                        }
                      />
                      <Row
                        label={t("Time")}
                        value={selectedTime ? selectedTimeLabel : "—"}
                      />
                      <Row label={t("Address")} value={address || "—"} />
                    </>
                  )}
                </Box>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  height: "fit-content",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.7)" }}
                >
                  {t("Total")}
                </Typography>

                {isLoadingService ? (
                  <Skeleton
                    variant="text"
                    height={44}
                    sx={{ bgcolor: "rgba(255,255,255,0.12)" }}
                  />
                ) : (
                  <Typography
                    variant="h4"
                    fontWeight={900}
                    sx={{ lineHeight: 1.2, mt: 0.5 }}
                  >
                    {Number(
                      selectedTime ? serviceDetail?.price ?? 0 : 0
                    ).toFixed(3)}{" "}
                    $
                  </Typography>
                )}

                <Divider
                  sx={{ my: 1.5, borderColor: "rgba(255,255,255,0.12)" }}
                />

                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.7)" }}
                >
                  {t("Service fee included")}
                </Typography>

                <Button
                  fullWidth
                  size="large"
                  disabled={!isFormValid}
                  onClick={goToCheckout}
                  sx={{
                    mt: 2,
                    height: 52,
                    fontSize: 16,
                    fontWeight: 900,
                    borderRadius: 2,
                    color: isFormValid ? "common.white" : "text.disabled",
                    backgroundImage: isFormValid
                      ? "linear-gradient(90deg, #2563eb, #1d4ed8)"
                      : "none",
                    bgcolor: isFormValid
                      ? "transparent"
                      : "rgba(255,255,255,0.08)",
                    boxShadow: isFormValid
                      ? "0 12px 28px rgba(37,99,235,0.35)"
                      : "none",
                    transition: (t) =>
                      t.transitions.create(
                        ["transform", "box-shadow", "background-color"],
                        { duration: t.transitions.duration.short }
                      ),
                    "&:hover": {
                      transform: isFormValid ? "translateY(-2px)" : "none",
                      boxShadow: isFormValid
                        ? "0 16px 36px rgba(37,99,235,0.45)"
                        : "none",
                      backgroundImage: isFormValid
                        ? "linear-gradient(90deg, #1d4ed8, #1e40af)"
                        : "none",
                    },
                  }}
                >
                  {isFormValid
                    ? t("Continue to payment")
                    : t("Fill all fields")}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

/** صف بسيط داخل الملخص */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        gap: 2,
        alignItems: "center",
      }}
    >
      <Typography variant="body2" sx={{ opacity: 0.75 }}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 700,
          fontFamily: value === "—" ? undefined : "ui-sans-serif, system-ui",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}
