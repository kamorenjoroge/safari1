import { FaStar, FaMapMarkerAlt, FaCar, FaPhone } from 'react-icons/fa';
import Link from 'next/link';

const testimonials = [
  {
    name: "James Mwangi",
    comment: "The Land Cruiser we rented was perfect for our Maasai Mara safari. Excellent condition and the team was very professional.",
    rating: 5,
    location: "Nairobi, Kenya"
  },
  {
    name: "Sarah Johnson",
    comment: "Smooth booking process and the car was exactly as described. Will definitely use SafariRides again for our next Kenya trip!",
    rating: 5,
    location: "London, UK"
  },
  {
    name: "David Omondi",
    comment: "Reliable service with well-maintained vehicles. Their 24/7 support came in handy when we had a question during our trip.",
    rating: 4,
    location: "Mombasa, Kenya"
  }
];

const Testimonials = () => {
  return (
    <div>
      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-earth mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-earth/80">
              Don&apos;t just take our word for it - hear from our satisfied customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.name} 
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="h-5 w-5 text-accent" />
                  ))}
                </div>
                <p className="text-earth/80 mb-6 italic">
                  &ldquo;{testimonial.comment}&ldquo;
                </p>
                <div>
                  <div className="font-semibold text-earth">{testimonial.name}</div>
                  <div className="text-sm text-earth/60 flex items-center mt-1">
                    <FaMapMarkerAlt className="h-3 w-3 mr-1" />
                    {testimonial.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-primary-glow text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready for Your Kenyan Adventure?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Book your perfect 4x4 or city car today. Experience Kenya&lsquo;s roads with confidence - professional service, competitive prices, and reliable vehicles await.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/booking" 
              className="bg-accent hover:bg-accent-dark text-white px-8 py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              <FaCar className="h-5 w-5" />
              Book Now
            </Link>
            <a 
              href="tel:+254700000000" 
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors duration-300 border border-white/30 shadow-lg hover:shadow-xl"
            >
              <FaPhone className="h-5 w-5" />
              Call +254 700 000 000
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;