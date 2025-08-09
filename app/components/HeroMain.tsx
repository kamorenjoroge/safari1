import { FaCar, FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';

const HeroMain = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('/hero-cars.jpg')", // Replace with your image path
          backgroundPosition: 'center',
          filter: 'brightness(0.7)'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-primary/70" />
      
      {/* Hero Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
          Explore Kenya In 
          <span className="bg-gradient-to-r from-white to-black bg-clip-text text-transparent">
            {" "}Style
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-white/90 animate-fade-in">
          Premium 4x4 hire services for your safari adventures. From rugged Land Cruisers 
          <br className="hidden md:block" />
          to comfortable tour vans, we have your perfect travel companion.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
          <Link 
            href="/fleet" 
            className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            <FaCar className="h-5 w-5" />
            Browse Our Fleet
          </Link>
          
          <a 
            href="https://wa.me/254111446888`" 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent hover:bg-accent-dark text-white px-8 py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            <FaWhatsapp className="h-5 w-5" />
            Book via WhatsApp
          </a>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="animate-fade-in">
            <div className="text-3xl font-bold text-accent">500+</div>
            <div className="text-white/80">Safaris Completed</div>
          </div>
          <div className="animate-fade-in">
            <div className="text-3xl font-bold text-accent">50+</div>
            <div className="text-white/80">4x4 Vehicles</div>
          </div>
          <div className="animate-fade-in">
            <div className="text-3xl font-bold text-accent">10+</div>
            <div className="text-white/80">Years Experience</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroMain;