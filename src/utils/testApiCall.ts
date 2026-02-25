import { gymServiceApi } from '../services/gymService';

export const testGymServiceApi = async () => {
  console.log('🔍 Testing Gym Service API...');
  
  try {
    const response = await gymServiceApi.getServicesActive();
    console.log('✅ API Response received:', response);
    
    if (response.success && response.data) {
      console.log('📊 Response data structure:');
      console.log('- Success:', response.success);
      console.log('- Message:', response.message);
      console.log('- Data length:', response.data.length);
      
      response.data.forEach((service, index) => {
        console.log(`\n🏋️ Service ${index + 1}:`);
        console.log('- ID:', service.id);
        console.log('- Name:', service.name);
        console.log('- Category:', service.category);
        console.log('- Images:', service.images);
        console.log('- Images type:', typeof service.images);
        console.log('- Images length:', service.images?.length || 0);
        console.log('- First image:', service.images?.[0]);
        console.log('- Price:', service.price);
        console.log('- Is Active:', service.isActive);
      });
    } else {
      console.error('❌ API response not successful:', response);
    }
  } catch (error) {
    console.error('💥 API call failed:', error);
  }
};

// Auto-run test when imported
if (typeof window !== 'undefined') {
  // Run test after a short delay to ensure everything is loaded
  setTimeout(() => {
    testGymServiceApi();
  }, 1000);
}