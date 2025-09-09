import type { CarouselImg } from "../hook/useGetHomePhotos";
import type { PlaceImage } from "../hook/useGetOnePlaceDetails";
import { baseURL } from "../services/api-client";
interface Props {
  data: CarouselImg[] | PlaceImage[]; //its same type but i put all to know for what we use it
}

const CarouselPhotos = ({ data }: Props) => {
  return (
    <div
      id="carouselExampleInterval"
      className="carousel slide  mx-auto "
      data-bs-ride="carousel"
      style={{ width: "90%", direction: "ltr" }}
    >
      <div className="carousel-indicators">
        {data?.map((e, idx) => (
          <button
            key={e.id}
            type="button"
            data-bs-target="#carouselExampleInterval"
            data-bs-slide-to={idx}
            className={idx === 0 ? "active" : ""}
            aria-current={idx === 0 ? "true" : undefined}
            aria-label={`Slide ${idx + 1}`}
          ></button>
        ))}
      </div>
      <div className="carousel-inner" style={{ borderRadius: "10px" }}>
        {data?.map((ele, idx) => (
          <div
            key={ele.id}
            style={{ width: "100%", height: "30%" }}
            className={`carousel-item  ${idx === 0 ? "active" : ""}`}
            data-bs-interval="1000"
          >
            <img
              style={{
                objectFit: "cover",
                height: "400px",
                borderRadius: "10px",
                aspectRatio: "16/9",
              }}
              src={baseURL + ele.image}
              className="d-block w-100"
              alt=""
            />
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleInterval"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleInterval"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default CarouselPhotos;
