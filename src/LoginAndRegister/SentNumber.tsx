import { useMutation } from "@tanstack/react-query";
import apiClient from "../services/api-client";
import { useForm } from "react-hook-form";
import { loginSchema, type loginSchemaFormData } from "../schema/logInSchema";
import { Box, Button, TextField } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import sahab from "../assets/logo/sahab-logo-md.svg";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Succsess from "../components/message/Succsess";
import Failed from "../components/message/Failed";
import { useState } from "react";

const SentNumber = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<loginSchemaFormData>({ resolver: zodResolver(loginSchema) });
  const [succsess, setSuccsess] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);

  const mutation = useMutation({
    mutationKey: ["login"],
    mutationFn: (data: loginSchemaFormData) => {
      return apiClient.post("api/users/get-otp", data).then((res) => res.data);
    },
    onSuccess: () => {
      setSuccsess(true);
      setTimeout(() => {
        setSuccsess(false);
        navigate("/SentOTP");
      }, 2000); // أظهر الرسالة 2 ثانية ثم انتقل
    },
    onError: () => {
      setFailed(true);
      setTimeout(() => {
        setFailed(false);
      }, 3000);
    },
  });

  const onSubmit = (data: loginSchemaFormData) => {
    localStorage.setItem("userPhone", data.phone);
    mutation.mutate(data);
  };

  return (
    <Box
      onSubmit={handleSubmit(onSubmit)}
      component="form"
      sx={{
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
          width: { xs: 130, md: 250 }, // أو أي حجم بدك إياه (مثلاً 32px)
          height: { xs: 130, md: 250 },
        }}
      />
      <Box
        sx={{
          fontFamily: "Poppins",
          fontSize: { xs: "20px", md: "30px" },
          fontWeight: "600",
        }}
      >
        {t("welcome")}
      </Box>
      <Box
        sx={{
          fontFamily: "Poppins",
          fontSize: { xs: "20px", md: "30px" },
          fontWeight: "600",
        }}
      >
        {t("Mobile Number")}
      </Box>
      <TextField
        error={!!errors.phone}
        helperText={errors.phone?.message}
        {...register("phone")}
        id="phone"
        label="Phone"
        type="text"
        sx={{
          width: { xs: "200px", md: "300px", lg: "400px" },
          marginTop: "30px",
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
        {t("submit")}
      </Button>
      {succsess && <Succsess seccsessfulMessage={t("succsessNumber")} />}
      {failed && <Failed errorMessage={t("errorNumbre")} />}
    </Box>
  );
};

export default SentNumber;
