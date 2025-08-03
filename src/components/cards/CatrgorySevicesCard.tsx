import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import type { Category } from "../../hook/useGetCategories";
interface Props {
  category: Category;
}
export const CatrgoryServicesCard = ({ category }: Props) => {
  return (
    <Box
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
            src={category.icon}
            sx={{ marginBottom: "10px" }}
          />
          <Typography> {category.title}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};
