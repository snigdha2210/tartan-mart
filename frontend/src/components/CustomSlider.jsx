// import neccessary libraries and objects
import Slider from 'react-slick';

// defines the customslider functional component with 'items' as a prop
const CustomSlider = ({ items }) => {
  const settings = {
    dots: true,
    speed: 400,
    slidesToShow: 3,
    infinite: true,
    centerMode: true,
    arrows: false,
  };

  // styles object for various elements within the slider
  const styles = {
    img_container: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: 'bg-indigo-500',
      height: 70,
    },
    card_btn: {
      backgroundColor: 'bg-indigo-500',
      textColor: 'white',
    },
    title: {
      marginTop: 16,
      textAlign: 'center',
      fontWeight: 'semi-bold',
    },
    desc_container: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: 'bg-indigo-500',
      height: 70,
    },
    item_img: {
      height: 50,
      width: 50,
      borderRadius: 15,
    },
  };

  // returns the slider component
  return (
    <div className='mt-20'>
      <Slider {...settings}>
        {items.map((item) => (
          <div className='bg-white h-[300px] text-black rounded-xl'>
            <div style={styles.img_container}>
              <img src={item.img} style={styles.item_img}></img>
            </div>
            <div style={styles.desc_container}>
              <p style={styles.title}></p>
              <button style={styles.card_btn}></button>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

// exports the customslider component
export default CustomSlider;
