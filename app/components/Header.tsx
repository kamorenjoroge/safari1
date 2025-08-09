import { FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt } from 'react-icons/fa';

const Header = () => {
  return (
    <div className='hidden md:block bg-primary text-white py-3 px-4'>
      <div className='container mx-auto flex justify-between items-center'>
        {/* Contact Information */}
        <div className='flex items-center space-x-6'>
          <div className='flex items-center space-x-2'>
            <FaPhone className='text-color-accent' />
            <span className='text-sm'>+254 700 123 456</span>
          </div>
          <div className='flex items-center space-x-2'>
            <FaEnvelope className='text-color-accent' />
            <span className='text-sm'>bookings@safarivehicles.co.ke</span>
          </div>
          <div className='flex items-center space-x-2'>
            <FaMapMarkerAlt className='text-color-accent' />
            <span className='text-sm'>Nairobi, Kenya</span>
          </div>
        </div>
        
        {/* Social Media Icons */}
        <div className='flex items-center space-x-5'>
          <a href="#" className='hover:text-accent transition-colors duration-300'>
            <FaFacebook size={16} />
          </a>
          <a href="#" className='hover:text-accent transition-colors duration-300'>
            <FaTwitter size={16} />
          </a>
          <a href="#" className='hover:text-accent transition-colors duration-300'>
            <FaInstagram size={16} />
          </a>
          <a href="#" className='hover:text-accent transition-colors duration-300'>
            <FaLinkedin size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;