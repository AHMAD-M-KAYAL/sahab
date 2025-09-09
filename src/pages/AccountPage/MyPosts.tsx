/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { type JSX } from "react";
import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  ButtonBase,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  Divider,
  CircularProgress,
  Alert,
  TextField,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AddIcon from "@mui/icons-material/Add";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import DescriptionIcon from "@mui/icons-material/Description";
import SettingsIcon from "@mui/icons-material/Settings";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

/* ========= ألوان وهوية بسيطة ========= */
const COLORS = {
  bg: "#F7F8FB",
  textSub: "#808090",
  primary: "#4A6CF7",
  cardShadow: "0 2px 12px rgba(16, 24, 40, 0.06)",
  pillActive: "#4A6CF7",
  statusOkBg: "#D9ECD9",
  statusOkText: "#2E7D32",
  statusMutedBg: "#E0E0E0",
  bookingOpen: "#2E7D32",
  bookingClosed: "#E53935",
  chipOkBg: "#E7F5EA",
  chipOkText: "#2E7D32",
  chipBadBg: "#FFE2E0",
  chipBadText: "#C62828",
};

type Kind = "place" | "service";

export type Post = {
  id: string;
  kind: Kind;
  title: string;
  type: string;
  coverUrl: string;
  postStatus: "active" | "inactive";
  bookingStatus: "open" | "closed";
};

type PlaceImage = { id?: number; image: string; place_id?: number };

type PlaceApiItem = {
  id: number;
  title: string;
  description?: string;
  address: string;
  area?: string;
  tag: string;
  weekday_price: number | string;
  weekend_price: number | string;
  category_id?: number | string;
  vendor_id?: number | string;
  available?: 0 | 1 | "0" | "1";
  bookable?: 0 | 1 | "0" | "1";
  featured?: 0 | 1 | "0" | "1";
  created_at?: string;
  rating?: string;
  place_images: PlaceImage[];
  bookings?: unknown[];
  icon?: string;
};

type ServiceImage = { image: string };

type ServiceApiItem = {
  id: number;
  title: string;
  description?: string;
  price?: number | string;
  category_id?: number | string;
  vendor_id?: number | string;
  available?: 0 | 1 | "0" | "1";
  bookable?: 0 | 1 | "0" | "1";
  icon?: string;
  images?: ServiceImage[];
  service_images?: ServiceImage[];
  max_capacity?: number | string;
  duration?: string | number;
  notice_period?: string;
};

/** ========= إعدادات API ========= */
const API_BASE = "https://sahab.ghinashop.net";

const PATHS = {
  places: {
    list: "/api/users/places/get-all",
    item: (id: string | number) => `/api/places/${id}`,
  },
  services: {
    list: "/api/users/services/get-all", // ← المسار الجديد
    item: (id: string | number) => `/api/services/${id}`,
  },
};

/** ========= axios instance ========= */
const api = axios.create({
  baseURL: API_BASE,
  headers: { Accept: "application/json" },
  withCredentials: false,
});

/** قراءة التوكين من localStorage */
function readToken(): string | null {
  try {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      (JSON.parse(localStorage.getItem("auth") || "{}")?.token ?? null)
    );
  } catch {
    return null;
  }
}

/** مساعد لضبط الهيدر مع Axios v1 */
function setHeader(
  headers: AxiosHeaders | Record<string, string>,
  name: string,
  value: string
) {
  if (headers && typeof (headers as AxiosHeaders).set === "function") {
    (headers as AxiosHeaders).set(name, value);
  } else {
    (headers as Record<string, string>)[name] = value;
  }
}

/** إضافة Authorization تلقائيًا لكل طلب */
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = readToken();
  if (token) {
    config.headers = config.headers ?? ({} as AxiosHeaders);
    const auth = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    setHeader(
      config.headers as AxiosHeaders | Record<string, string>,
      "Authorization",
      auth
    );
  }
  return config;
});

/** مساعد للحصول على كود الحالة */
function getStatus(err: unknown): number | undefined {
  return axios.isAxiosError(err) ? err.response?.status : undefined;
}

/** صور: رجّع رابط مطلق على نفس الدومين */
function toAbsoluteUrl(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return API_BASE + (url.startsWith("/") ? url : "/" + url);
}

/** تحويل عنصر مكان → Post */
function normalizePost(apiItem: PlaceApiItem): Post {
  const available = Number(apiItem.available ?? 1) === 1;
  const bookable = Number(apiItem.bookable ?? 1) === 1;

  return {
    id: String(apiItem.id),
    kind: "place",
    title: apiItem.title || "Untitled",
    type: apiItem.area || apiItem.tag || "Place",
    coverUrl: apiItem.place_images?.[0]?.image
      ? toAbsoluteUrl(apiItem.place_images[0].image)
      : apiItem.icon
      ? toAbsoluteUrl(apiItem.icon)
      : "https://picsum.photos/seed/fallback/800/600",
    postStatus: available ? "active" : "inactive",
    bookingStatus: bookable ? "open" : "closed",
  };
}

/** تحويل عنصر خدمة → Post */
function normalizeService(x: ServiceApiItem): Post {
  const available =
    Number((x as any).available ?? (x as any).status ?? 1) === 1;
  const bookable =
    Number((x as any).bookable ?? (x as any).is_bookable ?? 1) === 1;

  const firstImg =
    x.icon ||
    x.images?.[0]?.image ||
    x.service_images?.[0]?.image ||
    "https://picsum.photos/seed/service/800/600";

  return {
    id: String(x.id),
    kind: "service",
    title: x.title || "Untitled",
    type: "Service",
    coverUrl: toAbsoluteUrl(firstImg),
    postStatus: available ? "active" : "inactive",
    bookingStatus: bookable ? "open" : "closed",
  };
}

/** ====== API calls: PLACES ====== */
async function fetchPlacesApi(): Promise<Post[]> {
  try {
    const res = await api.get(PATHS.places.list);
    const data = res.data as any;

    let arr: PlaceApiItem[] = [];
    if (Array.isArray(data)) arr = data as PlaceApiItem[];
    else if (data && typeof data === "object") {
      if (Array.isArray(data.data)) arr = data.data as PlaceApiItem[];
      else if (Array.isArray(data.items)) arr = data.items as PlaceApiItem[];
    }

    if (!Array.isArray(arr)) throw new Error("Unexpected response shape");
    return arr.map(normalizePost);
  } catch (err: unknown) {
    const code = getStatus(err);
    if (code === 401)
      throw new Error("401 Unauthorized: تحقق من صلاحية التوكين.");
    throw new Error("Failed to load posts: " + (code ?? "ERR"));
  }
}

async function fetchPlaceDetailsApi(id: string): Promise<PlaceApiItem> {
  const res = await api.get(PATHS.places.item(id));
  const data = res.data as any;
  const item = (data?.data ?? data) as any;

  if (!item || typeof item !== "object") {
    throw new Error("Unexpected response");
  }

  return {
    id: Number(item.id),
    title: item.title ?? "",
    description: item.description ?? "",
    address: item.address ?? "",
    area: item.area ?? "",
    tag: item.tag ?? "",
    weekday_price: item.weekday_price ?? "",
    weekend_price: item.weekend_price ?? "",
    category_id: item.category_id ?? item.category?.id ?? "",
    vendor_id: item.vendor_id ?? item.vendor?.id ?? "",
    available: item.available ?? item.status ?? 1,
    bookable: item.bookable ?? 1,
    featured: item.featured ?? 0,
    created_at: item.created_at ?? "",
    rating: item.rating ?? "",
    place_images: item.place_images ?? item.images ?? [],
    bookings: item.bookings ?? [],
    icon: item.icon ?? undefined,
  };
}

function buildPlaceFormData(
  base: Partial<PlaceApiItem>,
  overrides?: Record<string, any>
): FormData {
  const fd = new FormData();

  const pick = (k: keyof PlaceApiItem, def = "") =>
    (overrides && overrides[k as string] !== undefined
      ? overrides[k as string]
      : (base as any)?.[k]) ?? def;

  fd.append("title", String(pick("title")));
  fd.append("address", String(pick("address")));
  fd.append("description", String(pick("description")));
  fd.append("weekday_price", String(pick("weekday_price", "")));
  fd.append("weekend_price", String(pick("weekend_price", "")));
  fd.append("tag", String(pick("tag", "")));
  if (pick("category_id", "") !== "")
    fd.append("category_id", String(pick("category_id", "")));
  if (pick("vendor_id", "") !== "")
    fd.append("vendor_id", String(pick("vendor_id", "")));

  if (overrides?.icon instanceof File) fd.append("icon", overrides.icon);
  if (overrides?.available !== undefined)
    fd.append("available", String(overrides.available));
  if (overrides?.bookable !== undefined)
    fd.append("bookable", String(overrides.bookable));
  if (overrides?.area !== undefined) fd.append("area", String(overrides.area));
  if (overrides?.featured !== undefined)
    fd.append("featured", String(overrides.featured));

  return fd;
}

async function deletePlaceApi(id: string): Promise<void> {
  try {
    await api.delete(PATHS.places.item(id));
  } catch (err: unknown) {
    const code = getStatus(err);
    if (code === 401) throw new Error("Unauthorized (login required).");
    throw new Error("Delete failed: " + (code ?? "ERR"));
  }
}

async function updatePlaceStatusApi(
  id: string,
  payload: { available?: 0 | 1; bookable?: 0 | 1 }
): Promise<void> {
  try {
    const base = await fetchPlaceDetailsApi(id);
    const fd = buildPlaceFormData(base, {
      available:
        payload.available !== undefined
          ? payload.available
          : base.available ?? 1,
      bookable:
        payload.bookable !== undefined ? payload.bookable : base.bookable ?? 1,
    });
    await api.post(PATHS.places.item(id), fd);
  } catch (err: unknown) {
    const code = getStatus(err);
    if (code === 401) throw new Error("Unauthorized (login required).");
    if (code === 422) throw new Error("Validation error (422).");
    throw new Error("Update failed: " + (code ?? "ERR"));
  }
}

async function updatePlaceApi(
  id: string,
  overrides: Partial<{
    title: string;
    description: string;
    address: string;
    area: string;
    tag: string;
    weekday_price: number | string;
    weekend_price: number | string;
    category_id: number | string;
    vendor_id: number | string;
    available: 0 | 1;
    bookable: 0 | 1;
    featured: 0 | 1;
    icon: File | null;
  }>
): Promise<void> {
  try {
    const base = await fetchPlaceDetailsApi(id);
    const fd = buildPlaceFormData(base, overrides);
    await api.post(PATHS.places.item(id), fd);
  } catch (err: unknown) {
    const code = getStatus(err);
    if (code === 401) throw new Error("Unauthorized (login required).");
    if (code === 422) throw new Error("Validation error (422).");
    throw new Error("Edit failed: " + (code ?? "ERR"));
  }
}

/** ====== API calls: SERVICES ====== */
async function fetchServicesApi(): Promise<Post[]> {
  try {
    const res = await api.get(PATHS.services.list);
    const data = res.data as any;

    let arr: ServiceApiItem[] = [];
    if (Array.isArray(data)) arr = data as ServiceApiItem[];
    else if (data && typeof data === "object") {
      if (Array.isArray(data.data)) arr = data.data as ServiceApiItem[];
      else if (Array.isArray(data.items)) arr = data.items as ServiceApiItem[];
      else if (Array.isArray(data.services))
        arr = data.services as ServiceApiItem[];
      else if (Array.isArray(data?.data?.services))
        arr = data.data.services as ServiceApiItem[];
    }

    if (!Array.isArray(arr)) throw new Error("Unexpected response shape");
    return arr.map(normalizeService);
  } catch (err: unknown) {
    const code = getStatus(err);
    if (code === 401)
      throw new Error("401 Unauthorized: تحقق من صلاحية التوكين.");
    throw new Error("Failed to load services: " + (code ?? "ERR"));
  }
}

async function fetchServiceDetailsApi(id: string): Promise<ServiceApiItem> {
  const res = await api.get(PATHS.services.item(id));
  const data = res.data as any;
  return (data?.data ?? data) as ServiceApiItem;
}

function buildServiceFormDataFromBase(
  base: Partial<ServiceApiItem>,
  overrides?: Record<string, any>
): FormData {
  const fd = new FormData();
  const pick = (k: keyof ServiceApiItem, def = "") =>
    (overrides && overrides[k as string] !== undefined
      ? overrides[k as string]
      : (base as any)?.[k]) ?? def;

  fd.append("title", String(pick("title")));
  fd.append("description", String(pick("description")));
  if (overrides?.icon instanceof File) fd.append("icon", overrides.icon);

  if (pick("price", "") !== "") fd.append("price", String(pick("price")));
  if (pick("category_id", "") !== "")
    fd.append("category_id", String(pick("category_id")));
  if (pick("vendor_id", "") !== "")
    fd.append("vendor_id", String(pick("vendor_id")));

  if (pick("max_capacity", "") !== "")
    fd.append("max_capacity", String(pick("max_capacity")));
  if (pick("duration", "") !== "")
    fd.append("duration", String(pick("duration")));
  if (pick("notice_period", "") !== "")
    fd.append("notice_period", String(pick("notice_period")));

  if (overrides?.available !== undefined)
    fd.append("available", String(overrides.available));
  if (overrides?.bookable !== undefined)
    fd.append("bookable", String(overrides.bookable));

  return fd;
}

async function updateServiceApi(
  id: string,
  overrides: Record<string, any>
): Promise<void> {
  const base = await fetchServiceDetailsApi(id);
  const fd = buildServiceFormDataFromBase(base, overrides);
  await api.post(PATHS.services.item(id), fd);
}

async function updateServiceStatusApi(
  id: string,
  payload: { available?: 0 | 1; bookable?: 0 | 1 }
): Promise<void> {
  const base = await fetchServiceDetailsApi(id);
  const fd = buildServiceFormDataFromBase(base, {
    available:
      payload.available !== undefined ? payload.available : base.available ?? 1,
    bookable:
      payload.bookable !== undefined ? payload.bookable : base.bookable ?? 1,
  });
  await api.post(PATHS.services.item(id), fd);
}

async function deleteServiceApi(id: string): Promise<void> {
  await api.delete(PATHS.services.item(id));
}

/* ===================== Component ===================== */
export default function MyPosts(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [tab, setTab] = React.useState<Kind>("place");

  // حذف
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [toDelete, setToDelete] = React.useState<Post | null>(null);

  // إدارة (status)
  const [manageOpen, setManageOpen] = React.useState(false);
  const [manageTarget, setManageTarget] = React.useState<Post | null>(null);
  const [draftPostActive, setDraftPostActive] = React.useState(true);
  const [draftBookingOpen, setDraftBookingOpen] = React.useState(true);

  // تعديل (Edit)
  const [editOpen, setEditOpen] = React.useState(false);
  const [editLoading, setEditLoading] = React.useState(false);
  const [editError, setEditError] = React.useState<string | null>(null);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [editKind, setEditKind] = React.useState<Kind>("place");
  const [editDraft, setEditDraft] = React.useState<{
    // مشترك
    title: string;
    description: string;
    category_id: string;
    vendor_id: string;
    available: boolean;
    bookable: boolean;
    iconFile: File | null;
    // مكان
    address: string;
    area: string;
    tag: string;
    weekday_price: string;
    weekend_price: string;
    // خدمة
    price: string;
    max_capacity: string;
    duration: string;
    notice_period: string;
  }>({
    title: "",
    description: "",
    category_id: "",
    vendor_id: "",
    available: true,
    bookable: true,
    iconFile: null,
    address: "",
    area: "",
    tag: "",
    weekday_price: "",
    weekend_price: "",
    price: "",
    max_capacity: "",
    duration: "",
    notice_period: "",
  });

  /** ====== useQuery: يعتمد على التبويب ====== */
  const {
    data: posts = [],
    isLoading,
    isError,
    error,
  } = useQuery<Post[], Error>({
    queryKey: ["posts", tab],
    queryFn: () => (tab === "place" ? fetchPlacesApi() : fetchServicesApi()),
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  /** ====== delete mutation (optimistic + refetch) ====== */
  const deleteMutation = useMutation<
    void,
    Error,
    { id: string; kind: Kind },
    { previous?: Post[] }
  >({
    mutationFn: ({ id, kind }) =>
      kind === "place" ? deletePlaceApi(id) : deleteServiceApi(id),
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: ["posts", tab] });
      const previous = queryClient.getQueryData<Post[]>(["posts", tab]);
      if (previous) {
        queryClient.setQueryData<Post[]>(
          ["posts", tab],
          previous.filter((p) => p.id !== vars.id)
        );
      }
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData<Post[]>(["posts", tab], ctx.previous);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["posts", tab] });
      await queryClient.refetchQueries({ queryKey: ["posts", tab] });
    },
  });

  /** ====== update (Manage) mutation (optimistic) ====== */
  const updateStatusMutation = useMutation<
    void,
    Error,
    { id: string; kind: Kind; available: 0 | 1; bookable: 0 | 1 },
    { previous?: Post[] }
  >({
    mutationFn: ({ id, kind, available, bookable }) =>
      kind === "place"
        ? updatePlaceStatusApi(id, { available, bookable })
        : updateServiceStatusApi(id, { available, bookable }),
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: ["posts", tab] });
      const previous = queryClient.getQueryData<Post[]>(["posts", tab]);
      if (previous) {
        queryClient.setQueryData<Post[]>(
          ["posts", tab],
          previous.map((p) =>
            p.id === vars.id
              ? {
                  ...p,
                  postStatus: vars.available === 1 ? "active" : "inactive",
                  bookingStatus: vars.bookable === 1 ? "open" : "closed",
                }
              : p
          )
        );
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData<Post[]>(["posts", tab], context.previous);
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["posts", tab] });
      await queryClient.refetchQueries({ queryKey: ["posts", tab] });
    },
  });

  /** ====== edit (POST multipart) mutation ====== */
  const editMutation = useMutation<
    void,
    Error,
    { id: string; kind: Kind; body: any }
  >({
    mutationFn: ({ id, kind, body }) =>
      kind === "place" ? updatePlaceApi(id, body) : updateServiceApi(id, body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["posts", tab] });
      await queryClient.refetchQueries({ queryKey: ["posts", tab] });
    },
  });

  // تجميع رسالة الخطأ
  const globalError =
    (isError && (error?.message ?? "")) ||
    deleteMutation.error?.message ||
    updateStatusMutation.error?.message ||
    editMutation.error?.message ||
    "";

  const goBack = () => navigate(-1);
  const handleAdd = () => navigate("/Account/posts/new");

  const askDelete = (p: Post) => {
    setToDelete(p);
    setConfirmOpen(true);
  };
  const cancelDelete = () => {
    if (deleteMutation.isPending) return;
    setConfirmOpen(false);
    setToDelete(null);
  };
  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteMutation.mutateAsync({
        id: toDelete.id,
        kind: toDelete.kind,
      });
    } finally {
      setConfirmOpen(false);
      setToDelete(null);
    }
  };

  const openManage = (p: Post) => {
    setManageTarget(p);
    setDraftPostActive(p.postStatus === "active");
    setDraftBookingOpen(p.bookingStatus === "open");
    setManageOpen(true);
  };
  const closeManage = () => {
    if (updateStatusMutation.isPending) return;
    setManageOpen(false);
    setManageTarget(null);
  };

  const saveManage = () => {
    if (!manageTarget) return;
    updateStatusMutation.mutate(
      {
        id: manageTarget.id,
        kind: manageTarget.kind,
        available: draftPostActive ? 1 : 0,
        bookable: draftBookingOpen ? 1 : 0,
      },
      {
        onSuccess: () => {
          setManageOpen(false);
          setManageTarget(null);
        },
      }
    );
  };

  /** ====== Edit flow ====== */
  const openEdit = async (p: Post) => {
    setEditOpen(true);
    setEditError(null);
    setEditLoading(true);
    setEditId(p.id);
    setEditKind(p.kind);
    try {
      if (p.kind === "place") {
        const d = await fetchPlaceDetailsApi(p.id);
        setEditDraft({
          title: d.title ?? "",
          description: d.description ?? "",
          category_id: d.category_id ? String(d.category_id) : "",
          vendor_id: d.vendor_id ? String(d.vendor_id) : "",
          available: Number(d.available ?? 1) === 1,
          bookable: Number(d.bookable ?? 1) === 1,
          iconFile: null,
          address: d.address ?? "",
          area: d.area ?? "",
          tag: d.tag ?? "",
          weekday_price:
            d.weekday_price !== undefined ? String(d.weekday_price) : "",
          weekend_price:
            d.weekend_price !== undefined ? String(d.weekend_price) : "",
          price: "",
          max_capacity: "",
          duration: "",
          notice_period: "",
        });
      } else {
        const s = await fetchServiceDetailsApi(p.id);
        setEditDraft({
          title: s.title ?? "",
          description: s.description ?? "",
          category_id: s.category_id ? String(s.category_id) : "",
          vendor_id: s.vendor_id ? String(s.vendor_id) : "",
          available:
            Number((s as any).available ?? (s as any).status ?? 1) === 1,
          bookable:
            Number((s as any).bookable ?? (s as any).is_bookable ?? 1) === 1,
          iconFile: null,
          // place-specific (فارغة)
          address: "",
          area: "",
          tag: "",
          weekday_price: "",
          weekend_price: "",
          // service-specific
          price: s.price !== undefined ? String(s.price) : "",
          max_capacity:
            s.max_capacity !== undefined ? String(s.max_capacity) : "",
          duration: s.duration !== undefined ? String(s.duration) : "",
          notice_period: s.notice_period ?? "",
        });
      }
    } catch (e: any) {
      setEditError(e?.message ?? "Failed to load details");
    } finally {
      setEditLoading(false);
    }
  };

  const closeEdit = () => {
    if (editMutation.isPending) return;
    setEditOpen(false);
    setEditId(null);
    setEditError(null);
  };

  const saveEdit = () => {
    if (!editId) return;

    if (editKind === "place") {
      editMutation.mutate(
        {
          id: editId,
          kind: "place",
          body: {
            title: editDraft.title,
            description: editDraft.description,
            address: editDraft.address,
            area: editDraft.area || undefined,
            tag: editDraft.tag,
            weekday_price:
              editDraft.weekday_price === ""
                ? undefined
                : editDraft.weekday_price,
            weekend_price:
              editDraft.weekend_price === ""
                ? undefined
                : editDraft.weekend_price,
            category_id: editDraft.category_id,
            vendor_id: editDraft.vendor_id,
            available: editDraft.available ? 1 : 0,
            bookable: editDraft.bookable ? 1 : 0,
            icon: editDraft.iconFile ?? undefined,
          },
        },
        {
          onSuccess: () => {
            setEditOpen(false);
            setEditId(null);
          },
        }
      );
    } else {
      editMutation.mutate(
        {
          id: editId,
          kind: "service",
          body: {
            title: editDraft.title,
            description: editDraft.description,
            price: editDraft.price === "" ? undefined : editDraft.price,
            category_id: editDraft.category_id,
            vendor_id: editDraft.vendor_id,
            max_capacity:
              editDraft.max_capacity === ""
                ? undefined
                : editDraft.max_capacity,
            duration:
              editDraft.duration === "" ? undefined : editDraft.duration,
            notice_period:
              editDraft.notice_period === ""
                ? undefined
                : editDraft.notice_period,
            available: editDraft.available ? 1 : 0,
            bookable: editDraft.bookable ? 1 : 0,
            icon: editDraft.iconFile ?? undefined,
          },
        },
        {
          onSuccess: () => {
            setEditOpen(false);
            setEditId(null);
          },
        }
      );
    }
  };

  const visiblePosts = posts;
  const empty = !isLoading && visiblePosts.length === 0;

  return (
    <Box
      sx={{
        bgcolor: COLORS.bg,
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      <Box
        sx={{
          width: "100%", // ياخد كامل العرض
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 }, // مسافات جانبية (gutter)
          pt: 2,
          pb: 8,
          boxSizing: "border-box",
          overflowX: "hidden", // احتياط ضد أي سكرول عرضي
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <IconButton
              edge="start"
              onClick={goBack}
              size="small"
              sx={{ border: "1px solid #E5E7EB" }}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {t("My Posts")}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{ borderRadius: 2 }}
          >
            Add
          </Button>
        </Box>

        {/* Tabs */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <ButtonBase
            onClick={() => setTab("place")}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              bgcolor: tab === "place" ? COLORS.pillActive : "#DDE1EA",
              color: tab === "place" ? "#fff" : "#4B5563",
              fontWeight: 700,
              boxShadow: tab === "place" ? COLORS.cardShadow : "none",
              transition: "all .15s",
            }}
          >
            {t("Place")}
          </ButtonBase>
          <ButtonBase
            onClick={() => setTab("service")}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              bgcolor: tab === "service" ? COLORS.pillActive : "#DDE1EA",
              color: tab === "service" ? "#fff" : "#4B5563",
              fontWeight: 700,
              boxShadow: tab === "service" ? COLORS.cardShadow : "none",
              transition: "all .15s",
            }}
          >
            {t("Services")}
          </ButtonBase>
        </Box>

        {/* حالات التحميل/الخطأ */}
        {isLoading && (
          <Box sx={{ display: "grid", placeItems: "center", py: 10 }}>
            <CircularProgress />
            <Typography sx={{ mt: 2, color: COLORS.textSub }}>
              Loading {tab === "place" ? t("places") : t("services")}…
            </Typography>
          </Box>
        )}

        {!isLoading && globalError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {globalError}
          </Alert>
        )}

        {/* Empty state */}
        {empty && (
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              bgcolor: "#fff",
              boxShadow: COLORS.cardShadow,
              py: { xs: 6, md: 8 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              mx: { xs: 1, md: 12 },
              mt: { xs: 8, md: 12 },
            }}
          >
            <BlockOutlinedIcon
              sx={{ fontSize: 42, color: COLORS.primary, mb: 1 }}
            />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {tab === "place" ? t("No Place added") : t("No Service added")}
            </Typography>
          </Paper>
        )}

        {/* Posts list */}
        {!isLoading && !empty && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr" },
              gap: 2.5,
              mt: 2,
            }}
          >
            {visiblePosts.map((p) => (
              <PostCard
                key={p.id}
                post={p}
                onManage={() => openManage(p)}
                onEdit={() => openEdit(p)}
                onDelete={() => askDelete(p)}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={cancelDelete}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          {t("Delete")}{" "}
          {toDelete?.kind === "service" ? t("Service") : t("Place")}
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 1.5 }}>
          <Typography sx={{ mb: 1 }}>
            {t("Are you sure want to delete this")}{" "}
            {toDelete?.kind === "service" ? "service" : "place"}?
          </Typography>
          <Typography color="text.secondary">
            {t("Deleting will not affect any previous bookings")}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={cancelDelete}
            sx={{ fontWeight: 800 }}
            color="inherit"
            disabled={deleteMutation.isPending}
          >
            {t("NO")}
          </Button>
          <Button
            variant="contained"
            onClick={confirmDelete}
            disabled={deleteMutation.isPending}
            sx={{ borderRadius: 2, px: 3, bgcolor: COLORS.primary }}
          >
            {deleteMutation.isPending ? "Deleting..." : t("Yes")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Manage Bottom Sheet */}
      <Dialog
        open={manageOpen}
        onClose={closeManage}
        fullWidth
        maxWidth="sm"
        sx={{ "& .MuiDialog-container": { alignItems: "flex-end" } }}
        PaperProps={{
          sx: {
            m: 0,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            boxShadow: "0 -8px 24px rgba(16,24,40,0.18)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1.5 }}>
          Manage {manageTarget?.kind === "service" ? t("Service") : t("Place")}
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <Box sx={{ py: 1.5 }}>
            {/* Post Status chip بخلفية ملوّنة */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 800, mb: 0.5 }}>
                  {t("Post Status")}
                </Typography>
                <Box
                  sx={{
                    display: "inline-block",
                    px: 1.25,
                    py: 0.5,
                    borderRadius: 999,
                    bgcolor: draftPostActive
                      ? COLORS.chipOkBg
                      : COLORS.chipBadBg,
                    color: draftPostActive
                      ? COLORS.chipOkText
                      : COLORS.chipBadText,
                    fontWeight: 700,
                  }}
                >
                  {draftPostActive ? t("Active") : t("Inactive")}
                </Box>
              </Box>
              <Switch
                checked={draftPostActive}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDraftPostActive(e.target.checked)
                }
                color="success"
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Booking Status (كما هو) */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 800, mb: 0.5 }}>
                  {t("Booking Status")}
                </Typography>
                <Box
                  sx={{
                    display: "inline-block",
                    px: 1.25,
                    py: 0.5,
                    borderRadius: 999,
                    bgcolor: draftBookingOpen
                      ? COLORS.chipOkBg
                      : COLORS.chipBadBg,
                    color: draftBookingOpen
                      ? COLORS.chipOkText
                      : COLORS.chipBadText,
                    fontWeight: 700,
                  }}
                >
                  {draftBookingOpen
                    ? t("Open for Booking")
                    : t("Closed for Booking")}
                </Box>
              </Box>
              <Switch
                checked={draftBookingOpen}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDraftBookingOpen(e.target.checked)
                }
                color="success"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={saveManage}
            disabled={updateStatusMutation.isPending}
            sx={{
              borderRadius: 2,
              bgcolor: COLORS.primary,
              py: 1.25,
              fontWeight: 700,
            }}
          >
            {updateStatusMutation.isPending ? "Saving..." : "Done"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editOpen}
        onClose={closeEdit}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          Edit {editKind === "place" ? "Place" : "Service"}
        </DialogTitle>
        <DialogContent dividers>
          {editLoading ? (
            <Box sx={{ display: "grid", placeItems: "center", py: 6 }}>
              <CircularProgress />
              <Typography sx={{ mt: 2, color: COLORS.textSub }}>
                Loading details…
              </Typography>
            </Box>
          ) : (
            <>
              {editError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {editError}
                </Alert>
              )}

              <Box sx={{ display: "grid", gap: 2, mt: 1 }}>
                {/* مشترك */}
                <TextField
                  label="Title"
                  value={editDraft.title}
                  onChange={(e) =>
                    setEditDraft((d) => ({ ...d, title: e.target.value }))
                  }
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Description"
                  value={editDraft.description}
                  onChange={(e) =>
                    setEditDraft((d) => ({ ...d, description: e.target.value }))
                  }
                  fullWidth
                  size="small"
                  multiline
                  minRows={3}
                />
                <TextField
                  label="Category ID"
                  type="number"
                  value={editDraft.category_id}
                  onChange={(e) =>
                    setEditDraft((d) => ({ ...d, category_id: e.target.value }))
                  }
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Vendor ID"
                  type="number"
                  value={editDraft.vendor_id}
                  onChange={(e) =>
                    setEditDraft((d) => ({ ...d, vendor_id: e.target.value }))
                  }
                  fullWidth
                  size="small"
                />

                {/* رفع أيقونة (اختياري) */}
                <Box>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    Icon (optional)
                  </Typography>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      setEditDraft((d) => ({ ...d, iconFile: file }));
                    }}
                  />
                </Box>

                {/* حقول المكان */}
                {editKind === "place" && (
                  <>
                    <TextField
                      label="Address"
                      value={editDraft.address}
                      onChange={(e) =>
                        setEditDraft((d) => ({ ...d, address: e.target.value }))
                      }
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Area (optional)"
                      value={editDraft.area}
                      onChange={(e) =>
                        setEditDraft((d) => ({ ...d, area: e.target.value }))
                      }
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Tag"
                      value={editDraft.tag}
                      onChange={(e) =>
                        setEditDraft((d) => ({ ...d, tag: e.target.value }))
                      }
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Weekday Price"
                      type="number"
                      value={editDraft.weekday_price}
                      onChange={(e) =>
                        setEditDraft((d) => ({
                          ...d,
                          weekday_price: e.target.value,
                        }))
                      }
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Weekend Price"
                      type="number"
                      value={editDraft.weekend_price}
                      onChange={(e) =>
                        setEditDraft((d) => ({
                          ...d,
                          weekend_price: e.target.value,
                        }))
                      }
                      fullWidth
                      size="small"
                    />
                  </>
                )}

                {/* حقول الخدمة */}
                {editKind === "service" && (
                  <>
                    <TextField
                      label="Price"
                      type="number"
                      value={editDraft.price}
                      onChange={(e) =>
                        setEditDraft((d) => ({ ...d, price: e.target.value }))
                      }
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Max Capacity"
                      type="number"
                      value={editDraft.max_capacity}
                      onChange={(e) =>
                        setEditDraft((d) => ({
                          ...d,
                          max_capacity: e.target.value,
                        }))
                      }
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Duration"
                      value={editDraft.duration}
                      onChange={(e) =>
                        setEditDraft((d) => ({
                          ...d,
                          duration: e.target.value,
                        }))
                      }
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Notice Period (HH:MM:SS)"
                      value={editDraft.notice_period}
                      onChange={(e) =>
                        setEditDraft((d) => ({
                          ...d,
                          notice_period: e.target.value,
                        }))
                      }
                      fullWidth
                      size="small"
                    />
                  </>
                )}

                <Divider sx={{ my: 1 }} />

                {/* Chips ملونة للحالة – نفس تجربة Manage */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography>Post Status (available)</Typography>
                    <Box
                      sx={{
                        display: "inline-block",
                        mt: 0.5,
                        px: 1.25,
                        py: 0.5,
                        borderRadius: 999,
                        bgcolor: editDraft.available
                          ? COLORS.chipOkBg
                          : COLORS.chipBadBg,
                        color: editDraft.available
                          ? COLORS.chipOkText
                          : COLORS.chipBadText,
                        fontWeight: 700,
                      }}
                    >
                      {editDraft.available ? "Active" : "Inactive"}
                    </Box>
                  </Box>
                  <Switch
                    checked={editDraft.available}
                    onChange={(e) =>
                      setEditDraft((d) => ({
                        ...d,
                        available: e.target.checked,
                      }))
                    }
                    color="success"
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography>Booking Status (bookable)</Typography>
                    <Box
                      sx={{
                        display: "inline-block",
                        mt: 0.5,
                        px: 1.25,
                        py: 0.5,
                        borderRadius: 999,
                        bgcolor: editDraft.bookable
                          ? COLORS.chipOkBg
                          : COLORS.chipBadBg,
                        color: editDraft.bookable
                          ? COLORS.chipOkText
                          : COLORS.chipBadText,
                        fontWeight: 700,
                      }}
                    >
                      {editDraft.bookable
                        ? t("Open for Booking")
                        : t("Closed for Booking")}
                    </Box>
                  </Box>
                  <Switch
                    checked={editDraft.bookable}
                    onChange={(e) =>
                      setEditDraft((d) => ({
                        ...d,
                        bookable: e.target.checked,
                      }))
                    }
                    color="success"
                  />
                </Box>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={closeEdit}
            sx={{ fontWeight: 800 }}
            color="inherit"
            disabled={editMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={saveEdit}
            disabled={editMutation.isPending || editLoading || !!editError}
            sx={{ borderRadius: 2, px: 3, bgcolor: COLORS.primary }}
          >
            {editMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

/* ========= بطاقة بوست واحدة ========= */
function PostCard({
  post,
  onManage,
  onEdit,
  onDelete,
}: {
  post: Post;
  onManage: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const isOpen = post.bookingStatus === "open";
  const isActive = post.postStatus === "active";

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: "#fff",
        borderRadius: 3,
        boxShadow: COLORS.cardShadow,
        p: 2,
        width: "100%", // يتمدّد داخل الشبكة
        boxSizing: "border-box",
      }}
    >
      {/* صورة */}
      <Box sx={{ borderRadius: 2.5, overflow: "hidden", height: 180, mb: 1.5 }}>
        <Box
          component="img"
          src={post.coverUrl}
          alt={post.title}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </Box>

      {/* عنوان ونوع */}
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 800, color: "#0F2340" }}
      >
        {post.title}
      </Typography>
      <Typography variant="body2" sx={{ color: COLORS.textSub, mb: 1.5 }}>
        {post.type}
      </Typography>

      {/* حالة البوست/الحجز */}
      <Box
        sx={{
          bgcolor: isOpen ? COLORS.statusOkBg : COLORS.statusMutedBg,
          borderRadius: 2,
          p: 2,
          mb: 2,
        }}
      >
        <Typography sx={{ fontWeight: 700, mb: 0.75 }}>Post Status</Typography>
        <Box
          sx={{
            display: "inline-block",
            px: 1.25,
            py: 0.5,
            borderRadius: 999,
            bgcolor: isActive ? COLORS.chipOkBg : COLORS.chipBadBg,
            color: isActive ? COLORS.chipOkText : COLORS.chipBadText,
            fontWeight: 700,
            mb: 1,
          }}
        >
          {isActive ? t("Active") : t("Inactive")}
        </Box>

        <Typography sx={{ fontWeight: 700, mb: 0.75 }}>
          {t("Booking Status")}
        </Typography>
        <Box
          sx={{
            display: "inline-block",
            px: 1.25,
            py: 0.5,
            borderRadius: 999,
            bgcolor: isOpen ? COLORS.chipOkBg : COLORS.chipBadBg,
            color: isOpen ? COLORS.chipOkText : COLORS.chipBadText,
            fontWeight: 700,
          }}
        >
          {isOpen ? t("Open For booking") : t("Closed For booking")}
        </Box>
      </Box>

      {/* أزرار الإجراءات */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 2,
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Details: نرجع لنفس صفحة التفاصيل ونمرر النوع */}
        <ButtonBase
          component={Link}
          to={`/Account/posts/${post.id}/details`}
          state={{ post, kind: post.kind }}
          sx={{ textDecoration: "none", color: "inherit" }}
        >
          <ActionIcon
            label="Details"
            color="#4768B1"
            bg="#E5ECFA"
            onClick={() => {}}
          >
            <DescriptionIcon />
          </ActionIcon>
        </ButtonBase>

        <ActionIcon
          label="Manage"
          color="#2E7D32"
          bg="#E7F5EA"
          onClick={onManage}
        >
          <SettingsIcon />
        </ActionIcon>

        <ActionIcon label="Edit" color="#B08900" bg="#FFF3CD" onClick={onEdit}>
          <EditIcon />
        </ActionIcon>

        <ActionIcon
          label="Delete"
          color="#C62828"
          bg="#FFE2E0"
          onClick={onDelete}
        >
          <DeleteIcon />
        </ActionIcon>
      </Box>
    </Paper>
  );
}

/* ========= زر أكشن دائري مع نص تحت ========= */
function ActionIcon({
  label,
  color,
  bg,
  onClick,
  children,
}: {
  label: string;
  color: string;
  bg: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Box onClick={onClick} sx={{ cursor: "pointer" }}>
      <Box
        sx={{
          width: 48,
          height: 48,
          mx: "auto",
          borderRadius: "50%",
          bgcolor: bg,
          color: color,
          display: "grid",
          placeItems: "center",
          mb: 0.75,
        }}
      >
        {children}
      </Box>
      <Typography variant="body2">{label}</Typography>
    </Box>
  );
}
