import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import type { Category } from "../../hook/useGetCategories";
import { useNavigate } from "react-router-dom";
interface Props {
  category: Category;
}
export const CatrgoryServicesCard = ({ category }: Props) => {
  const navigate = useNavigate();

  return (
    <Box
      component={Button}
      sx={{
        width: "30%",
      }}
      onClick={() => {
        console.log(category.id);
        localStorage.setItem("CategoryType", category.title);
        navigate(`/home/CategorySevices/services/${category.id}`);
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
            src={category.icon}
            sx={{ marginBottom: "10px" }}
          />
          <Typography> {category.title}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};
