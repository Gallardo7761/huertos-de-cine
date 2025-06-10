import Slider from 'react-slick';
import '@/css/CustomCarousel.css';

const CustomCarousel = ({ images }) => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    arrows: false,
                    autoplay: true,
                    autoplaySpeed: 3000,
                    dots: false,
                    infinite: true,
                    speed: 500
                }
            }
        ]
    };

    return (
        <div className="my-4">
            <Slider {...settings}>
                {images.map((src, index) => (
                    <div key={index} className='carousel-img-wrapper'>
                        <img
                            src={src}
                            alt={`slide-${index}`}
                            className="carousel-img"
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default CustomCarousel;
