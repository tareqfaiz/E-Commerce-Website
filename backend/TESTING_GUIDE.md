# Order Management System - Testing Guide

## Overview
This guide provides comprehensive testing instructions for the order management system implementation.

## Prerequisites
- MongoDB running locally or connection string configured
- Backend server running on port 5001
- Frontend development server running on port 5173

## Backend API Testing

### 1. Authentication Setup
Before testing order endpoints, ensure you have:
- User authentication token (obtained from `/auth/login`)
- Admin authentication token (obtained from `/auth/admin/login`)

### 2. Order Endpoints Testing

#### **GET /orders**
```bash
curl -X GET http://localhost:5001/orders \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### **GET /orders/:id**
```bash
curl -X GET http://localhost:5001/orders/ORDER_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### **POST /orders**
```bash
curl -X POST http://localhost:5001/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "PRODUCT_ID",
        "quantity": 2,
        "price": 29.99
      }
    ],
    "shippingAddress": {
      "street": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "zipCode": "12345",
      "country": "USA"
    },
    "paymentMethod": "credit_card",
    "totalAmount": 59.98
  }'
```

#### **PUT /orders/:id/status**
```bash
curl -X PUT http://localhost:5001/orders/ORDER_ID/status \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "processing",
    "notes": "Order is being prepared"
  }'
```

#### **DELETE /orders/:id**
```bash
curl -X DELETE http://localhost:5001/orders/ORDER_ID \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

#### **GET /orders/:id/timeline**
```bash
curl -X GET http://localhost:5001/orders/ORDER_ID/timeline \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### **POST /orders/:id/notes**
```bash
curl -X POST http://localhost:5001/orders/ORDER_ID/notes \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "note": "Customer requested expedited shipping",
    "type": "admin"
  }'
```

#### **GET /admin/orders**
```bash
curl -X GET http://localhost:5001/admin/orders \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

## Frontend Component Testing

### 1. OrderManagement Component Tests

#### **Test 1: Component Rendering**
- [ ] Component loads without errors
- [ ] All UI elements are visible
- [ ] Loading state displays correctly

#### **Test 2: Order List Display**
- [ ] Orders are displayed in a table format
- [ ] Status badges show correct colors
- [ ] Customer information is displayed correctly
- [ ] Pagination works as expected

#### **Test 3: Filtering and Search**
- [ ] Search by order ID works
- [ ] Filter by status works
- [ ] Filter by date range works
- [ ] Clear filters functionality works

#### **Test 4: Status Updates**
- [ ] Status update modal opens correctly
- [ ] Status dropdown shows correct options
- [ ] Status update reflects immediately
- [ ] Timeline updates after status change

#### **Test 5: Responsive Design**
- [ ] Mobile view displays correctly
- [ ] Tablet view displays correctly
- [ ] Desktop view displays correctly
- [ ] All buttons are accessible on mobile

### 2. Integration Tests

#### **Test 1: API Communication**
- [ ] Orders load from backend
- [ ] Status updates are sent to backend
- [ ] Error messages display correctly
- [ ] Loading states work properly

#### **Test 2: Authentication**
- [ ] Protected routes require authentication
- [ ] Admin-only features are restricted
- [ ] Token expiration is handled gracefully

## Test Data Setup

### Sample Order Data
```json
{
  "items": [
    {
      "productId": "64a1b2c3d4e5f6g7h8i9j0k1",
      "name": "Premium Wireless Headphones",
      "quantity": 1,
      "price": 199.99,
      "image": "/uploads/headphones.jpg"
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "street": "123 Main Street",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94105",
    "country": "USA"
  },
  "paymentMethod": "credit_card",
  "paymentStatus": "paid",
  "totalAmount": 199.99,
  "shippingCost": 9.99,
  "tax": 16.99,
  "status": "pending"
}
```

## Testing Checklist

### Backend Tests
- [ ] All endpoints return correct status codes
- [ ] Authentication middleware works correctly
- [ ] Data validation is working
- [ ] Error handling is appropriate
- [ ] Database operations are successful
- [ ] Admin-only routes are protected

### Frontend Tests
- [ ] Component renders without errors
- [ ] API calls are successful
- [ ] User interactions work correctly
- [ ] Error states are handled
- [ ] Loading states are displayed
- [ ] Responsive design works

### Integration Tests
- [ ] Frontend-backend communication works
- [ ] Authentication flow is complete
- [ ] Data synchronization is working
- [ ] Error handling is consistent

## Manual Testing Steps

1. **Start MongoDB**: Ensure MongoDB is running locally or configure connection string
2. **Start Backend**: `npm run dev` in backend directory
3. **Start Frontend**: `npm run dev` in frontend directory
4. **Create Test User**: Register a new user account
5. **Create Test Orders**: Use the frontend to create sample orders
6. **Test Admin Features**: Log in as admin and test order management
7. **Verify All Features**: Go through each feature systematically

## Common Issues and Solutions

### MongoDB Connection Error
- **Issue**: `ECONNREFUSED ::1:27017`
- **Solution**: Start MongoDB service or check connection string in .env file

### CORS Issues
- **Issue**: Frontend can't connect to backend
- **Solution**: Ensure CORS is properly configured in backend

### Authentication Issues
- **Issue**: 401 Unauthorized errors
- **Solution**: Ensure tokens are properly included in requests
