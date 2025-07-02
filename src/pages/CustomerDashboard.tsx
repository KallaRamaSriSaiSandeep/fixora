import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, MapPin, Phone, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import axios from 'axios';
import { ServiceProvider, Booking } from '../types';
import { useAuth } from '../context/AuthContext';

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<ServiceProvider[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [bookingForm, setBookingForm] = useState({
    serviceType: '',
    description: '',
    scheduledDate: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviders();
    fetchBookings();
  }, []);

  useEffect(() => {
    filterProviders();
  }, [providers, searchTerm, selectedService, selectedLocation, maxPrice]);

  const fetchProviders = async () => {
    try {
      const response = await axios.get('http://localhost:9098/api/providers');
      setProviders(response.data);
    } catch (error) {
      console.error('Failed to fetch providers:', error);
      // Fallback sample data
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

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`http://localhost:9098/api/bookings/customer/${user?.id}`);
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      // Fallback sample data
      setBookings([
        {
          id: 1,
          customerId: user?.id || 1,
          serviceProviderId: 1,
          serviceType: 'plumber',
          description: 'Fix kitchen sink leak',
          scheduledDate: '2025-01-15',
          status: 'PENDING',
          customerName: user?.name || 'Customer',
          providerName: 'John Smith',
          fare: 50,
          createdAt: '2025-01-10'
        }
      ]);
    }
  };

  const filterProviders = () => {
    let filtered = providers;

    if (searchTerm) {
      filtered = filtered.filter(provider => 
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedService) {
      filtered = filtered.filter(provider => 
        provider.services.includes(selectedService)
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter(provider => 
        provider.location?.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    if (maxPrice) {
      filtered = filtered.filter(provider => 
        provider.fare <= parseFloat(maxPrice)
      );
    }

    setFilteredProviders(filtered);
  };

  const handleBookService = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    setBookingForm({
      serviceType: provider.services[0],
      description: '',
      scheduledDate: ''
    });
    setShowBookingModal(true);
  };

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProvider || !user) return;

    try {
      const bookingData = {
        customerId: user.id,
        serviceProviderId: selectedProvider.id,
        serviceType: bookingForm.serviceType,
        description: bookingForm.description,
        scheduledDate: bookingForm.scheduledDate,
        fare: selectedProvider.fare
      };

      await axios.post('http://localhost:9098/api/bookings', bookingData);
      setShowBookingModal(false);
      fetchBookings();
      alert('Booking submitted successfully!');
    } catch (error) {
      console.error('Failed to submit booking:', error);
      alert('Failed to submit booking. Please try again.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'ACCEPTED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome, {user?.name}!</h1>
          <p className="text-xl text-gray-600">Find the perfect service provider for your needs</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Services</option>
              <option value="plumber">Plumber</option>
              <option value="electrician">Electrician</option>
              <option value="carpenter">Carpenter</option>
              <option value="painter">Painter</option>
              <option value="cleaner">Cleaner</option>
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Locations</option>
              <option value="downtown">Downtown</option>
              <option value="uptown">Uptown</option>
              <option value="midtown">Midtown</option>
            </select>

            <input
              type="number"
              placeholder="Max Price/hr"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedService('');
                setSelectedLocation('');
                setMaxPrice('');
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service Providers */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Service Providers</h2>
              
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="ml-4">
                          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                      <div className="h-16 bg-gray-200 rounded mb-4"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProviders.map((provider, index) => (
                    <motion.div
                      key={provider.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6"
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                          {provider.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="capitalize">{provider.services.join(', ')}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 text-sm">{provider.description}</p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
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

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleBookService(provider)}
                        className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition duration-300"
                      >
                        Book Service
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* My Bookings */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">My Bookings</h2>
              
              {bookings.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No bookings yet</p>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{booking.providerName}</h3>
                        <div className="flex items-center">
                          {getStatusIcon(booking.status)}
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{booking.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{new Date(booking.scheduledDate).toLocaleDateString()}</span>
                        </div>
                        <span className="font-medium">${booking.fare}/hr</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Booking Modal */}
        {showBookingModal && selectedProvider && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Book Service with {selectedProvider.name}
              </h3>
              
              <form onSubmit={submitBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type
                  </label>
                  <select
                    value={bookingForm.serviceType}
                    onChange={(e) => setBookingForm({...bookingForm, serviceType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {selectedProvider.services.map(service => (
                      <option key={service} value={service} className="capitalize">
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Description
                  </label>
                  <textarea
                    value={bookingForm.description}
                    onChange={(e) => setBookingForm({...bookingForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Describe what you need help with..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={bookingForm.scheduledDate}
                    onChange={(e) => setBookingForm({...bookingForm, scheduledDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="text-lg font-bold text-blue-600">
                    Rate: ${selectedProvider.fare}/hr
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition duration-300"
                  >
                    Book Now
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;