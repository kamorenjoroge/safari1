import CarGrid from "./components/CarGrid"
import Footer from "./components/Footer"
import HeroMain from "./components/HeroMain"
import Testimonials from "./components/Testimonials"
import WhyUs from "./components/WhyUs"

const Page = () => {
  return (
    <div className=''>
      <HeroMain/>
      <CarGrid/>
       <WhyUs/>
      <Testimonials/>
      <Footer/>
    </div>
  )
}

export default Page