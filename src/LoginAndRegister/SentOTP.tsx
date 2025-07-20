import { useMutation } from "@tanstack/react-query";
import apiClient from "../services/api-client";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Succsess from "../message/Succsess";
import Failed from "../message/Failed";
import { useEffect, useState } from "react";
import PhoneIcon from "../assets/logo/Combined Shape.svg";
import OTPInput from "react-otp-input";
interface Res {
  is_registered: boolean;
}
const SentOTP = () => {
  const phone = localStorage.getItem("userPhone") as string;
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [timer, setTimer] = useState(3);
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (timer === 0) {
      setEnabled(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const [succsess, setSuccsess] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);

  const mutation = useMutation({
    mutationKey: ["login"],
    mutationFn: (data: { phone: string; code: string }) => {
      return apiClient.post("api/users/login", data).then((res) => res.data);
    },
    onSuccess: (data: Res) => {
      setSuccsess(true);
      setTimeout(() => {
        setSuccsess(false);
        if (data.is_registered) navigate("/Home");
        else navigate("/Register");
      }, 2000); // أظهر الرسالة 2 ثانية ثم انتقل
    },
    onError: () => {
      setFailed(true);
      setTimeout(() => {
        setFailed(false);
      }, 3000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(otp)) {
      alert("OTP must be exactly 4 digits!");
      return;
    }
    mutation.mutate({ phone, code: otp });
  };
  return (
    <Box
      onSubmit={handleSubmit}
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
        src={PhoneIcon}
        sx={{
          width: { xs: 70, md: 250 }, // أو أي حجم بدك إياه (مثلاً 32px)
          height: { xs: 70, md: 250 },
        }}
      />
      <Box
        sx={{
          fontFamily: "Poppins",
          fontSize: { xs: "13px", md: "30px" },
          fontWeight: "600",
        }}
      >
        {t("sentOtp")}
      </Box>
      <Box
        sx={{
          direction: "ltr",
          fontFamily: "Poppins",
          fontSize: { xs: "20px", md: "30px" },
          fontWeight: "100",
        }}
      >
        +965 {phone}
      </Box>

      <Box
        sx={{
          fontFamily: "Poppins",
          fontSize: { xs: "15px", md: "30px" },
          fontWeight: "600",
        }}
      >
        {t("enterOtp")}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 4,
          direction: "ltr",
        }}
      >
        <OTPInput
          value={otp}
          onChange={setOtp}
          numInputs={4}
          inputStyle={{
            width: "3rem",
            height: "3rem",
            margin: "0 0.5rem",
            fontSize: "2rem",
            borderRadius: 8,
            border: "1px solid var(--second-color)",
          }}
          renderInput={(props) => <input {...props} />}
        />
      </Box>
      <Box>({formatTime(timer)})</Box>
      {enabled && (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Box>{t("questionOtp")}</Box>
          <Button
            sx={{
              display: "flex",
              justifyContent: "center",
              color: "black",
              fontWeight: "800",
              "&:hover": {
                color: "var(--main-color)",
                backgroundColor: "white",
              },
            }}
          >
            {t("ResendCode")}
          </Button>
        </Box>
      )}
      <Button
        type="submit"
        variant="contained"
        sx={{
          width: { xs: "200px", md: "300px", lg: "400px" },
          marginTop: "5px",
          marginBottom: "10px",
          fontSize: "18px",
          backgroundColor: "var(--main-color)",
        }}
      >
        {t("Verify")}
      </Button>
      {succsess && <Succsess seccsessfulMessage={t("succsessNumber")} />}
      {failed && <Failed errorMessage={t("errorOTP")} />}
    </Box>
  );
};

export default SentOTP;
