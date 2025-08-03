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
          path="/home/CategoriesServices."
          element={<AllCategoriesServices />}
        />
        <Route
          path="/home/CategoriesPlaces."
          element={<AllCategoriesPlaces />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
