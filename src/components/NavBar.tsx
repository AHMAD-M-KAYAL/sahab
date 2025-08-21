import Input from "@mui/joy/Input";
import SearchIcon from "../assets/logo/Search.svg";
import Box from "@mui/material/Box";
import Link from "@mui/joy/Link";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
const NavBar = () => {
  // valid to toggle color
  const [selectedHome, setSelectedHome] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(false);
  const navigate = useNavigate();

  return (
    <nav
      className="navbar"
      style={{
        backgroundColor: "white",
        boxShadow: "0 4px 16px 0 rgba(0,0,0,0.10)",
      }}
    >
      <div className="container-fluid">
        <Box
          className="navbar-brand mb-0 h1"
          sx={{ width: "10%", textAlign: "center" }}
        >
          {t("Sahab")}
        </Box>
        <Input
          onClick={() => {
            console.log("clicked");
            navigate("SearchPage");
          }}
          color="neutral"
          placeholder="Search"
          size="lg"
          variant="outlined"
          endDecorator={<Box component="img" src={SearchIcon} />}
          sx={{ borderRadius: "50px", width: "50%" }}
        />
        <Box
          sx={{
            display: "flex",
            width: "30%",
            justifyContent: "space-evenly",
          }}
        >
          <Link
            component="button"
            sx={{ color: selectedHome ? "var(--main-color)" : "#00000099" }}
            onClick={() => {
              navigate("/Home");
              setSelectedHome(true);
              setSelectedAccount(false);
              setSelectedBooking(false);
            }}
            underline="none"
            color="neutral"
          >
            {t("Home")}
          </Link>
          <Link
            component="button"
            sx={{ color: selectedBooking ? "var(--main-color)" : "#00000099" }}
            onClick={() => {
              navigate("/Booking");

              setSelectedHome(false);
              setSelectedBooking(true);
              setSelectedAccount(false);
            }}
            underline="none"
            color="neutral"
          >
            {t("Booking")}
          </Link>
          <Link
            component="button"
            sx={{ color: selectedAccount ? "var(--main-color)" : "#00000099" }}
            onClick={() => {
              navigate("/Account");

              setSelectedHome(false);
              setSelectedBooking(false);
              setSelectedAccount(true);
            }}
            underline="none"
            color="neutral"
          >
            {t("Account")}
          </Link>
        </Box>
      </div>
    </nav>
  );
};

export default NavBar;
