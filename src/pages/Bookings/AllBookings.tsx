/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { CardActionArea } from "@mui/material";
import {
  Box,
  Container,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Tabs,
  Tab,
  Chip,
  Stack,
} from "@mui/material";
import {
  CheckCircle,
  AccessTime,
  Cancel,
  WarningAmber,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useGetAllBookingPlaces } from "../../hook/useGetAllBookingPlaces";
import { useGetAllBookingService } from "../../hook/useGetAllBookingService";
import NavBar from "../../components/NavBar";
import { useTranslation } from "react-i18next";

// Helpers: ألوان وأيقونات الحالة
const statusColor = (status: string) => {
  const s = (status || "").toLowerCase();
  if (s === "completed") return { bg: "#e8f5e9", color: "#1b5e20" }; // أخضر
  if (s === "placed") return { bg: "#fff8e1", color: "#795548" }; // أصفر/بني فاتح
  if (s === "canceled") return { bg: "#ffebee", color: "#b71c1c" }; // أحمر
  return { bg: "#eceff1", color: "#455a64" }; // رمادي
};

const statusIcon = (status: string) => {
  const s = (status || "").toLowerCase();
  if (s === "booked" || s === "confirmed")
    return <CheckCircle fontSize="small" color="success" />;
  if (s === "placed" || s === "pending")
    return <AccessTime fontSize="small" color="warning" />;
  if (s === "cancelled") return <Cancel fontSize="small" color="error" />;
  return <WarningAmber fontSize="small" color="disabled" />;
};

export default function AllBookings() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);
  const token = localStorage.getItem("token")!;
  const { data: bookingPlacesRaw } = useGetAllBookingPlaces(token);
  const { data: bookingServicesRaw } = useGetAllBookingService(token);

  return (
    <>
      <NavBar />

      <Box sx={{ minHeight: "100vh", bgcolor: "#f9fafb" }}>
        <Container>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
            <Tab label={t("Places")} />
            <Tab label={t("Services")} />
          </Tabs>

          {/* PLACES */}
          {activeTab === 0 && (
            <Box sx={{ mt: 3 }}>
              {bookingPlacesRaw?.length === 0 && (
                <Typography sx={{ color: "text.secondary", mb: 2 }}>
                  {t("No place bookings yet.")}
                </Typography>
              )}

              <Box
                sx={{
                  mt: 2,
                  display: "grid",
                  gap: 3,
                  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                }}
              >
                {bookingPlacesRaw?.map((p) => {
                  const sc = statusColor(p.status);
                  return (
                    <Card
                      key={`place-${p.id}`}
                      sx={{
                        border: "1px solid #c9dbffff",
                        borderRadius: "12px",
                      }}
                    >
                      <CardActionArea
                        onClick={() =>
                          navigate(`/Bookings/BookingDetailsPage/${p.id}`)
                        }
                        sx={{ borderRadius: "12px" }}
                      >
                        <CardHeader title={p.place_title} sx={{ pb: 0.5 }} />
                        <CardContent sx={{ pt: 1.5 }}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            mb={1}
                          >
                            <Chip
                              size="small"
                              label={t(p.status)}
                              icon={statusIcon(p.status)}
                              sx={{
                                bgcolor: sc.bg,
                                color: sc.color,
                                fontWeight: 600,
                              }}
                            />
                          </Stack>

                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            mb={1}
                          >
                            <Typography variant="body2" color="text.secondary">
                              <strong>{t("Category")}:</strong>{" "}
                              {p.category_title}
                            </Typography>
                          </Stack>

                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            mb={1}
                          >
                            <Typography variant="body2" color="text.secondary">
                              <strong>{t("Booking ID")}:</strong> {p.id}
                            </Typography>
                          </Stack>

                          <Stack spacing={0.5}>
                            <Typography variant="body2">
                              <strong>{t("Total Price")}:</strong>{" "}
                              {p.total_price} $
                            </Typography>

                            {p.invoice_reference && (
                              <Typography variant="body2">
                                <strong>{t("Invoice")}:</strong>{" "}
                                {p.invoice_reference}
                              </Typography>
                            )}
                          </Stack>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  );
                })}
              </Box>
            </Box>
          )}

          {/* SERVICES */}
          {activeTab === 1 && (
            <Box sx={{ mt: 3 }}>
              {bookingServicesRaw?.length === 0 && (
                <Typography sx={{ color: "text.secondary", mb: 2 }}>
                  {t("No service bookings yet.")}
                </Typography>
              )}

              <Box
                sx={{
                  mt: 2,
                  display: "grid",
                  gap: 3,
                  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                }}
              >
                {bookingServicesRaw?.map((s: any) => {
                  const sc = statusColor(s.status);
                  return (
                    <Card
                      key={`service-${s.id}`}
                      sx={{
                        border: "1px solid #c9dbffff",
                        borderRadius: "12px",
                      }}
                    >
                      <CardActionArea
                        onClick={() =>
                          navigate(`/Bookings/BookingDetailsPage/${s.id}`)
                        }
                        sx={{ borderRadius: "12px" }}
                      >
                        <CardHeader title={s.service_title} sx={{ pb: 0.5 }} />
                        <CardContent sx={{ pt: 1.5 }}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            mb={1}
                          >
                            <Chip
                              size="small"
                              label={t(s.status)}
                              icon={statusIcon(s.status)}
                              sx={{
                                bgcolor: sc.bg,
                                color: sc.color,
                                fontWeight: 600,
                              }}
                            />
                          </Stack>

                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            mb={1}
                          >
                            <Typography variant="body2" color="text.secondary">
                              <strong>{t("Category")}:</strong>{" "}
                              {s.category_title}
                            </Typography>
                          </Stack>

                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            mb={1}
                          >
                            <Typography variant="body2" color="text.secondary">
                              <strong>{t("Booking ID")}:</strong> {s.id}
                            </Typography>
                          </Stack>

                          <Stack spacing={0.5}>
                            <Typography variant="body2">
                              <strong>{t("Total Price")}:</strong>{" "}
                              {s.total_price} $
                            </Typography>

                            {s.invoice_reference && (
                              <Typography variant="body2">
                                <strong>{t("Invoice")}:</strong>{" "}
                                {s.invoice_reference}
                              </Typography>
                            )}
                          </Stack>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  );
                })}
              </Box>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}
