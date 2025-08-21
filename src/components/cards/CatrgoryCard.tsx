import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import type { Category } from "../../hook/useGetCategories";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../services/api-client";

interface Props {
  category: Category;
}
export const CatrgoryCard = ({ category }: Props) => {
  const navigate = useNavigate();

  return (
    <Box
      onClick={() => {
        localStorage.setItem("CategoryType", category.title);
        navigate(`/home/CategoryPlaces/places/${category.id}`);
      }}
      component={Button}
      sx={{
        width: "30%",
      }}
    >
      <Card
        variant="outlined"
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CardContent>
          <Box
            component="img"
            src={baseURL + category.icon}
            sx={{ marginBottom: "10px", width: "50px", height: "50px" }}
          />
          <Typography> {category.title}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};
