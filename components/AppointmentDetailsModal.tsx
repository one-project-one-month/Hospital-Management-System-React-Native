import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { Modal } from '@/components/ui/Modal';
import { NotFound } from '@/components/ui/NotFound';
import { useAppointmentStore } from '@/lib/store/appointmentStore';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import ViewShot from 'react-native-view-shot';

interface AppointmentDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  appointment: any; // Replace with proper type
}

type TabType = 'treatment' | 'medical-record' | 'lab-result' | 'invoice';

export function AppointmentDetailsModal({ visible, onClose, appointment }: AppointmentDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('treatment');
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const viewShotRef = useRef<ViewShot>(null);
  const { getTreatment, treatments, getLabResult, labResults, getInvoice, invoice } = useAppointmentStore();
  
  // Cache for fetched data
  const fetchedData = useRef<{
    [key in TabType]?: boolean;
  }>({});

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const modalHeight = useRef(new Animated.Value(0)).current;
  const contentRef = useRef<View>(null);

  // State
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionMessage, setPermissionMessage] = useState('');
  const [permissionTitle, setPermissionTitle] = useState('');

  const measureContentHeight = () => {
    if (contentRef.current) {
      contentRef.current.measure((x, y, width, height) => {
        Animated.timing(modalHeight, {
          toValue: height,
          duration: 300,
          useNativeDriver: false,
        }).start();
      });
    }
  };

  const fetchData = async (tab: TabType) => {
    if (!appointment?.id) return;
    
    try {
      switch (tab) {
        case 'treatment':
          if (!fetchedData.current.treatment) {
            try {
              setIsLoading(true);
              await getTreatment(appointment.id);
              fetchedData.current.treatment = true;
            } catch (error) {
              console.error('Error fetching treatment:', error);
            } finally {
              setIsLoading(false);
            }
          }
          break;
        case 'medical-record':
          // Example: await getMedicalRecord(appointment.id);
          break;
        case 'lab-result':
          if (!fetchedData.current['lab-result']) {
            try {
              setIsLoading(true);
              await getLabResult(appointment.id);
              fetchedData.current['lab-result'] = true;
            } catch (error) {
              console.error('Error fetching lab result:', error);
            } finally {
              setIsLoading(false);
            }
          }
          break;
        case 'invoice':
          if (!fetchedData.current.invoice) {
            try {
              setIsLoading(true);
              await getInvoice(appointment.id);
              fetchedData.current.invoice = true;
            } catch (error) {
              console.error('Error fetching invoice:', error);
            } finally {
              setIsLoading(false);
            }
          }
          break;
      }
    } catch (error) {
      console.error(`Error fetching ${tab} data:`, error);
    }
  };

  // Reset cache when modal closes
  useEffect(() => {
    if (!visible) {
      fetchedData.current = {};
    }
  }, [visible]);

  useEffect(() => {
    if (visible && appointment?.id) {
      fetchData(activeTab);
    }
  }, [visible, appointment?.id, activeTab]);

  useEffect(() => {
    if (visible) {
      measureContentHeight();
    }
  }, [visible]);

  const handleTabChange = (tab: TabType) => {
    // Fade out and slide current content
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setActiveTab(tab);
      // Fade in and slide new content
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Measure and animate to new content height
        measureContentHeight();
      });
    });
  };

  const handleSaveInvoice = async () => {
    if (!appointment?.id) return;
    
    try {
      // Request permissions first
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        setPermissionTitle('Permission Required');
        setPermissionMessage('Please grant permission to save the invoice to your gallery.');
        setShowPermissionModal(true);
        return;
      }

      if (viewShotRef.current?.capture) {
        const uri = await viewShotRef.current.capture();
        const fileName = `invoice-${appointment.id}.png`;
        const filePath = `${FileSystem.cacheDirectory}${fileName}`;
        
        // Save to cache first
        await FileSystem.copyAsync({
          from: uri,
          to: filePath
        });

        // Save to gallery
        const asset = await MediaLibrary.createAssetAsync(filePath);
        await MediaLibrary.createAlbumAsync('HMS Invoices', asset, false);

        // Clean up cache file
        await FileSystem.deleteAsync(filePath, { idempotent: true });

        // Show success message in a modal
        setPermissionTitle('Success');
        setPermissionMessage('Invoice has been saved to your gallery in the "HMS Invoices" album.');
        setShowPermissionModal(true);
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
      // Show error message in a modal
      setPermissionTitle('Error');
      setPermissionMessage('Failed to save invoice. Please try again.');
      setShowPermissionModal(true);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      // Reset cache for current tab
      fetchedData.current[activeTab] = false;
      // Fetch fresh data
      await fetchData(activeTab);
    } finally {
      setIsSyncing(false);
    }
  };

  if (!appointment) {
    return null;
  }

  const renderTabContent = () => {
    if (isLoading) {
      return <Loading />;
    }

    const content = (() => {
      switch (activeTab) {
        case 'treatment':
          if (!treatments) {
            return <NotFound message="No treatment data available" />;
          }
          return (
            <View className="p-6">
              <Text className="text-xl font-bold text-gray-800 mb-6">Treatment Details</Text>
              <View className="space-y-6">
                <View className="bg-white rounded-xl p-4 shadow-sm">
                  <Text className="text-gray-600 text-sm mb-2">Treatment Title</Text>
                  <Text className="text-gray-800 text-base">{treatments.title}</Text>
                </View>

                <View className="bg-white rounded-xl p-4 shadow-sm">
                  <Text className="text-gray-600 text-sm mb-2">Description</Text>
                  <Text className="text-gray-800 text-base">{treatments.description}</Text>
                </View>

                <View className="bg-white rounded-xl p-4 shadow-sm">
                  <Text className="text-gray-600 text-sm mb-2">Duration</Text>
                  <Text className="text-gray-800 text-base">
                    From {new Date(treatments.start_date).toLocaleDateString()} to {new Date(treatments.end_date).toLocaleDateString()}
                  </Text>
                </View>

                <View className="bg-white rounded-xl p-4 shadow-sm">
                  <Text className="text-gray-600 text-sm mb-2">Appointment Details</Text>
                  <View className="space-y-2">
                    <Text className="text-gray-800 text-base">
                      Date: {new Date(appointment.appointment_date).toLocaleDateString()}
                    </Text>
                    <Text className="text-gray-800 text-base">
                      Time: {appointment.appointment_time}
                    </Text>
                    <Text className="text-gray-800 text-base">
                      Status: {appointment.status}
                    </Text>
                    <Text className="text-gray-800 text-base">
                      Notes: {appointment.notes}
                    </Text>
                  </View>
                </View>

                <View className="bg-white rounded-xl p-4 shadow-sm">
                  <Text className="text-gray-600 text-sm mb-2">Doctor Information</Text>
                  <View className="space-y-2">
                    <Text className="text-gray-800 text-base">Name: {appointment.doctor.name}</Text>
                    <Text className="text-gray-800 text-base">Specialty: {appointment.doctor.specialty.join(', ')}</Text>
                    <Text className="text-gray-800 text-base">License: {appointment.doctor.license_number}</Text>
                  </View>
                </View>
              </View>
            </View>
          );

        case 'medical-record':
          if (!appointment.medicalRecord) {
            return <NotFound message="No medical record data available" />;
          }
          return (
            <View className="p-6">
              <Text className="text-xl font-bold text-gray-800 mb-6">Medical Record</Text>
              <View className="space-y-6">
                <View className="bg-white rounded-xl p-4 shadow-sm">
                  <Text className="text-gray-600 text-sm mb-2">Symptoms</Text>
                  <Text className="text-gray-800 text-base">{appointment.medicalRecord.symptoms || 'No symptoms recorded'}</Text>
                </View>

                <View className="bg-white rounded-xl p-4 shadow-sm">
                  <Text className="text-gray-600 text-sm mb-2">Examination</Text>
                  <Text className="text-gray-800 text-base">{appointment.medicalRecord.examination || 'No examination recorded'}</Text>
                </View>

                <View className="bg-white rounded-xl p-4 shadow-sm">
                  <Text className="text-gray-600 text-sm mb-2">Follow-up Instructions</Text>
                  <Text className="text-gray-800 text-base">{appointment.medicalRecord.followUpInstructions || 'No follow-up instructions'}</Text>
                </View>
              </View>
            </View>
          );

        case 'lab-result':
          if (!labResults) {
            return <NotFound message="No lab result data available" />;
          }
          return (
            <View className="p-6">
              <Text className="text-xl font-bold text-gray-800 mb-6">Lab Results</Text>
              <View className="space-y-6">
                <View className="bg-white rounded-xl p-4 shadow-sm">
                  <Text className="text-gray-600 text-sm mb-2">Test Name</Text>
                  <Text className="text-gray-800 text-base">{labResults.test_name}</Text>
                </View>

                <View className="bg-white rounded-xl p-4 shadow-sm">
                  <Text className="text-gray-600 text-sm mb-2">Results</Text>
                  <View className="space-y-4">
                    {/* {labResults.map((result: any, index: number) => (
                      <View key={index} className="bg-gray-50 rounded-lg p-3">
                        <Text className="text-gray-800 text-base font-medium mb-1">{result.parameter}</Text>
                        <Text className="text-gray-800 text-base mb-1">
                          {result.value} {result.unit}
                        </Text>
                        <Text className="text-gray-500 text-sm">
                          Reference Range: {result.referenceRange}
                        </Text>
                      </View>
                    ))} */}
                  </View>
                </View>

                <View className="bg-white rounded-xl p-4 shadow-sm">
                  <Text className="text-gray-600 text-sm mb-2">Notes</Text>
                  <Text className="text-gray-800 text-base">{labResults.notes}</Text>
                </View>
              </View>
            </View>
          );

        case 'invoice':
          if (!invoice) {
            return <NotFound message="No invoice data available" />;
          }
          return (
            <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9 }}>
              <View className="p-6 bg-white">
                <Text className="text-xl font-bold text-gray-800 mb-6">Invoice</Text>
                <View className="space-y-6">
                  <View className="bg-gray-50 rounded-xl p-4">
                    <View className="flex-row justify-between mb-2">
                      <Text className="text-gray-600">Invoice #</Text>
                      <Text className="text-gray-800 font-medium">{invoice.id || 'N/A'}</Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                      <Text className="text-gray-600">Date</Text>
                      <Text className="text-gray-800 font-medium">{invoice.appointment.appointment_date}</Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                      <Text className="text-gray-600">Doctor</Text>
                      <Text className="text-gray-800 font-medium">{invoice.appointment.doctor.name}</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Patient</Text>
                      <Text className="text-gray-800 font-medium">{invoice.appointment.patient_profile_name}</Text>
                    </View>
                  </View>

                  <View className="bg-white rounded-xl p-4 shadow-sm">
                    <Text className="text-gray-600 text-sm mb-4">Items</Text>
                    {/* {invoice.items?.map((item: any, index: number) => (
                      <View key={index} className="flex-row justify-between py-2 border-b border-gray-100 last:border-0">
                        <Text className="text-gray-800">{item.name}</Text>
                        <Text className="text-gray-800 font-medium">${item.amount}</Text>
                      </View>
                    ))} */}
                  </View>

                  <View className="bg-gray-50 rounded-xl p-4">
                    <View className="flex-row justify-between">
                      <Text className="text-gray-800 font-bold text-lg">Total</Text>
                      <Text className="text-gray-800 font-bold text-lg">${invoice.amount || 0}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </ViewShot>
          );
      }
    })();

    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            {
              translateX: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 20],
              }),
            },
          ],
        }}
      >
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      </Animated.View>
    );
  };

  return (
    <Modal visible={visible} onClose={onClose} title="Appointment Details">
      <Animated.View 
        className="flex-1"
        style={{
          height: modalHeight.interpolate({
            inputRange: [0, 1000],
            outputRange: ['0%', '100%'],
          }),
        }}
      >
        {/* Tabs */}
        <View className="bg-white border-b border-gray-200">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-2">
            <View className="flex-row py-2">
              <TouchableOpacity
                className={`px-4 py-3 rounded-lg mr-2 ${
                  activeTab === 'treatment' ? 'bg-blue-50' : 'bg-gray-50'
                }`}
                onPress={() => handleTabChange('treatment')}
              >
                <View className="flex-row items-center">
                  <Ionicons 
                    name="medical-outline" 
                    size={20} 
                    color={activeTab === 'treatment' ? '#3b82f6' : '#6b7280'} 
                  />
                  <Text
                    className={`ml-2 font-medium ${
                      activeTab === 'treatment' ? 'text-blue-500' : 'text-gray-600'
                    }`}
                  >
                    Treatment
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className={`px-4 py-3 rounded-lg mr-2 ${
                  activeTab === 'medical-record' ? 'bg-blue-50' : 'bg-gray-50'
                }`}
                onPress={() => handleTabChange('medical-record')}
              >
                <View className="flex-row items-center">
                  <Ionicons 
                    name="document-text-outline" 
                    size={20} 
                    color={activeTab === 'medical-record' ? '#3b82f6' : '#6b7280'} 
                  />
                  <Text
                    className={`ml-2 font-medium ${
                      activeTab === 'medical-record' ? 'text-blue-500' : 'text-gray-600'
                    }`}
                  >
                    Medical Record
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className={`px-4 py-3 rounded-lg mr-2 ${
                  activeTab === 'lab-result' ? 'bg-blue-50' : 'bg-gray-50'
                }`}
                onPress={() => handleTabChange('lab-result')}
              >
                <View className="flex-row items-center">
                  <Ionicons 
                    name="flask-outline" 
                    size={20} 
                    color={activeTab === 'lab-result' ? '#3b82f6' : '#6b7280'} 
                  />
                  <Text
                    className={`ml-2 font-medium ${
                      activeTab === 'lab-result' ? 'text-blue-500' : 'text-gray-600'
                    }`}
                  >
                    Lab Result
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className={`px-4 py-3 rounded-lg ${
                  activeTab === 'invoice' ? 'bg-blue-50' : 'bg-gray-50'
                }`}
                onPress={() => handleTabChange('invoice')}
              >
                <View className="flex-row items-center">
                  <Ionicons 
                    name="receipt-outline" 
                    size={20} 
                    color={activeTab === 'invoice' ? '#3b82f6' : '#6b7280'} 
                  />
                  <Text
                    className={`ml-2 font-medium ${
                      activeTab === 'invoice' ? 'text-blue-500' : 'text-gray-600'
                    }`}
                  >
                    Invoice
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* Content */}
        <View 
          ref={contentRef}
          className="flex-1 bg-gray-50"
          onLayout={measureContentHeight}
        >
          <View className="flex-row justify-end p-2">
            <TouchableOpacity
              onPress={handleSync}
              disabled={isSyncing}
              className={`bg-blue-50 p-2 rounded-full ${isSyncing ? 'opacity-50' : ''}`}
            >
              <Animated.View
                style={{
                  transform: [{
                    rotate: isSyncing ? '360deg' : '0deg'
                  }]
                }}
              >
                <Ionicons 
                  name="sync-outline" 
                  size={20} 
                  color="#3b82f6"
                  style={{
                    transform: [{
                      rotate: isSyncing ? '360deg' : '0deg'
                    }]
                  }}
                />
              </Animated.View>
            </TouchableOpacity>
          </View>
          {renderTabContent()}
        </View>

        {/* Action Buttons */}
        {activeTab === 'invoice' && (
          <View className="p-4 border-t border-gray-200 bg-white">
            <Button
              variant="primary"
              onPress={handleSaveInvoice}
              className="flex-row items-center justify-center"
              icon={<Ionicons name="download-outline" size={20} color="white" className="mr-2" />}
            >
              <Text className="text-white ml-2 font-medium">Save Invoice</Text>
            </Button>
          </View>
        )}
      </Animated.View>

      {/* Permission Modal */}
      <Modal
        visible={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        title={permissionTitle}
      >
        <Text className="mb-3">{permissionMessage}</Text>
        <Button onPress={() => setShowPermissionModal(false)}>OK</Button>
      </Modal>
    </Modal>
  );
} 