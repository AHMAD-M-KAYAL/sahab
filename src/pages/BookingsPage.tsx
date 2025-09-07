/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
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
import { useGetAllBookingService } from "../hook/useGetAllBookingService";
import { useGetAllBookingPlaces } from "../hook/useGetAllBookingPlaces";
import { Button } from "@mui/material";
import { t } from "i18next";
import IconBack from "../assets/logo/back.svg";
import { useNavigate } from "react-router-dom";

// Helpers: ألوان وأيقونات الحالة
const statusColor = (status: string) => {
  const s = (status || "").toLowerCase();
  if (s === "completed" || s === "confirmed")
    return { bg: "#e8f5e9", color: "#1b5e20" }; // أخضر
  if (s === "placed" || s === "pending")
    return { bg: "#fff8e1", color: "#795548" }; // أصفر/بني فاتح
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

export default function BookingsPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);
  const token = localStorage.getItem("token")!;
  const { data: bookingPlacesRaw } = useGetAllBookingPlaces(token);
  const { data: bookingServicesRaw } = useGetAllBookingService(token);

  // دايمًا خلّيهم Array حتى لو undefined

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
            navigate("/home");
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
      <Box sx={{ minHeight: "100vh", bgcolor: "#f9fafb" }}>
        <Container sx={{}}>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
            <Tab label="Places" />
            <Tab label="Services" />
          </Tabs>

          {/* PLACES */}
          {activeTab === 0 && (
            <Box sx={{ mt: 3 }}>
              {bookingPlacesRaw?.length === 0 && (
                <Typography sx={{ color: "text.secondary", mb: 2 }}>
                  No place bookings yet.
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
                            label={p.status}
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
                            <strong> Category:</strong>
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
                            <strong> Reservation number:</strong>
                            {p.id}
                          </Typography>
                        </Stack>
                        <Stack spacing={0.5}>
                          <Typography variant="body2">
                            <strong>TotalPrice:</strong> {p.total_price} KD
                          </Typography>

                          {p.invoice_reference && (
                            <Typography variant="body2">
                              <strong>Invoice:</strong> {p.invoice_reference}
                            </Typography>
                          )}

                          <Typography variant="body2" color="text.secondary">
                            <strong>Payment:</strong> {p.payment}
                          </Typography>
                        </Stack>
                      </CardContent>
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
                  No service bookings yet.
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
                            label={s.status}
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
                            <strong> Category:</strong>
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
                            <strong> Reservation number:</strong>
                            {s.id}
                          </Typography>
                        </Stack>
                        <Stack spacing={0.5}>
                          <Typography variant="body2">
                            <strong>TotalPrice:</strong> {s.total_price} KD
                          </Typography>

                          {s.invoice_reference && (
                            <Typography variant="body2">
                              <strong>Invoice:</strong> {s.invoice_reference}
                            </Typography>
                          )}

                          <Typography variant="body2" color="text.secondary">
                            <strong>Payment:</strong> {s.payment}
                          </Typography>
                        </Stack>
                      </CardContent>
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
