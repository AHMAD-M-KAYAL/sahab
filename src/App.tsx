import Language from "./pages/Language";
import SplashScreen from "./pages/SplashScreen";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./i18n";
import SentNumber from "./LoginAndRegister/SentNumber";
import SentOTP from "./LoginAndRegister/SentOTP";
import Register from "./LoginAndRegister/Register";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import { AllFeaturedPlaces } from "./pages/FeaturedPlaces/AllFeaturedPlaces";
import { AllCategoriesServices } from "./pages/services proivded/AllCategoriesServices";
import { AllCategoriesPlaces } from "./pages/CategoriesPlaces/AllCategoriesPlaces";
// import { PlacesForOneCategory } from "./pages/CategoriesPlaces/PlacesForOneCategory";
import { SelectCategoryPlaces } from "./pages/CategoriesPlaces/Places for one Category/SelectCategoryPlaces";
import { SelectCategoryServices } from "./pages/services proivded/service for one Category/SelectCategoryServices";
import { PlacePage } from "./pages/PlacePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/Language" element={<Language />} />
        <Route path="/SentNumber" element={<SentNumber />} />
        <Route path="/SentOTP" element={<SentOTP />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/NavBar" element={<NavBar />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/featured" element={<AllFeaturedPlaces />} />
        <Route
          path="/home/CategoryServices."
          element={<AllCategoriesServices />}
        />
        <Route path="/home/CategoryPlaces." element={<AllCategoriesPlaces />} />
        <Route
          path="/home/CategoryPlaces/places/:id"
          element={<SelectCategoryPlaces />}
        />
        <Route
          path="/home/CategorySevices/services/:id"
          element={<SelectCategoryServices />}
        />
        <Route
          path="/home/CategoryPlaces/places/placeDetailsPage/:id"
          element={<PlacePage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
