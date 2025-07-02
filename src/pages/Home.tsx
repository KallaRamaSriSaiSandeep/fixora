import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Phone, Wrench, Hammer, Zap, Paintbrush, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { ServiceProvider } from '../types';

const serviceIcons = {
  plumber: <Wrench className="w-6 h-6" />,
  carpenter: <Hammer className="w-6 h-6" />,
  electrician: <Zap className="w-6 h-6" />,
  painter: <Paintbrush className="w-6 h-6" />,
};

const Home: React.FC = () => {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSampleProviders();
  }, []);

  const fetchSampleProviders = async () => {
    try {
      const response = await axios.get('http://localhost:9098/api/providers/featured');
      setProviders(response.data);
    } catch (error) {
      console.error('Failed to fetch providers:', error);
      // Fallback sample data for demo
      setProviders([
        {
          id: 1,
          name: 'John Smith',
          email: 'john@example.com',
          role: 'SERVICEPROVIDER' as const,
          services: ['plumber'],
          fare: 50,
          description: 'Experienced plumber with 10+ years of expertise',
          rating: 4.8,
          completedJobs: 150,
          location: 'Downtown',
          phone: '+1-234-567-8900'
        },
        {
          id: 2,
          name: 'Mike Johnson',
          email: 'mike@example.com',
          role: 'SERVICEPROVIDER' as const,
          services: ['electrician'],
          fare: 60,
          description: 'Licensed electrician specializing in home and commercial work',
          rating: 4.9,
          completedJobs: 200,
          location: 'Uptown',
          phone: '+1-234-567-8901'
        },
        {
          id: 3,
          name: 'Sarah Wilson',
          email: 'sarah@example.com',
          role: 'SERVICEPROVIDER' as const,
          services: ['carpenter'],
          fare: 45,
          description: 'Skilled carpenter for all your woodworking needs',
          rating: 4.7,
          completedJobs: 120,
          location: 'Midtown',
          phone: '+1-234-567-8902'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative py-20 px-4"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            Find the Perfect
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              {' '}Service Provider
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
          >
            Connect with skilled professionals for all your home and business needs. 
            From plumbing to electrical work, we've got you covered.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-teal-700 transition duration-300 shadow-lg"
              >
                Get Started as Customer
              </motion.button>
            </Link>
            <Link to="/join-provider">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition duration-300 shadow-lg"
              >
                Join as Provider
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Providers */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Service Providers</h2>
            <p className="text-xl text-gray-600">Top-rated professionals ready to help</p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {providers.map((provider, index) => (
                <motion.div
                  key={provider.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {provider.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900">{provider.name}</h3>
                      <div className="flex items-center text-sm text-gray-600">
                        {serviceIcons[provider.services[0] as keyof typeof serviceIcons] || <Wrench className="w-4 h-4" />}
                        <span className="ml-1 capitalize">{provider.services[0]}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{provider.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">{provider.rating}</span>
                      <span className="ml-2 text-sm text-gray-500">({provider.completedJobs} jobs)</span>
                    </div>
                    <div className="text-lg font-bold text-blue-600">${provider.fare}/hr</div>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{provider.location}</span>
                    <Phone className="w-4 h-4 ml-4 mr-1" />
                    <span>{provider.phone}</span>
                  </div>

                  <Link to="/register">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition duration-300 flex items-center justify-center"
                    >
                      Book Service
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </motion.button>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-20 px-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers and service providers on Fixora
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:bg-gray-100 transition duration-300 shadow-lg"
              >
                Find Services
              </motion.button>
            </Link>
            <Link to="/join-provider">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent text-white rounded-lg text-lg font-semibold border-2 border-white hover:bg-white hover:text-blue-600 transition duration-300"
              >
                Become a Provider
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;