import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../services/api-client";
import { useForm } from "react-hook-form";
import { Box, Button, TextField, Avatar, ButtonBase } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import Succsess from "../../message/Succsess";
import Failed from "../../message/Failed";
import { useState } from "react";
import IconBack from "../../assets/logo/back.svg";
import {
  EditAccountSchema,
  type EditAccountSchemaFormData,
} from "../../schema/EditAccountSchema";
import { useNavigate } from "react-router-dom";

// مكوّن داخلي لرفع الصورة + معاينة
function UploadAvatar({
  onFileSelect,
  previewSrc,
}: {
  onFileSelect: (file: File | null) => void;
  previewSrc: string | undefined;
}) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    onFileSelect(file);
  };

  return (
    <ButtonBase
      component="label"
      role={undefined}
      tabIndex={-1}
      aria-label="Avatar image"
      sx={{
        borderRadius: "40px",
        "&:has(:focus-visible)": {
          outline: "2px solid",
          outlineOffset: "2px",
        },
      }}
    >
      <Avatar
        alt="Upload new avatar"
        src={previewSrc}
        sx={{ width: 96, height: 96 }}
      />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{
          border: 0,
          clip: "rect(0 0 0 0)",
          height: "1px",
          margin: "-1px",
          overflow: "hidden",
          padding: 0,
          position: "absolute",
          whiteSpace: "nowrap",
          width: "1px",
        }}
        onChange={handleAvatarChange}
      />
    </ButtonBase>
  );
}

const EditAccount = () => {
  const userName = localStorage.getItem("userName") ?? "";
  const userPhone = localStorage.getItem("userPhone") ?? "";
  const userEmail = localStorage.getItem("email") ?? "";
  // const userImage = localStorage.getItem("image") ?? "";
  const id = localStorage.getItem("id");
  const queryClient = useQueryClient();

  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue, // لتمرير الملف إلى RHF
  } = useForm<EditAccountSchemaFormData>({
    resolver: zodResolver(EditAccountSchema),
    defaultValues: {
      name: userName,
      phone: userPhone,
      email: userEmail,
    },
  });

  const [succsess, setSuccsess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string | undefined>(undefined); // معاينة الصورة
  const [avatarFile, setAvatarFile] = useState<File | null>(null); // الملف المختار

  const mutation = useMutation({
    mutationKey: ["EditAccount"],
    mutationFn: (formData: FormData) =>
      apiClient.post(`/api/users/${id}`, formData).then((res) => res.data),

    onSuccess: (_data, variables) => {
      // variables هو FormData
      const submittedName = (variables.get("name") as string) || "";
      localStorage.setItem("userName", submittedName);

      const token = _data?.token;
      if (token) localStorage.setItem("token", token);
      const api = _data?.data ?? _data; // دعم شكلين شائعين

      const message = api?.message ?? api; // أحيانًا تحت message

      const imageUrl =
        message?.user?.image ??
        message?.image ??
        api?.user?.image ??
        api?.image ??
        null;

      if (imageUrl) {
        localStorage.setItem("image", String(imageUrl));
      }
      queryClient.invalidateQueries({ queryKey: ["me"] });

      setSuccsess(true);
      setTimeout(() => setSuccsess(false), 2000);
      navigate("/EditingSuccessful");
    },

    onError: () => {
      setFailed(true);
      setTimeout(() => setFailed(false), 2000);
      navigate("/EditingFailed");
    },
  });

  // عند اختيار صورة: اعمل معاينة + مرر الملف إلى RHF (كـ FileList اصطناعي)
  const handleSelectAvatar = (file: File | null) => {
    setAvatarFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatarSrc(reader.result as string);
      reader.readAsDataURL(file);

      // خلق FileList اصطناعي ليتوافق مع RHF/Zod إن احتجتِ
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const fileList = dataTransfer.files;
      // لو سكيمتك تتحقق من image، مرّري FileList
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setValue("image" as any, fileList as any, { shouldValidate: true });
    } else {
      setAvatarSrc(undefined);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setValue("image" as any, undefined as any, { shouldValidate: true });
    }
  };

  const onSubmit = (data: EditAccountSchemaFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("phone", data.phone);
    formData.append("email", data.email);

    // أرسلي الملف المختار إن وُجد
    if (avatarFile) {
      formData.append("image", avatarFile);
    }
    mutation.mutate(formData);
  };

  return (
    <>
      <nav
        className="navbar"
        style={{
          backgroundColor: "white",
          boxShadow: "0 4px 16px 0 rgba(0,0,0,0.10)",
          direction: "ltr",
        }}
      >
        <Box
          component={Button}
          onClick={() => {
            navigate("/Account");
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
      </nav>
      <Box
        onSubmit={handleSubmit(onSubmit)}
        component="form"
        sx={{
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          py: 4,
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "Poppins",
            fontSize: { xs: "20px", sm: "30px" },
            fontWeight: "600",
          }}
        >
          {t("EditAccount")}
        </Box>

        {/* Avatar upload + preview */}
        <UploadAvatar
          onFileSelect={handleSelectAvatar}
          previewSrc={avatarSrc}
        />
        {errors.image && (
          <span style={{ color: "red", marginTop: 4 }}>
            {String(errors.image.message)}
          </span>
        )}

        {/* name */}
        <TextField
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register("name")}
          id="name"
          label={t("name")}
          type="text"
          sx={{ width: { xs: "200px", md: "300px", lg: "400px" } }}
        />

        {/* phone */}
        <TextField
          error={!!errors.phone}
          helperText={errors.phone?.message}
          {...register("phone")}
          id="phone"
          label={t("phone")}
          value={userPhone}
          disabled
          type="text"
          sx={{ width: { xs: "200px", md: "300px", lg: "400px" } }}
        />

        {/* email */}
        <TextField
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register("email")}
          id="email"
          label={t("email")}
          type="text"
          sx={{ width: { xs: "200px", md: "300px", lg: "400px" } }}
        />

        <Button
          type="submit"
          variant="contained"
          sx={{
            width: { xs: "200px", md: "300px", lg: "400px" },
            mt: "12px",
            fontSize: "18px",
            backgroundColor: "var(--main-color)",
          }}
        >
          {t("EditAccount")}
        </Button>

        {succsess && <Succsess seccsessfulMessage={t("createUser")} />}
        {failed && <Failed errorMessage={t("errorCreateUser")} />}
      </Box>
    </>
  );
};

export default EditAccount;
