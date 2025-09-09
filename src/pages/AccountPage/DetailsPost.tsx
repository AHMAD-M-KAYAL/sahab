/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, type JSX } from "react";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Paper,
  Divider,
  Stack,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import WifiIcon from "@mui/icons-material/Wifi";
import PoolIcon from "@mui/icons-material/Pool";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import OutdoorGrillIcon from "@mui/icons-material/OutdoorGrill";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";

/* ===== أيقونات المزايا ===== */
const AMENITY_META: Record<string, { label: string; icon: React.ReactNode }> = {
  wifi: { label: "Wifi", icon: <WifiIcon /> },
  pool: { label: "Swimming Pool", icon: <PoolIcon /> },
  parking: { label: "Parking", icon: <LocalParkingIcon /> },
  bbq: { label: "BBQ", icon: <OutdoorGrillIcon /> },
  ac: { label: "Air Condition", icon: <AcUnitIcon /> },
};

type Kind = "place" | "service";

type SpecialRange = {
  id: string;
  title: string;
  pricePerDay: number;
  start: string;
  end: string;
};

type StoredPost = {
  id: string;
  kind?: Kind;
  title?: string;
  category?: string;
  placeType?: string;
  amenities?: string[];
  area?: string;
  address?: string;
  about?: string;
  prices?: {
    weekday?: number; // للخدمات أيضًا كسعر service
    weekend?: number;
    specialRanges?: SpecialRange[];
    currency?: "$";
  };
  images?: { url?: string }[];
  coverUrl?: string;
  postStatus?: "active" | "inactive";
  bookingStatus?: "open" | "closed";
};

type LocationState = {
  post?: any; // من القائمة (لـ prefill)
  kind?: Kind; // نمررها من القائمة
};

/* ========= API ========= */
const API_BASE = "https://sahab.ghinashop.net";
const api = axios.create({
  baseURL: API_BASE,
  headers: { Accept: "application/json" },
  withCredentials: false,
});
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("access_token") ||
    (JSON.parse(localStorage.getItem("auth") || "{}")?.token ?? null);
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`;
  }
  return config;
});

function toAbsoluteUrl(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return API_BASE + (url.startsWith("/") ? url : "/" + url);
}

/* ===== Helpers: تطبيع المزايا ===== */
function normalizeAmenityIds(raw: any): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((a) => {
      if (typeof a === "string") return a;
      return a?.id ?? a?.slug ?? a?.key ?? undefined;
    })
    .filter((v): v is string => typeof v === "string" && v.length > 0);
}

/* ======== جلب التفاصيل ======== */
async function fetchPlaceDetailsApi(id: string) {
  const res = await api.get(`/api/places/${id}`);
  const data = res.data;
  const item = data?.data ?? data;
  if (!item || typeof item !== "object") throw new Error("Unexpected response");
  return item as any;
}
async function fetchServiceDetailsApi(id: string) {
  const res = await api.get(`/api/services/${id}`);
  const data = res.data;
  const item = data?.data ?? data;
  if (!item || typeof item !== "object") throw new Error("Unexpected response");
  return item as any;
}

/** حوّل عنصر مكان إلى StoredPost (يشمل كل الحقول التي تحتاجها الصفحة) */
function mapPlaceApiToStoredPost(item: any): StoredPost {
  // الصور
  const imagesArr: { url: string }[] = [];
  if (Array.isArray(item.place_images)) {
    for (const im of item.place_images) {
      const u = im?.image;
      if (u) imagesArr.push({ url: toAbsoluteUrl(String(u)) });
    }
  } else if (Array.isArray(item.images)) {
    for (const im of item.images) {
      const u = typeof im === "string" ? im : im?.url || im?.image;
      if (u) imagesArr.push({ url: toAbsoluteUrl(String(u)) });
    }
  }
  if (item.icon) imagesArr.unshift({ url: toAbsoluteUrl(item.icon) });

  // الأسعار
  const weekday = Number(item.weekday_price);
  const weekend = Number(item.weekend_price);

  // الحالات
  const available = Number(item.available ?? item.status ?? 1) === 1;
  const bookable = Number(item.bookable ?? 1) === 1;

  return {
    id: String(item.id),
    kind: "place",
    title: item.title ?? "",
    category: item.category?.name ?? undefined,
    placeType: item.area ?? item.tag ?? "Place",

    // المزايا (تطبيع)
    amenities: normalizeAmenityIds(item.amenities),

    area: item.area ?? undefined,
    address: item.address ?? undefined,
    about: item.description ?? undefined,

    prices: {
      weekday: !Number.isNaN(weekday) ? weekday : undefined,
      weekend: !Number.isNaN(weekend) ? weekend : undefined,
      specialRanges: [],
      currency: "$",
    },

    images: imagesArr.length ? imagesArr : undefined,
    coverUrl: imagesArr[0]?.url ?? undefined,

    postStatus: available ? "active" : "inactive",
    bookingStatus: bookable ? "open" : "closed",
  };
}

/** حوّل عنصر خدمة إلى StoredPost */
function mapServiceApiToStoredPost(item: any): StoredPost {
  const imagesArr: { url: string }[] = [];

  if (item.icon) imagesArr.push({ url: toAbsoluteUrl(item.icon) });
  if (Array.isArray(item.service_images)) {
    for (const im of item.service_images) {
      const u = im?.image;
      if (u) imagesArr.push({ url: toAbsoluteUrl(String(u)) });
    }
  }
  if (Array.isArray(item.images)) {
    for (const im of item.images) {
      const u = typeof im === "string" ? im : im?.url || im?.image;
      if (u) imagesArr.push({ url: toAbsoluteUrl(String(u)) });
    }
  }

  const price = Number(item.price);

  return {
    id: String(item.id),
    kind: "service",
    title: item.title ?? "",
    category: item.category?.name ?? undefined,
    placeType: "Service",
    amenities: [],
    about: item.description ?? undefined,
    prices: {
      weekday: !Number.isNaN(price) ? price : undefined, // سعر الخدمة
      weekend: undefined,
      specialRanges: [],
      currency: "$",
    },
    images: imagesArr.length ? imagesArr : undefined,
    coverUrl: imagesArr[0]?.url ?? undefined,
    postStatus:
      Number(item.available ?? item.status ?? 1) === 1 ? "active" : "inactive",
    bookingStatus:
      Number(item.bookable ?? item.is_bookable ?? 1) === 1 ? "open" : "closed",
  };
}

/* ====== لو عندك نسخة مخزنة محليًا (fallback) ====== */
function getPostByIdFromLocal(id: string): StoredPost | undefined {
  try {
    const all: StoredPost[] = JSON.parse(localStorage.getItem("posts") || "[]");
    return all.find((p) => String(p.id) === String(id));
  } catch {
    return undefined;
  }
}

export default function DetailsPost(): JSX.Element {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const location = useLocation() as { state?: LocationState };

  // نقرأ النوع من state إن وُجد
  const stateKind = location.state?.kind as Kind | undefined;
  const passedPost = location.state?.post;

  // prefill من القائمة
  const prefill: StoredPost | null = passedPost
    ? {
        id: String(passedPost.id),
        kind: (passedPost.kind as Kind) || stateKind,
        title: passedPost.title,
        placeType: passedPost.type,
        coverUrl: passedPost.coverUrl,
        postStatus: passedPost.postStatus,
        bookingStatus: passedPost.bookingStatus,
      }
    : null;

  const [post, setPost] = useState<StoredPost | null>(prefill);
  const [idx, setIdx] = useState(0);

  // جلب فعلي من الـ API — يختار المسار الصحيح حسب النوع
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!postId) return;

      const knownKind: Kind | undefined =
        prefill?.kind || stateKind || undefined;

      const setMapped = (mapped: StoredPost) => {
        if (!cancelled) setPost((prev) => ({ ...(prev ?? {}), ...mapped }));
      };

      try {
        if (knownKind === "service") {
          const raw = await fetchServiceDetailsApi(postId);
          setMapped(mapServiceApiToStoredPost(raw));
          return;
        }
        if (knownKind === "place") {
          const raw = await fetchPlaceDetailsApi(postId);
          setMapped(mapPlaceApiToStoredPost(raw));
          return;
        }

        try {
          const rawPlace = await fetchPlaceDetailsApi(postId);
          setMapped(mapPlaceApiToStoredPost(rawPlace));
        } catch {
          const rawService = await fetchServiceDetailsApi(postId);
          setMapped(mapServiceApiToStoredPost(rawService));
        }
      } catch {
        // fallback إلى localStorage
        const local = getPostByIdFromLocal(postId);
        if (!cancelled && local)
          setPost((prev) => ({ ...(prev ?? {}), ...local }));

        if (!cancelled && !prefill && !local)
          navigate("/Account/posts", { replace: true }); // ← مسار الرجوع
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, navigate]);

  /* تجهيز الصور بأمان */
  const rawImages = Array.isArray(post?.images)
    ? (post!.images as { url?: string }[])
    : [];
  const fallback = post?.coverUrl ? [{ url: post!.coverUrl }] : [];
  const images = (rawImages.length ? rawImages : fallback).filter(
    (im) => typeof im?.url === "string" && im.url!.length > 0
  ) as { url: string }[];

  /* تضبيط مؤشر السلايدر */
  useEffect(() => {
    if (idx > images.length - 1) setIdx(0);
  }, [images.length, idx]);

  /* السعر الظاهر */
  const weekday = Number(post?.prices?.weekday);
  const weekend = Number(post?.prices?.weekend);
  const isService = post?.kind === "service";
  let priceText = "";
  if (isService) {
    if (!Number.isNaN(weekday) && weekday > 0) {
      priceText = `Price ${weekday.toFixed(3)} KD`;
    }
  } else {
    const candidates = [weekday, weekend].filter(
      (n) => !Number.isNaN(n) && n > 0
    );
    const starting = candidates.length ? Math.min(...candidates) : Infinity;
    priceText =
      starting !== Infinity ? `Starting From ${starting.toFixed(3)} KD` : "";
  }

  if (!post) return <Box sx={{ p: 2 }} />;

  return (
    <Box sx={{ bgcolor: "#F7F8FB", minHeight: "100vh" }}>
      <Box
        sx={{ width: "100%", maxWidth: 520, mx: "auto", px: 2, pt: 2, pb: 4 }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 1.5 }}>
          <IconButton
            edge="start"
            size="small"
            onClick={() => navigate(-1)}
            sx={{ border: "1px solid #E5E7EB" }}
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Details
          </Typography>
        </Box>

        {/* Cover / Carousel */}
        <Box
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            height: 180,
            position: "relative",
            mb: 1.5,
            bgcolor: "#eaeaea",
          }}
        >
          {images[0] && (
            <Box
              component="img"
              src={images[idx].url}
              alt={post.title || "cover"}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
          {images.length > 1 && (
            <Box
              sx={{
                position: "absolute",
                bottom: 8,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 0.75,
              }}
            >
              {images.map((_, i) => (
                <Box
                  key={i}
                  onClick={() => setIdx(i)}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: i === idx ? "#0F2340" : "rgba(255,255,255,.7)",
                    border: "1px solid rgba(0,0,0,.1)",
                    cursor: "pointer",
                  }}
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Title + price + tag */}
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          {post.title || "Untitled"}
        </Typography>
        {priceText && (
          <Typography variant="body2" sx={{ color: "#6B7280", mt: 0.5 }}>
            {priceText}
          </Typography>
        )}
        {post.placeType && (
          <Chip
            size="small"
            label={post.placeType}
            sx={{
              mt: 1.25,
              bgcolor: "#E5ECFA",
              color: "#4768B1",
              fontWeight: 700,
            }}
          />
        )}

        {/* Card */}
        <Paper
          elevation={0}
          sx={{
            mt: 2,
            borderRadius: 2,
            bgcolor: "#fff",
            p: 2,
            boxShadow: "0 2px 12px rgba(16,24,40,.06)",
          }}
        >
          {/* الحالة */}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1.5 }}>
            {post.postStatus && (
              <Chip
                label={post.postStatus === "active" ? "Active" : "Inactive"}
                sx={{
                  bgcolor: post.postStatus === "active" ? "#E7F5EA" : "#FFE2E0",
                  color: post.postStatus === "active" ? "#2E7D32" : "#C62828",
                  fontWeight: 700,
                }}
                size="small"
              />
            )}
            {post.bookingStatus && (
              <Chip
                label={
                  post.bookingStatus === "open"
                    ? "Open for Booking"
                    : "Closed for Booking"
                }
                sx={{
                  bgcolor:
                    post.bookingStatus === "open" ? "#E7F5EA" : "#FFE2E0",
                  color: post.bookingStatus === "open" ? "#2E7D32" : "#C62828",
                  fontWeight: 700,
                }}
                size="small"
              />
            )}
          </Box>

          {/* Amenities (للأماكن فقط) */}
          {post.kind !== "service" && (
            <>
              <Typography sx={{ fontWeight: 800, mb: 1.5 }}>
                Amenities
              </Typography>

              <Stack spacing={1.25}>
                {(post.amenities || []).length ? (
                  (post.amenities || []).map((id) => {
                    const meta = AMENITY_META[id] || { label: id, icon: null };
                    return (
                      <Box
                        key={id}
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 1.25,
                            bgcolor: "#F3F6FF",
                            color: "#4768B1",
                            display: "grid",
                            placeItems: "center",
                            flexShrink: 0,
                          }}
                        >
                          {meta.icon}
                        </Box>
                        <Typography>{meta.label}</Typography>
                      </Box>
                    );
                  })
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No amenities provided.
                  </Typography>
                )}
              </Stack>

              <Divider sx={{ my: 2 }} />
            </>
          )}

          {/* Address (للأماكن) */}
          {post.kind !== "service" && (
            <>
              <Typography sx={{ fontWeight: 800, mb: 0.75 }}>
                Address
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {post.address || "-"}
              </Typography>
              <Divider sx={{ my: 2 }} />
            </>
          )}

          {/* About */}
          <Typography sx={{ fontWeight: 800, mb: 0.75 }}>
            {post.kind === "service" ? "About Service" : "About Place"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {post.about || "-"}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
