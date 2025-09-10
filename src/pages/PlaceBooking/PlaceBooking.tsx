import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import IconBack from "../../assets/logo/back.svg";
import Grid from "@mui/material/Grid";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate, useParams } from "react-router";
import { useGetBookingDates } from "../../hook/useGetBookingDates";
import { useGetOnePlaceDetails } from "../../hook/useGetOnePlaceDetails";
import { useTranslation } from "react-i18next";

interface DateRange {
  start: Date | null;
  end: Date | null;
}

const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const isWeekend = (d: Date) => {
  const day = d.getDay();
  return day === 5 || day === 6; // Friday/Saturday
};

const parseYmdLocal = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
};

export default function PlaceBooking() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data: disabledDaysFromApi = [] } = useGetBookingDates(Number(id));
  const { data: placeDetails } = useGetOnePlaceDetails(Number(id));

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState<DateRange>({
    start: null,
    end: null,
  });

  // بداية يوم "اليوم"
  const todayStart = useMemo(() => startOfDay(new Date()).getTime(), []);

  const disabledSet = useMemo(() => {
    const s = new Set<number>();
    for (const iso of disabledDaysFromApi) {
      const d = startOfDay(parseYmdLocal(iso));
      s.add(d.getTime());
    }
    return s;
  }, [disabledDaysFromApi]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const days: (Date | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++)
      days.push(new Date(year, month, d));
    return days;
  };

  //  أي يوم قبل اليوم أو ضمن قائمة الـ API يعتبر Disabled
  const isDisabled = (date: Date) => {
    const ts = startOfDay(date).getTime();
    return ts < todayStart || disabledSet.has(ts);
  };

  //  لو في أيام ماضية أو محجوزة بين تاريخين، نمنع اختيار هذا المدى
  const hasDisabledBetween = (a: Date, b: Date) => {
    const from = Math.min(startOfDay(a).getTime(), startOfDay(b).getTime());
    const to = Math.max(startOfDay(a).getTime(), startOfDay(b).getTime());

    for (let t = from + 24 * 60 * 60 * 1000; t < to; t += 24 * 60 * 60 * 1000) {
      if (t < todayStart || disabledSet.has(t)) return true;
    }
    return false;
  };

  const isDateInRange = (date: Date) => {
    if (!selectedRange.start || !selectedRange.end) return false;
    const t = startOfDay(date).getTime();
    const a = startOfDay(selectedRange.start).getTime();
    const b = startOfDay(selectedRange.end).getTime();
    return t >= Math.min(a, b) && t <= Math.max(a, b);
  };

  const isDateSelected = (date: Date) => {
    const t = startOfDay(date).getTime();
    return (
      (selectedRange.start &&
        startOfDay(selectedRange.start).getTime() === t) ||
      (selectedRange.end && startOfDay(selectedRange.end).getTime() === t)
    );
  };

  const handleDateClick = (date: Date) => {
    if (isDisabled(date)) return;

    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
      setSelectedRange({ start: date, end: null });
      return;
    }

    const start = selectedRange.start;
    if (hasDisabledBetween(start, date)) {
      setSelectedRange({ start: date, end: null });
      return;
    }

    if (date < start) {
      setSelectedRange({ start: date, end: start });
    } else {
      setSelectedRange({ start, end: date });
    }
  };

  const formatDate = (date: Date | null) =>
    !date
      ? ""
      : `${String(date.getDate()).padStart(2, "0")}/${String(
          date.getMonth() + 1
        ).padStart(2, "0")}/${date.getFullYear()}`;

  const navigateMonth = (dir: "prev" | "next") =>
    setCurrentDate((prev) => {
      const nd = new Date(prev);
      nd.setMonth(prev.getMonth() + (dir === "prev" ? -1 : 1));
      return nd;
    });

  const days = useMemo(() => getDaysInMonth(currentDate), [currentDate]);

  const nights = useMemo(() => {
    if (!selectedRange.start || !selectedRange.end) return 0;
    const a = startOfDay(selectedRange.start).getTime();
    const b = startOfDay(selectedRange.end).getTime();
    return Math.ceil((Math.max(a, b) - Math.min(a, b)) / (1000 * 60 * 60 * 24));
  }, [selectedRange]);

  const totalPrice = useMemo(() => {
    if (!selectedRange.start || !selectedRange.end) return 0;

    const start =
      selectedRange.start < selectedRange.end
        ? startOfDay(selectedRange.start)
        : startOfDay(selectedRange.end);
    const end =
      selectedRange.start < selectedRange.end
        ? startOfDay(selectedRange.end)
        : startOfDay(selectedRange.start);

    let sum = 0;
    // iterate nights: start (inclusive) -> end (exclusive)
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      sum += isWeekend(d)
        ? placeDetails?.weekend_price ?? 0
        : placeDetails?.weekday_price ?? 0;
    }
    return sum;
  }, [selectedRange, placeDetails?.weekday_price, placeDetails?.weekend_price]);

  const navigate = useNavigate();

  const goToCheckout = () => {
    localStorage.setItem("nights", JSON.stringify(nights));
    localStorage.setItem("startDate", String(selectedRange.start));
    localStorage.setItem("endDate", String(selectedRange.end));
    localStorage.setItem("totalPrice", String(totalPrice));
    navigate(`/places/book/${id}/checkout`);
  };

  return (
    <>
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
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          p: { xs: 2, md: 4 },
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          <Box
            sx={{
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Typography variant="h4" fontWeight={700}>
              {t("book a place")}
            </Typography>
          </Box>

          <Grid container>
            <Grid size={{ xs: 12, lg: 7.5 }}>
              <Card variant="outlined">
                <CardHeader
                  sx={{ pb: 1 }}
                  title={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      {/* السابق = سهم لليسار */}
                      <IconButton
                        aria-label={t("Previous Month")}
                        onClick={() => navigateMonth("prev")}
                        size="small"
                      >
                        <ChevronLeftIcon fontSize="small" />
                      </IconButton>

                      <Typography variant="h6" fontWeight={700}>
                        {monthNames[currentDate.getMonth()]}{" "}
                        {currentDate.getFullYear()}
                      </Typography>

                      {/* التالي = سهم لليمين */}
                      <IconButton
                        aria-label={t("Next Month")}
                        onClick={() => navigateMonth("next")}
                        size="small"
                      >
                        <ChevronRightIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  }
                />

                <CardContent>
                  {/* Day headers */}
                  <Grid container columns={7} spacing={0.5} sx={{ mb: 2 }}>
                    {dayNames.map((day) => (
                      <Grid key={day} size={{ xs: 1 }}>
                        <Box
                          sx={{
                            p: 1,
                            textAlign: "center",
                            typography: "body2",
                            fontWeight: 600,
                            color: "text.secondary",
                          }}
                        >
                          {day}
                        </Box>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Days grid */}
                  <Grid container columns={7} spacing={0.5}>
                    {days.map((date, idx) => (
                      <Grid key={idx} size={{ xs: 1 }}>
                        <Box
                          sx={{
                            position: "relative",
                            width: "100%",
                            pt: "100%",
                          }}
                        >
                          {date ? (
                            <Button
                              onClick={() => handleDateClick(date)}
                              fullWidth
                              disabled={isDisabled(date)}
                              sx={{
                                position: "absolute",
                                inset: 0,
                                minWidth: 0,
                                borderRadius: 1,
                                fontSize: 14,
                                fontWeight: 600,

                                color: isDateSelected(date)
                                  ? "primary.contrastText"
                                  : "text.primary",

                                bgcolor: isDateSelected(date)
                                  ? "primary.main"
                                  : isDateInRange(date)
                                  ? "action.hover"
                                  : "transparent",

                                "&:hover": {
                                  bgcolor: isDisabled(date)
                                    ? "action.disabledBackground"
                                    : isDateSelected(date)
                                    ? "primary.dark"
                                    : "action.hover",
                                },

                                cursor: isDisabled(date)
                                  ? "not-allowed"
                                  : "pointer",
                              }}
                            >
                              {date.getDate()}
                            </Button>
                          ) : (
                            <Box sx={{ position: "absolute", inset: 0 }} />
                          )}
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ lg: 0.5 }}></Grid>

            <Grid size={{ xs: 12, lg: 4 }}>
              <Box sx={{ display: "grid", gap: 2 }}>
                <Card variant="outlined">
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ textAlign: "center", mb: 2 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        {t("starting Date")}
                      </Typography>
                      <Typography variant="h6" fontWeight={700}>
                        {formatDate(selectedRange.start)}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 1.5 }} />
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        {t("ending Date")}
                      </Typography>
                      <Typography variant="h6" fontWeight={700}>
                        {formatDate(selectedRange.end)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                <Card variant="outlined">
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6" fontWeight={700}>
                        {t("Register price")}
                      </Typography>
                      <Typography variant="h5" fontWeight={800} color="primary">
                        $ {totalPrice.toFixed(3)}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      disabled={!selectedRange.start || !selectedRange.end}
                      sx={{ py: 1.5, fontSize: 16, fontWeight: 700 }}
                      onClick={goToCheckout}
                    >
                      {t("continue to payment")}{" "}
                    </Button>
                  </CardContent>
                </Card>

                <Card variant="outlined">
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      sx={{ mb: 1.5 }}
                    >
                      {t("payment details")}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {t("number of nights")}
                      </Typography>
                      <Typography variant="body2" fontWeight={700}>
                        {nights}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    ></Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}
