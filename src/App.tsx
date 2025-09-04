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
import { PlacePage } from "./pages/PlacePage";
import { PlacesForOneCategory } from "./pages/CategoriesPlaces/Places for one Category/PlacesForOneCategory";
import { ServicesForOneCategory } from "./pages/services proivded/service for one Category/ServicesForOneCategory";
import { ServicePage } from "./pages/ServicePage";
import { SearchHome } from "./pages/SearchHome";
import PlaceBooking from "./pages/PlaceBooking/PlaceBooking";
import PlaceBookingCheckout from "./pages/PlaceBooking/Checkout";
import ServicesBooking from "./pages/ServiceBooking/ServiceBooking";
import ServiceBookingCheckout from "./pages/ServiceBooking/Checkout";

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
          element={<PlacesForOneCategory />}
        />
        <Route
          path="/home/CategorySevices/services/:id"
          element={<ServicesForOneCategory />}
        />
        <Route
          path="/home/CategoryPlaces/places/DetailsPage/:id"
          element={<PlacePage />}
        />
        <Route
          path="/home/CategoriesServices/Service/DetailsPage/:id"
          element={<ServicePage />}
        />
         <Route
          path="/places/book/:id"
          element={<PlaceBooking />}
        />
        <Route
          path="/places/book/:id/checkout"
          element={<PlaceBookingCheckout />}
        />
        <Route
          path="/services/book/:id/"
          element={<ServicesBooking />}
        />
         <Route
          path="/services/book/:id/checkout"
          element={<ServiceBookingCheckout />}
        />
        <Route path="/home/SearchPage" element={<SearchHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
