const axios = require('axios');

const testOrderUpdate = async () => {
  try {
    const orderId = '68472501ab4a1bf62c2912ae';
    const token = 'your_admin_token_here'; // Replace with actual admin token
    
    // Test getting the order first
    const getResponse = await axios.get(`http://localhost:5000/api/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('Order retrieved successfully:', getResponse.data);
    
    // Test updating the order
    const updateData = {
      status: 'accepted',
      orderItems: getResponse.data.orderItems
    };
    
    const updateResponse = await axios.put(`http://localhost:5000/api/orders/${orderId}`, updateData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('Order updated successfully:', updateResponse.data);
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};

// testOrderUpdate();
