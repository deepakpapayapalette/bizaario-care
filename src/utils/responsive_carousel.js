// src/utils/responsive.js
const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
    partialVisibilityGutter: 20,
  },
  tablet: {
    breakpoint: { max: 1024, min: 767 },
    items: 2,
    partialVisibilityGutter: 20,
  },
  mobile: {
    breakpoint: { max: 767, min: 0 },
    items: 2,
    partialVisibilityGutter: 20,
  },
};

export default responsive;
