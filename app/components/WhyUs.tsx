import { FaShieldAlt, FaHandHoldingUsd, FaCarAlt, FaHeadset } from 'react-icons/fa';

const features = [
  {
    icon: FaShieldAlt,
    title: "Trusted Service",
    description: "10+ years of reliable car hire services across Kenya with verified customer reviews"
  },
  {
    icon: FaHandHoldingUsd,
    title: "Best Value",
    description: "Competitive pricing with no hidden charges. Price match guarantee"
  },
  {
    icon: FaCarAlt,
    title: "Premium Fleet",
    description: "Well-maintained vehicles including rugged 4x4s for safari adventures"
  },
  {
    icon: FaHeadset,
    title: "24/7 Support",
    description: "Dedicated support team available round the clock for any assistance"
  }
];

const WhyUs = () => {
  return (
    <section className="py-20 px-4 bg-secondary/20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-dark mb-4">
            Why Choose SafariRides?
          </h2>
          <p className="text-xl text-dark max-w-2xl mx-auto">
            Your trusted partner for unforgettable Kenyan road adventures with premium vehicles and exceptional service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.title} 
              className="text-center group bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              <div className="bg-primary p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:rotate-6 transition-transform duration-300 flex items-center justify-center">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-earth mb-3">
                {feature.title}
              </h3>
              <p className="text-earth/70 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Trust Indicators */}
        <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-center items-center gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">500+</div>
            <div className="text-earth">Happy Customers</div>
          </div>
          <div className="hidden md:block h-12 w-px bg-gray-300"></div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">98%</div>
            <div className="text-earth/70">Positive Reviews</div>
          </div>
          <div className="hidden md:block h-12 w-px bg-gray-300"></div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">24/7</div>
            <div className="text-earth/70">Roadside Assistance</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;