import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, MapPin, Clock, CheckCircle, XCircle, Edit, Phone, Mail, Star } from 'lucide-react';
import axios from 'axios';
import { Booking } from '../types';
import { useAuth } from '../context/AuthContext';

const ServiceProviderDashboard: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    phone: '',
    location: '',
    services: [] as string[],
    fare: 0,
    description: ''
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedJobs: 0,
    rating: 4.8
  });

  useEffect(() => {
    fetchBookings();
    fetchProfile();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`http://localhost:9098/api/bookings/provider/${user?.id}`);
      setBookings(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      // Fallback sample data
      const sampleBookings = [
        {
          id: 1,
          customerId: 2,
          serviceProviderId: user?.id || 1,
          serviceType: 'plumber',
          description: 'Fix kitchen sink leak',
          scheduledDate: '2025-01-15',
          status: 'PENDING' as const,
          customerName: 'Alice Johnson',
          providerName: user?.name || 'Provider',
          fare: 50,
          createdAt: '2025-01-10'
        },
        {
          id: 2,
          customerId: 3,
          serviceProviderId: user?.id || 1,
          serviceType: 'plumber',
          description: 'Install new bathroom fixtures',
          scheduledDate: '2025-01-12',
          status: 'ACCEPTED' as const,
          customerName: 'Bob Smith',
          providerName: user?.name || 'Provider',
          fare: 50,
          createdAt: '2025-01-08'
        }
      ];
      setBookings(sampleBookings);
      calculateStats(sampleBookings);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:9098/api/providers/${user?.id}`);
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      // Use default profile data
      setProfile({
        name: user?.name || '',
        phone: '+1-234-567-8900',
        location: 'Downtown',
        services: ['plumber'],
        fare: 50,
        description: 'Experienced professional ready to help with your needs'
      });
    }
  };

  const calculateStats = (bookingsData: Booking[]) => {
    const totalBookings = bookingsData.length;
    const pendingBookings = bookingsData.filter(b => b.status === 'PENDING').length;
    const completedJobs = bookingsData.filter(b => b.status === 'COMPLETED').length;
    
    setStats({
      totalBookings,
      pendingBookings,
      completedJobs,
      rating: 4.8 // This would come from actual ratings in a real app
    });
  };

  const updateBookingStatus = async (bookingId: number, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      await axios.put(`http://localhost:9098/api/bookings/${bookingId}/status`, { status });
      fetchBookings();
    } catch (error) {
      console.error('Failed to update booking status:', error);
      // Update locally for demo
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId ? { ...booking, status } : booking
      ));
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:9098/api/providers/${user?.id}`, profile);
      setShowProfileModal(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
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

  const serviceOptions = ['plumber', 'electrician', 'carpenter', 'painter', 'cleaner', 'gardener', 'handyman'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome, {user?.name}!</h1>
              <p className="text-xl text-gray-600">Manage your bookings and profile</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProfileModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition duration-300 flex items-center"
            >
              <Edit className="w-5 h-5 mr-2" />
              Edit Profile
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedJobs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rating}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Requests */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Requests</h2>
              
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                      </div>
                      <div className="h-16 bg-gray-200 rounded mb-4"></div>
                      <div className="flex space-x-2">
                        <div className="h-8 bg-gray-200 rounded flex-1"></div>
                        <div className="h-8 bg-gray-200 rounded flex-1"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : bookings.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No booking requests yet</p>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                            {booking.customerName.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <h3 className="font-medium text-gray-900">{booking.customerName}</h3>
                            <p className="text-sm text-gray-600 capitalize">{booking.serviceType}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-4">{booking.description}</p>

                      <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{new Date(booking.scheduledDate).toLocaleDateString()}</span>
                        </div>
                        <span className="font-medium text-blue-600">${booking.fare}/hr</span>
                      </div>

                      {booking.status === 'PENDING' && (
                        <div className="flex space-x-3">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => updateBookingStatus(booking.id, 'ACCEPTED')}
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Accept
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => updateBookingStatus(booking.id, 'REJECTED')}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Decline
                          </motion.button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Profile Summary */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Summary</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">{profile.name}</span>
                </div>
                
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">{profile.phone || 'Not provided'}</span>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">{profile.location || 'Not provided'}</span>
                </div>
                
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">{user?.email}</span>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Services Offered:</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.services.map((service) => (
                      <span
                        key={service}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Hourly Rate:</p>
                  <p className="text-lg font-bold text-blue-600">${profile.fare}/hr</p>
                </div>

                {profile.description && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Description:</p>
                    <p className="text-sm text-gray-600">{profile.description}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Profile Edit Modal */}
        {showProfileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h3>
              
              <form onSubmit={updateProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({...profile, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Services Offered
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {serviceOptions.map((service) => (
                      <label key={service} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={profile.services.includes(service)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setProfile({...profile, services: [...profile.services, service]});
                            } else {
                              setProfile({...profile, services: profile.services.filter(s => s !== service)});
                            }
                          }}
                          className="mr-2 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm capitalize">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hourly Rate (USD)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={profile.fare}
                    onChange={(e) => setProfile({...profile, fare: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={profile.description}
                    onChange={(e) => setProfile({...profile, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Describe your services and experience..."
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition duration-300"
                  >
                    Save Changes
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

export default ServiceProviderDashboard;