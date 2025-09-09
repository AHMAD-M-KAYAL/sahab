/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type JSX,
} from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  Button as MUIButton,
  Alert,
  CircularProgress,
  FormControl,
  FormLabel,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

/* ================== الألوان ================== */
const COLORS = {
  primary: "#4A6CF7",
  bg: "#F7F8FB",
  textDark: "#0F2340",
  stepLine: "#C9D2E6",
  pillInactive: "#DDE1EA",
  shadow: "0 2px 12px rgba(16,24,40,.06)",
};

/* ================== أنواع ================== */
type Amenity = { id: string; label: string };
type ImgItem = { file: File; url: string };
type SpecialRange = {
  id: string;
  title: string;
  pricePerDay: number;
  start: string; // yyyy-mm-dd
  end: string; // yyyy-mm-dd
};
type MetaOption = { id: string | number; name?: string } | string;

type MetaData = {
  CATEGORIES: MetaOption[];
  AMENITIES: Amenity[];
  PLACE_TYPES: MetaOption[];
  SERVICES: string[];
};

/* ================== API ================== */
const API_BASE = "https://sahab.ghinashop.net";

const PATHS = {
  categories: null as string | null,
  amenities: null as string | null,
  placeTypes: null as string | null,

  // Places
  createPlace: "/api/places",

  // Services
  createService: "/api/services",
};

const api = axios.create({
  baseURL: API_BASE,
  headers: { Accept: "application/json" },
});

// قراءة توكن (اختياري — لو API يحتاج Bearer)
function readToken(): string | null {
  const t =
    localStorage.getItem("token") ||
    localStorage.getItem("access_token") ||
    (() => {
      try {
        const obj = JSON.parse(localStorage.getItem("auth") || "{}");
        return obj?.token || obj?.access_token || null;
      } catch {
        return null;
      }
    })();
  return t || null;
}

api.interceptors.request.use((config) => {
  const token = readToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      // window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// Type guard خفيف
type AxiosCompatError = {
  isAxiosError?: boolean;
  message?: string;
  response?: { data?: unknown; status?: number };
};
const isAxiosErr = (e: unknown): e is AxiosCompatError =>
  !!e && typeof e === "object" && (e as any).isAxiosError === true;

type ApiErrorResponse = {
  message?: string;
  error?: string;
  errors?: Record<string, unknown>;
};
const getAxiosErrorMessage = (err: unknown): string => {
  if (isAxiosErr(err)) {
    const data = (err as any)?.response?.data;
    if (typeof data === "string") return data;
    if (data && typeof data === "object") {
      const d = data as ApiErrorResponse;
      return d.message ?? d.error ?? (err as any).message ?? "Unknown error";
    }
    return (err as any).message ?? "Unknown error";
  }
  if (err instanceof Error) return err.message;
  return "Unknown error";
};

/* ================== قوائم افتراضية ================== */
const FALLBACK: MetaData = {
  CATEGORIES: ["Kashta", "Chalet", "Resort", "Apartment", "Farm"],
  SERVICES: ["Cleaning", "Maintenance", "Transport", "Catering"],
  PLACE_TYPES: ["Entire place", "Private room", "Shared room"],
  AMENITIES: [
    { id: "wifi", label: "Wi-Fi" },
    { id: "swimming", label: "Swimming" },
    { id: "pool", label: "Pool" },
    { id: "parking", label: "Parking" },
    { id: "bbq", label: "BBQ" },
    { id: "ac", label: "A/C" },
  ],
};

const MAX_COUNT = 5;
const MAX_MB = 5;
const ALLOWED = ["image/png", "image/jpeg"];

/* ================== أدوات ================== */
const safeGetArray = async <T,>(url?: string | null): Promise<T[] | null> => {
  if (!url) return null;
  try {
    const res = await api.get<T[] | { data: T[] }>(url);
    const payload = res.data as unknown;
    if (Array.isArray(payload)) return payload as T[];
    if (
      payload &&
      typeof payload === "object" &&
      Array.isArray((payload as any).data)
    ) {
      return (payload as { data: T[] }).data;
    }
    return null;
  } catch {
    return null;
  }
};

const optValue = (opt: MetaOption) =>
  typeof opt === "string" ? opt : String(opt.id);
const optLabel = (opt: MetaOption) =>
  typeof opt === "string" ? opt : opt.name ?? String(opt.id);

const toYMD = (d: Date) => {
  const tz = d.getTimezoneOffset();
  const local = new Date(d.getTime() - tz * 60000);
  return local.toISOString().slice(0, 10);
};
const todayYMD = toYMD(new Date());

// تطبيع وقت HH:MM:SS
function normalizeTime(input: string): string {
  const s = (input || "").trim();
  if (!s) return "00:00:00";
  const parts = s.split(":").map((p) => p.trim());
  let h = 0,
    m = 0,
    sec = 0;
  if (parts.length === 1) {
    h = Number(parts[0]) || 0;
  } else if (parts.length === 2) {
    h = Number(parts[0]) || 0;
    m = Number(parts[1]) || 0;
  } else {
    h = Number(parts[0]) || 0;
    m = Number(parts[1]) || 0;
    sec = Number(parts[2]) || 0;
  }
  const pad = (n: number) =>
    String(Math.max(0, Math.min(59, n))).padStart(2, "0");
  const hh = String(Math.max(0, Math.min(23, h))).padStart(2, "0");
  return `${hh}:${pad(m)}:${pad(sec)}`;
}

/* ================== أزرار ================== */
function PrimaryBtn(
  props: React.ComponentProps<"button"> & { fullWidth?: boolean }
) {
  const { fullWidth, style, children, ...rest } = props;
  return (
    <Box
      component="button"
      {...rest}
      sx={{
        width: fullWidth ? "100%" : "auto",
        px: 2.5,
        py: 1.25,
        borderRadius: 2,
        bgcolor: COLORS.primary,
        color: "#fff",
        fontWeight: 700,
        border: "none",
        cursor: "pointer",
        boxShadow: COLORS.shadow,
        "&:disabled": { opacity: 0.5, cursor: "not-allowed" },
      }}
      style={style}
    >
      {children}
    </Box>
  );
}
function SecondaryBtn(
  props: React.ComponentProps<"button"> & { fullWidth?: boolean }
) {
  const { fullWidth, style, children, ...rest } = props;
  return (
    <Box
      component="button"
      {...rest}
      sx={{
        width: fullWidth ? "100%" : "auto",
        px: 2.5,
        py: 1.25,
        borderRadius: 2,
        bgcolor: "transparent",
        color: "text.primary",
        fontWeight: 700,
        border: "1px solid",
        borderColor: "divider",
        cursor: "pointer",
        "&:disabled": { opacity: 0.5, cursor: "not-allowed" },
      }}
      style={style}
    >
      {children}
    </Box>
  );
}

/* ================== الصفحة ================== */
export default function NewPost(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState<number>(0);
  const [mode, setMode] = useState<"place" | "services">("place");

  // Step 1
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [placeType, setPlaceType] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [address, setAddress] = useState("");
  const [about, setAbout] = useState("");
  const [images, setImages] = useState<ImgItem[]>([]);
  const [amenitiesOpen, setAmenitiesOpen] = useState(false);

  // API-required
  const [tag, setTag] = useState("Family Only");
  const [categoryId, setCategoryId] = useState("1");
  const [vendorId, setVendorId] = useState(""); // يُجلب من localStorage('id')

  // Step 2 (place)
  const [weekdayPrice, setWeekdayPrice] = useState("");
  const [weekendPrice, setWeekendPrice] = useState("");
  const [specialRanges, setSpecialRanges] = useState<SpecialRange[]>([]);
  const [datesDialogOpen, setDatesDialogOpen] = useState(false);
  const [rangeTitle, setRangeTitle] = useState("");
  const [rangePrice, setRangePrice] = useState("");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");

  // Step 2 (services)
  const [serviceDuration, setServiceDuration] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("");
  const [capacity, setCapacity] = useState("");

  // UI
  const [, setSuccessOpen] = useState(false);
  const [apiError, setApiError] = useState<string>("");

  // اجلب vendorId من localStorage('id')
  useEffect(() => {
    const id = localStorage.getItem("id");
    if (id) setVendorId(String(id));
  }, []);

  /* --------- useQuery: ميتاداتا واجهة فقط --------- */
  const { data: metaData } = useQuery<MetaData>({
    queryKey: ["meta-options", PATHS],
    queryFn: async () => {
      const [cats, amens, types] = await Promise.all([
        safeGetArray<MetaOption>(PATHS.categories),
        safeGetArray<Amenity>(PATHS.amenities),
        safeGetArray<MetaOption>(PATHS.placeTypes),
      ]);
      return {
        CATEGORIES: cats ?? FALLBACK.CATEGORIES,
        AMENITIES: amens ?? FALLBACK.AMENITIES,
        PLACE_TYPES: types ?? FALLBACK.PLACE_TYPES,
        SERVICES: FALLBACK.SERVICES,
      };
    },
    staleTime: 300_000,
    refetchOnWindowFocus: false,
  });

  const CATEGORIES = metaData?.CATEGORIES ?? FALLBACK.CATEGORIES;
  const AMENITIES = metaData?.AMENITIES ?? FALLBACK.AMENITIES;
  const PLACE_TYPES = metaData?.PLACE_TYPES ?? FALLBACK.PLACE_TYPES;
  const SERVICES = metaData?.SERVICES ?? FALLBACK.SERVICES;

  /* ----- تحقق الخطوة 1 ----- */
  const requiredOkStep1 = useMemo(() => {
    if (mode === "place") {
      return (
        title.trim().length > 0 &&
        !!category &&
        !!placeType &&
        amenities.length > 0 &&
        address.trim().length > 0 &&
        about.trim().length > 0 &&
        categoryId.trim().length > 0 &&
        vendorId.trim().length > 0 &&
        tag.trim().length > 0
      );
    }
    // services — مطلوب category_id + vendor_id
    return (
      title.trim().length > 0 &&
      !!category &&
      about.trim().length > 0 &&
      categoryId.trim().length > 0 &&
      vendorId.trim().length > 0
    );
  }, [
    mode,
    title,
    category,
    placeType,
    amenities.length,
    address,
    about,
    categoryId,
    vendorId,
    tag,
  ]);

  /* ----- تحقق الخطوة 2 ----- */
  const requiredOkStep2 = useMemo(() => {
    if (mode === "place") {
      const w1 = Number(weekdayPrice);
      const w2 = Number(weekendPrice);
      return !Number.isNaN(w1) && w1 > 0 && !Number.isNaN(w2) && w2 > 0;
    }
    // services
    const d = serviceDuration.trim();
    const p = Number(servicePrice);
    const n = normalizeTime(noticePeriod);
    const c = capacity.trim();
    return (
      d.length > 0 && !Number.isNaN(p) && p > 0 && n.length > 0 && c.length > 0
    );
  }, [
    mode,
    weekdayPrice,
    weekendPrice,
    serviceDuration,
    servicePrice,
    noticePeriod,
    capacity,
  ]);

  /* ----- الصور ----- */
  const onPickImages = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    if (!picked.length) return;

    const cleaned: ImgItem[] = [];
    for (const f of picked) {
      if (!ALLOWED.includes(f.type)) continue;
      if (f.size > MAX_MB * 1024 * 1024) continue;
      const exists = images.some(
        (x) =>
          x.file.name === f.name &&
          x.file.size === f.size &&
          x.file.lastModified === f.lastModified
      );
      if (exists) continue;
      cleaned.push({ file: f, url: URL.createObjectURL(f) });
    }

    setImages((prev) => [...prev, ...cleaned].slice(0, MAX_COUNT));
    e.target.value = "";
  };

  const removeImage = (idx: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[idx].url);
      return prev.filter((_, i) => i !== idx);
    });
  };

  useEffect(() => {
    return () => images.forEach((img) => URL.revokeObjectURL(img.url));
  }, [images]);

  /* ----- تنقّل ----- */
  const goStep2 = () => setActiveStep(1);
  const goStep1 = () => setActiveStep(0);

  /* ----- إدارة تواريخ المدى ----- */
  useEffect(() => {
    if (rangeEnd && rangeStart && rangeEnd < rangeStart)
      setRangeEnd(rangeStart);
  }, [rangeStart, rangeEnd]);

  const addRange = () => {
    const price = Number(rangePrice);
    if (!rangeTitle.trim()) return alert("Please enter a title");
    if (!rangeStart || !rangeEnd)
      return alert("Please select start and end dates");
    if (rangeEnd < rangeStart)
      return alert("End date must be on or after start date");
    if (Number.isNaN(price) || price <= 0) return alert("Enter a valid price");

    setSpecialRanges((prev) =>
      prev.concat([
        {
          id: crypto.randomUUID(),
          title: rangeTitle.trim(),
          pricePerDay: price,
          start: rangeStart,
          end: rangeEnd,
        },
      ])
    );
    setRangeTitle("");
    setRangePrice("");
    setRangeStart("");
    setRangeEnd("");
    setDatesDialogOpen(false);
  };

  /* ---------- بناء FormData حسب الوضع ---------- */
  function buildPlaceFormData(): FormData {
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("address", address.trim());
    formData.append("description", about.trim());
    formData.append("weekday_price", weekdayPrice);
    formData.append("weekend_price", weekendPrice);

    formData.append("tag", tag.trim());
    formData.append("category_id", categoryId.trim());
    formData.append("vendor_id", vendorId.trim());

    // صور المكان كمصفوفة icon[0], icon[1]...
    images.forEach((img, i) => formData.append(`icon[${i}]`, img.file));
    // المواصفات كمصفوفة
    amenities.forEach((a, i) => formData.append(`amenities[${i}]`, a));
    // المدد الخاصة
    specialRanges.forEach((r, i) => {
      formData.append(`specialDays[${i}][title]`, r.title);
      formData.append(`specialDays[${i}][price]`, String(r.pricePerDay));
      formData.append(`specialDays[${i}][start_date]`, r.start);
      formData.append(`specialDays[${i}][end_date]`, r.end);
    });

    return formData;
  }

  function buildServiceFormData(): FormData {
    const formData = new FormData();
    // حسب cURL للخدمات: icon مفرد + المفاتيح التالية
    formData.append("title", title.trim());
    formData.append("max_capacity", capacity.trim());
    if (images[0]) formData.append("icon", images[0].file); // أول صورة فقط
    formData.append("description", about.trim());
    formData.append("price", servicePrice);
    formData.append("category_id", categoryId.trim());
    formData.append("vendor_id", vendorId.trim());
    formData.append("duration", serviceDuration.trim());
    formData.append("notice_period", normalizeTime(noticePeriod));
    return formData;
  }

  /* ---------- إرسال عبر axios + useMutation ---------- */
  type SubmitResponse = { id?: number; message?: string };

  async function submitCreate(vars: {
    kind: "place" | "services";
    formData: FormData;
  }): Promise<SubmitResponse> {
    if (vars.kind === "place") {
      const res = await api.post<SubmitResponse>(
        PATHS.createPlace,
        vars.formData
      );
      return res.data;
    }
    const res = await api.post<SubmitResponse>(
      PATHS.createService,
      vars.formData
    );
    return res.data;
  }

  const addMutation = useMutation({
    mutationFn: (vars: { kind: "place" | "services"; formData: FormData }) =>
      submitCreate(vars),
    onSuccess: () => {
      setSuccessOpen(true);
      navigate("/Account/posts"); // ← تم تغيير المسار هنا
    },
    onError: (error: unknown) => {
      console.error(
        "Submit error",
        (error as any)?.response?.status,
        (error as any)?.response?.data
      );
      setApiError(getAxiosErrorMessage(error));
    },
  });

  const handleAddPost = () => {
    setApiError("");
    if (!requiredOkStep2 || addMutation.isPending) return;

    const isService = mode === "services";
    const formData = isService ? buildServiceFormData() : buildPlaceFormData();

    addMutation.mutate({
      kind: isService ? "services" : "place",
      formData,
    });
  };

  /* ----- كتلة رفع الصور ----- */
  const ImagesBlock = (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {t("Upload Images")} (Max 5, jpg / jpeg / png)
      </Typography>
      <input
        id="post-images"
        type="file"
        accept="image/png,image/jpeg"
        multiple
        onChange={onPickImages}
        style={{ display: "none" }}
      />
      <Stack direction="row" gap={1} flexWrap="wrap">
        {images.map((img, i) => (
          <Box key={img.url} sx={{ position: "relative" }}>
            <Box
              component="img"
              src={img.url}
              alt={`img-${i}`}
              sx={{
                width: 84,
                height: 84,
                objectFit: "cover",
                borderRadius: 1,
              }}
            />
            <IconButton
              size="small"
              onClick={() => removeImage(i)}
              sx={{
                position: "absolute",
                top: -10,
                right: -10,
                bgcolor: "background.paper",
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}

        {images.length < MAX_COUNT && (
          <label
            htmlFor="post-images"
            style={
              {
                width: 84,
                height: 84,
                border: "1px dashed rgba(0,0,0,0.2)",
                borderRadius: 8,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                background: "#fff",
              } as React.CSSProperties
            }
          >
            <AddPhotoAlternateIcon />
          </label>
        )}
      </Stack>
    </Box>
  );

  return (
    <Box
      sx={{
        width: "100%", // ياخد كامل العرض
        px: { xs: 2, sm: 3, md: 4 }, // هوامش جانبية مرنة
        py: 2,
        minHeight: "100vh",
        bgcolor: COLORS.bg,
        boxSizing: "border-box",
        overflowX: "hidden", // منع أي سكرول عرضي شارد
      }}
    >
      {/* Back + Title */}
      <Stack direction="row" alignItems="center" spacing={1.25} mb={2}>
        <Box
          component="button"
          onClick={() => window.history.back()}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "50%",
            width: 36,
            height: 36,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            bgcolor: "#fff",
          }}
          aria-label="Back"
        >
          ←
        </Box>
        <Typography
          variant="subtitle1"
          fontWeight={700}
          color={COLORS.textDark}
        >
          {t("Add Post")}
        </Typography>
      </Stack>

      {/* تنبيه: Vendor ID مفقود */}
      {!vendorId && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Vendor ID غير موجود في <strong>localStorage("id")</strong>. تأكد من
          حفظه أثناء تسجيل الدخول.
        </Alert>
      )}

      {/* أخطاء API */}
      {apiError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {apiError}
        </Alert>
      ) : null}

      {/* Stepper */}
      <Box sx={{ position: "relative", mb: 3, px: 1 }}>
        <Box
          sx={{
            position: "absolute",
            top: 18,
            left: { xs: 28, sm: 42 }, // مرنة بدل أرقام ثابتة
            right: { xs: 28, sm: 42 },
            height: 2,
            bgcolor: COLORS.stepLine,
            zIndex: 0,
          }}
        />
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            ".MuiStepConnector-line": { display: "none" },
            ".MuiStepIcon-root": { color: COLORS.stepLine },
            ".Mui-active .MuiStepIcon-root, .Mui-completed .MuiStepIcon-root": {
              color: COLORS.primary,
            },
            ".MuiStepLabel-label": { mt: 0.5 },
            pointerEvents: "none",
          }}
        >
          <Step>
            <StepLabel>Step 1</StepLabel>
          </Step>
          <Step>
            <StepLabel>Step 2</StepLabel>
          </Step>
        </Stepper>
      </Box>

      {/* STEP 1 */}
      {activeStep === 0 && (
        <Paper
          sx={{
            p: 2.5,
            borderRadius: 2,
            boxShadow: COLORS.shadow,
            width: "100%", // يتمدّد مع كامل العرض
          }}
        >
          <Typography
            variant="h6"
            fontWeight={800}
            mb={2}
            color={COLORS.textDark}
          >
            Where you want to add post ad?
          </Typography>

          {/* Tabs */}
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Box
              role="button"
              onClick={() => setMode("place")}
              sx={{
                px: 4,
                py: 1.25,
                borderRadius: 2,
                bgcolor:
                  mode === "place" ? COLORS.primary : COLORS.pillInactive,
                color: mode === "place" ? "#fff" : "#4B5563",
                fontWeight: 700,
                boxShadow: mode === "place" ? COLORS.shadow : "none",
                userSelect: "none",
              }}
            >
              {t("Place")}
            </Box>
            <Box
              role="button"
              onClick={() => setMode("services")}
              sx={{
                px: 4,
                py: 1.25,
                borderRadius: 2,
                bgcolor:
                  mode === "services" ? COLORS.primary : COLORS.pillInactive,
                color: mode === "services" ? "#fff" : "#4B5563",
                fontWeight: 700,
                boxShadow: mode === "services" ? COLORS.shadow : "none",
                userSelect: "none",
              }}
            >
              {"Services"}
            </Box>
          </Box>

          {/* ====== تبويب ====== */}
          {mode === "place" ? (
            <Stack spacing={2}>
              <TextField
                id="title"
                label="Title Here*"
                placeholder="Royal Chalet Kuwait"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
              />

              {/* Category (select) */}
              <TextField
                id="category"
                select
                label="Select Category (Label)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                fullWidth
                helperText="للواجهة فقط. الإرسال يتم عبر Category ID بالأسفل."
                InputLabelProps={{ id: "category-label", htmlFor: "category" }}
                SelectProps={{ labelId: "category-label" }}
              >
                {CATEGORIES.map((c) => (
                  <MenuItem key={optValue(c)} value={optValue(c)}>
                    {optLabel(c)}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                id="category-id"
                label="Category ID*"
                type="number"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                fullWidth
              />

              {/* Place Type (select) */}
              <TextField
                id="place-type"
                select
                label="Place Type*"
                value={placeType}
                onChange={(e) => setPlaceType(e.target.value)}
                fullWidth
                InputLabelProps={{
                  id: "place-type-label",
                  htmlFor: "place-type",
                }}
                SelectProps={{ labelId: "place-type-label" }}
              >
                {PLACE_TYPES.map((t) => (
                  <MenuItem key={optValue(t)} value={optValue(t)}>
                    {optLabel(t)}
                  </MenuItem>
                ))}
              </TextField>

              {/* Amenities */}
              <FormControl fullWidth>
                <FormLabel id="amenities-label">Amenities*</FormLabel>
                <Box
                  role="button"
                  tabIndex={0}
                  aria-labelledby="amenities-label"
                  onClick={() => setAmenitiesOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      setAmenitiesOpen(true);
                  }}
                  sx={{
                    width: "100%",
                    mt: 0.5,
                    px: 2.5,
                    py: 1.25,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    cursor: "pointer",
                    bgcolor: "#fff",
                  }}
                >
                  {amenities.length ? (
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                      {amenities.map((id) => {
                        const a = AMENITIES.find((x) => x.id === id);
                        return <Chip key={id} label={a?.label ?? id} />;
                      })}
                    </Stack>
                  ) : (
                    t("Please Select")
                  )}
                </Box>
              </FormControl>

              <Dialog
                open={amenitiesOpen}
                onClose={() => setAmenitiesOpen(false)}
                fullWidth
              >
                <DialogTitle>Select Amenities</DialogTitle>
                <DialogContent dividers>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {AMENITIES.map((a) => {
                      const selected = amenities.includes(a.id);
                      return (
                        <Chip
                          key={a.id}
                          clickable
                          color={selected ? "primary" : "default"}
                          variant={selected ? "filled" : "outlined"}
                          label={a.label}
                          onClick={() =>
                            setAmenities((prev) =>
                              selected
                                ? prev.filter((x) => x !== a.id)
                                : prev.concat([a.id])
                            )
                          }
                        />
                      );
                    })}
                  </Stack>
                </DialogContent>
                <DialogActions>
                  <SecondaryBtn onClick={() => setAmenitiesOpen(false)}>
                    {t("Done")}
                  </SecondaryBtn>
                </DialogActions>
              </Dialog>

              <TextField
                id="address"
                label="Address*"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                fullWidth
              />
              <TextField
                id="about"
                label="About Place*"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                fullWidth
                multiline
                rows={4}
              />
              <TextField
                id="tag"
                label="Tag*"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                fullWidth
              />

              {ImagesBlock}

              <PrimaryBtn
                fullWidth
                disabled={!requiredOkStep1 || addMutation.isPending}
                onClick={goStep2}
              >
                {addMutation.isPending ? "Please wait..." : "Next"}
              </PrimaryBtn>
            </Stack>
          ) : (
            /* ======== SERVICES FORM ======== */
            <Stack spacing={2}>
              <TextField
                id="service-title"
                label="Title Here*"
                placeholder="Deep Cleaning"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
              />

              <TextField
                id="service-category"
                select
                label="Select Service (Label)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                fullWidth
                helperText="للواجهة فقط. الإرسال يتم عبر Category ID بالأسفل."
                InputLabelProps={{
                  id: "service-category-label",
                  htmlFor: "service-category",
                }}
                SelectProps={{ labelId: "service-category-label" }}
              >
                {SERVICES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                id="service-about"
                label="About Service*"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                fullWidth
                multiline
                rows={4}
                placeholder="Enter Here"
              />

              {/* ↓↓↓ مهم: Category ID فقط (Vendor ID يُجلب تلقائياً) */}
              <TextField
                id="service-category-id"
                label="Category ID*"
                type="number"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                fullWidth
              />

              {ImagesBlock}

              <PrimaryBtn
                fullWidth
                disabled={!requiredOkStep1 || addMutation.isPending}
                onClick={goStep2}
              >
                {addMutation.isPending ? "Please wait..." : "Next"}
              </PrimaryBtn>
            </Stack>
          )}
        </Paper>
      )}

      {/* STEP 2 — يظهر فقط بعد Next */}
      {activeStep === 1 && (
        <Paper
          sx={{
            p: 2.5,
            borderRadius: 2,
            boxShadow: COLORS.shadow,
            mt: 3,
            width: "100%", // يتمدّد مع كامل العرض
          }}
        >
          {mode === "place" ? (
            <Stack spacing={2}>
              <Typography
                id="weekday-price-label"
                variant="h6"
                fontWeight={800}
              >
                {t("Weekday price* (Sun to Wed)")}
              </Typography>
              <TextField
                id="weekday-price"
                aria-labelledby="weekday-price-label"
                placeholder="70.000"
                value={weekdayPrice}
                onChange={(e) => setWeekdayPrice(e.target.value)}
                type="number"
                inputProps={{ min: 0, step: "0.001" }}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">$</InputAdornment>
                  ),
                }}
              />

              <Typography
                id="weekend-price-label"
                variant="h6"
                fontWeight={800}
                sx={{ mt: 1 }}
              >
                {t("Weekend price* (Thu to Sat)")}
              </Typography>
              <TextField
                id="weekend-price"
                aria-labelledby="weekend-price-label"
                placeholder="56.000"
                value={weekendPrice}
                onChange={(e) => setWeekendPrice(e.target.value)}
                type="number"
                inputProps={{ min: 0, step: "0.001" }}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">$</InputAdornment>
                  ),
                }}
              />

              <Box sx={{ mt: 1 }}>
                <Typography variant="h6" fontWeight={800}>
                  {t("Special days (Optional)")}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  أضف عنوانًا وسعرًا لكل فترة، ثم اختر تاريخ البداية والنهاية.
                </Typography>

                <MUIButton
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setDatesDialogOpen(true)}
                  sx={{ borderRadius: 2 }}
                >
                  {t("Add Dates")}
                </MUIButton>

                {specialRanges.length > 0 ? (
                  <Stack gap={2} mt={2}>
                    {specialRanges.map((r) => (
                      <Box
                        key={r.id}
                        sx={{
                          pb: 1.5,
                          borderBottom: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Typography fontWeight={700}>{r.title}</Typography>
                          <IconButton
                            aria-label="remove"
                            onClick={() =>
                              setSpecialRanges((prev) =>
                                prev.filter((x) => x.id !== r.id)
                              )
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Typography variant="body2" color="text.secondary">
                            {r.start} to {r.end}
                          </Typography>
                          <Typography fontWeight={700}>
                            {r.pricePerDay.toFixed(3)} KD
                          </Typography>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                ) : null}

                <Dialog
                  open={datesDialogOpen}
                  onClose={() => setDatesDialogOpen(false)}
                  fullWidth
                  maxWidth="sm"
                >
                  <DialogTitle>Add special date range</DialogTitle>
                  <DialogContent dividers>
                    <Stack spacing={2}>
                      <TextField
                        id="range-title"
                        label="Title"
                        placeholder="Eid Prices"
                        value={rangeTitle}
                        onChange={(e) => setRangeTitle(e.target.value)}
                        fullWidth
                      />
                      <TextField
                        id="range-price"
                        label="Price/Day"
                        placeholder="1000.000"
                        value={rangePrice}
                        onChange={(e) => setRangePrice(e.target.value)}
                        type="number"
                        inputProps={{ min: 0, step: "0.001" }}
                        fullWidth
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">$</InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        id="range-start"
                        label="Start Date"
                        type="date"
                        value={rangeStart}
                        onChange={(e) => setRangeStart(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: todayYMD }}
                        fullWidth
                      />
                      <TextField
                        id="range-end"
                        label="End Date"
                        type="date"
                        value={rangeEnd}
                        onChange={(e) => setRangeEnd(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: rangeStart || todayYMD }}
                        fullWidth
                      />
                    </Stack>
                  </DialogContent>
                  <DialogActions>
                    <MUIButton onClick={() => setDatesDialogOpen(false)}>
                      Cancel
                    </MUIButton>
                    <MUIButton variant="contained" onClick={addRange}>
                      Add Dates
                    </MUIButton>
                  </DialogActions>
                </Dialog>
              </Box>

              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Note:</strong> Commission rate <strong>10%</strong> will
                be deducted from the price amount.
              </Typography>
              <Typography variant="body2">
                By posting an ad, you agree to our{" "}
                <strong>Term &amp; Conditions</strong>.
              </Typography>

              <Stack direction="row" gap={1} mt={1}>
                <SecondaryBtn onClick={goStep1} style={{ flex: 1 }}>
                  Back
                </SecondaryBtn>
                <PrimaryBtn
                  onClick={handleAddPost}
                  disabled={!requiredOkStep2 || addMutation.isPending}
                  style={{ flex: 1 }}
                >
                  {addMutation.isPending ? (
                    <Stack
                      direction="row"
                      alignItems="center"
                      gap={1}
                      justifyContent="center"
                    >
                      <CircularProgress size={18} />
                      <span>Submitting…</span>
                    </Stack>
                  ) : (
                    "Add Post"
                  )}
                </PrimaryBtn>
              </Stack>
            </Stack>
          ) : (
            /* ========= SERVICES STEP 2 ========= */
            <Stack spacing={2}>
              <TextField
                id="service-duration"
                label="Service Duration*"
                value={serviceDuration}
                onChange={(e) => setServiceDuration(e.target.value)}
                fullWidth
              />
              <TextField
                id="service-price"
                label="Service price*"
                value={servicePrice}
                onChange={(e) => setServicePrice(e.target.value)}
                type="number"
                inputProps={{ min: 0, step: "0.001" }}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">$</InputAdornment>
                  ),
                }}
              />
              <TextField
                id="notice-period"
                label="Notice period* (HH:MM or HH:MM:SS)"
                value={noticePeriod}
                onChange={(e) => setNoticePeriod(e.target.value)}
                fullWidth
                helperText={`Will be sent as ${normalizeTime(noticePeriod)}`}
              />
              <TextField
                id="capacity"
                label="Max Capacity*"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                fullWidth
              />

              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Note:</strong> Commission rate <strong>10%</strong> will
                be deducted from the price amount.
              </Typography>
              <Typography variant="body2">
                By Posting an ad, you agree to our{" "}
                <strong>Term &amp; Conditions</strong>.
              </Typography>

              <Stack direction="row" gap={1} mt={1}>
                <SecondaryBtn onClick={goStep1} style={{ flex: 1 }}>
                  Back
                </SecondaryBtn>
                <PrimaryBtn
                  onClick={handleAddPost}
                  disabled={!requiredOkStep2 || addMutation.isPending}
                  style={{ flex: 1 }}
                >
                  {addMutation.isPending ? "Submitting…" : "Add Service"}
                </PrimaryBtn>
              </Stack>
            </Stack>
          )}
        </Paper>
      )}
    </Box>
  );
}

/* EOF */
