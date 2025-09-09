import { useMutation } from "@tanstack/react-query";
import apiClient from "../services/api-client";
import { useForm } from "react-hook-form";
import { Box, Button, TextField } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import sahab from "../assets/logo/sahab-logo-md.svg";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Succsess from "../components/message/Succsess";
import Failed from "../components/message/Failed";
import { useState } from "react";
import {
  registerSchema,
  type registerSchemaFormData,
} from "../schema/registerSchema";

const Register = () => {
  const phone = localStorage.getItem("userPhone");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<registerSchemaFormData>({
    resolver: zodResolver(registerSchema),
  });
  const [succsess, setSuccsess] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);

  const mutation = useMutation({
    mutationKey: ["register"],
    mutationFn: (data: registerSchemaFormData) => {
      return apiClient.post("api/users", data).then((res) => res.data);
    },
    onSuccess: (_data, variables) => {
      const user = _data?.user;

      const id = String(user?.id);
      if (id) localStorage.setItem("id", id);
      console.log("API response:", _data);

      const name = variables?.name ?? user?.name ?? "";
      const email = variables?.email ?? user?.email ?? "";
      const phone = variables?.phone ?? localStorage.getItem("userPhone") ?? "";

      localStorage.setItem("userName", name);
      localStorage.setItem("email", email);
      localStorage.setItem("userPhone", phone);
      if (user?.image) localStorage.setItem("image", user?.image);

      const token = _data.token;
      if (token) localStorage.setItem("token", token);

      setSuccsess(true);
      setTimeout(() => {
        setSuccsess(false);
        navigate("/home");
      }, 2000);
    },
    onError: () => {
      setFailed(true);
      setTimeout(() => {
        setFailed(false);
      }, 2000);
    },
  });

  const onSubmit = (data: registerSchemaFormData) => {
    const fullData = { ...data, phone } as registerSchemaFormData;
    mutation.mutate(fullData);
  };

  return (
    <Box
      onSubmit={handleSubmit(onSubmit)}
      component="form"
      sx={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        height: "100vh",
      }}
    >
      <Box
        component="img"
        src={sahab}
        sx={{
          width: { xs: 100, md: 250 }, // أو أي حجم بدك إياه (مثلاً 32px)
          height: { xs: 100, md: 250 },
        }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: { xs: "200px", sm: "fit-content" },
          fontFamily: "Poppins",
          fontSize: { xs: "20px", sm: "30px" },
          fontWeight: "600",
        }}
      >
        {t("welcomeRegister")}
      </Box>

      <TextField
        error={!!errors.name}
        helperText={errors.name?.message}
        {...register("name")}
        id="name"
        label="name"
        type="text"
        sx={{
          width: { xs: "200px", md: "300px", lg: "400px" },
        }}
      />
      <TextField
        error={!!errors.email}
        helperText={errors.email?.message}
        {...register("email")}
        id="email"
        label="email"
        type="text"
        sx={{
          width: { xs: "200px", md: "300px", lg: "400px" },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        sx={{
          width: { xs: "200px", md: "300px", lg: "400px" },
          marginTop: "30px",
          fontSize: "18px",
          backgroundColor: "var(--main-color)",
        }}
      >
        {t("Register")}
      </Button>
      <Box>
        {t("By continuing you agree to Sahab")}
        <Button
          sx={{
            color: "black",
            fontWeight: "800",
            "&:hover": {
              color: "var(--main-color)",
              backgroundColor: "white",
            },
          }}
        >
          {t("Terms & Conditions")}
        </Button>
        {t("and")}
        <Button
          sx={{
            color: "black",
            fontWeight: "800",
            "&:hover": {
              color: "var(--main-color)",
              backgroundColor: "white",
            },
          }}
        >
          {t("Privacy Policy.")}
        </Button>
      </Box>
      {succsess && <Succsess seccsessfulMessage={t("createUser")} />}
      {failed && <Failed errorMessage={t("errorCreateUser")} />}
    </Box>
  );
};

export default Register;
