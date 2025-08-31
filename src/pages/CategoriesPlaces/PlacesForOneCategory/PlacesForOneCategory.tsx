import { Box, Button } from "@mui/material";
import { t } from "i18next";
import IconBack from "../../../assets/logo/back.svg";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetPlacesForOneCategorie,
  type Places,
} from "../../../hook/useGetPlacesForOneCategorie";
import { PlacesCard2 } from "../../../components/cards/PlacesCard2";
import TagForm from "../../../components/cards/TagForm";
import { useState } from "react";
import SelectPrice from "../../../components/cards/SelectPrice";
export const PlacesForOneCategory = () => {
  const { id } = useParams(); // id is a string
  const navigate = useNavigate();
  const [type, setType] = useState("none");
  const [price, setPrice] = useState(0);

  const { data } = useGetPlacesForOneCategorie(Number(id), type, price);
  const places = Array.isArray(data?.data?.places?.data)
    ? data.data.places.data
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
            navigate("/home/CategoryPlaces.");
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
          {t("Popular Categories")}/{CategoryType}
        </Box>
      </nav>
      <Box
        sx={{
          display: "flex",
          margin: "10px",
          justifyContent: "space-between",
        }}
      >
        <TagForm type={type} setType={setType} />
        <SelectPrice price={price} setPrice={setPrice} />
      </Box>
      <Box sx={{ paddingTop: "20px" }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-evenly",
          }}
        >
          {places.length > 0 &&
            places.map((ele: Places) => (
              <PlacesCard2 Places={ele} key={ele.id} />
            ))}
          {places.length === 0 && (
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
