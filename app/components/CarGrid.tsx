'use client';

import { FaCheckCircle, FaCar } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';

interface CarCategory {
  _id: string;
  title: string;
  description: string;
  image: string;
  priceFrom: string;
  features: string[];
  popular: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiResponse {
  success: boolean;
  data: CarCategory[];
}

// Skeleton Card Component
const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 animate-pulse">
      <div className="relative">
        {/* Skeleton image */}
        <div className="h-48 bg-gray-300"></div>
        {/* Skeleton popular badge */}
        <div className="absolute top-4 left-4 bg-gray-300 rounded-full w-20 h-6"></div>
      </div>
      <div className="p-6">
        <div className="mb-4">
          {/* Skeleton title */}
          <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
          {/* Skeleton description */}
          <div className="h-4 bg-gray-200 rounded mb-1 w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        
        {/* Skeleton price */}
        <div className="mb-4">
          <div className="h-8 bg-gray-300 rounded w-1/2"></div>
        </div>

        {/* Skeleton features */}
        <div className="space-y-2 mb-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded flex-1"></div>
            </div>
          ))}
        </div>

        {/* Skeleton button */}
        <div className="w-full h-12 bg-gray-300 rounded-lg"></div>
      </div>
    </div>
  );
};

const CarGrid = () => {
  const [carCategories, setCarCategories] = useState<CarCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCarCategories = async () => {
      try {
        const response = await axios.get<ApiResponse>('/api/category');
        if (response.data.success) {
          setCarCategories(response.data.data);
        } else {
          throw new Error('Failed to fetch car categories');
        }
      } catch (err) {
        const error = err as AxiosError | Error;
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCarCategories();
  }, []);

  if (error) {
    return (
      <section className="py-20 px-4 bg-secondary/10">
        <div className="container mx-auto text-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-secondary/10">
      <div className="container mx-auto">
        {/* Header - Always visible */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-earth mb-4">
            Choose Your Perfect Ride
          </h2>
          <p className="text-xl text-earth/80 max-w-2xl mx-auto">
            From rugged safari 4x4s to luxurious executive vehicles, 
            find the perfect car for your Kenyan adventure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Show skeleton cards while loading
            Array.from({ length: 6 }, (_, index) => (
              <SkeletonCard key={index} />
            ))
          ) : (
            // Show actual car categories
            carCategories.map((category) => (
              <div 
                key={category._id} 
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group border border-gray-100"
              >
                <div className="relative">
                  {category.popular && (
                    <div className="absolute top-4 left-4 z-10 bg-accent text-white px-3 py-1 rounded-full text-xs font-bold">
                      Most Popular
                    </div>
                  )}
                  <div className="h-48 overflow-hidden">
                    <Image
                      width={500}
                      height={500}
                      src={category.image} 
                      alt={category.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      priority={false}
                    />
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-earth mb-2">
                      {category.title}
                    </h3>
                    <p className="text-earth/70 text-sm">
                      {category.description}
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-primary">
                      KES {category.priceFrom}
                      <span className="text-sm font-normal text-earth/70">/day</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    {category.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <FaCheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm text-earth/70">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link 
                    href={`/fleet?category=${category._id}`}
                    className="w-full bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors duration-300"
                  >
                    <FaCar className="h-4 w-4" />
                    View 
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default CarGrid;