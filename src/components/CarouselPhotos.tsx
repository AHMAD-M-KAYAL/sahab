import { useGetHomePhotos } from "../hook/useGetHomePhotos";

const CarouselPhotos = () => {
  const { data } = useGetHomePhotos();
  return (
    <div
      id="carouselExampleInterval"
      className="carousel slide  mx-auto "
      data-bs-ride="carousel"
      style={{ width: "90%" }}
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
                height: "300px",
                borderRadius: "10px",
              }}
              src={
                "https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286&dpr=2"
              }
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
