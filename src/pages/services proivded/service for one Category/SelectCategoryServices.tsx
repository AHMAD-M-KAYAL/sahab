import { Box, Button } from "@mui/material";
import { t } from "i18next";
import IconBack from "../../../assets/logo/back.svg";
import { useNavigate, useParams } from "react-router-dom";

import { ServicesCard } from "../../../components/cards/ServicesCard";
import {
  useGetServiceForOneCategory,
  type Service,
} from "../../../hook/useGetServiceForOneCategory";
import { useState } from "react";
import SelectPrice from "../../../components/cards/SelectPrice";
export const SelectCategoryServices = () => {
  const { id } = useParams(); // id is a string
  const navigate = useNavigate();
  const [price, setPrice] = useState(0);
  const { data } = useGetServiceForOneCategory(Number(id), price);
  const service = Array.isArray(data?.data?.services?.data)
    ? data.data.services.data
    : [];

  const CategoryType = localStorage.getItem("CategoryType");
  return (
    <>
      <nav
        className="navbar"
        style={{
          backgroundColor: "white",
          boxShadow: "0 4px 16px 0 rgba(0,0,0,0.10)",
        }}
      >
        <Box
          component={Button}
          onClick={() => {
            navigate("/home/CategoryServices.");
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
          {t("Services we Provide")}/{CategoryType}
        </Box>
      </nav>
      <Box sx={{ marginTop: "10px" }}>
        <SelectPrice price={price} setPrice={setPrice} />
      </Box>
      <Box
        sx={{
          display: "flex",
          margin: "10px",
          justifyContent: "space-between",
        }}
      ></Box>
      <Box sx={{ paddingTop: "20px" }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-evenly",
          }}
        >
          {service.length > 0 &&
            service.map((ele: Service) => (
              <ServicesCard Service={ele} key={ele.id} />
            ))}
          {service.length === 0 && (
            <Box
              sx={{
                color: "var(--main-color)",
                fontSize: "30px",
                fontWeight: "400",
              }}
            >
              {t("No Places To Show")}
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};
