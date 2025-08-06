# Oriental Insurance Virtual Office - Policy Registration Testing Guide

## 🎯 Enhanced Policy Registration System

### What's New:

1. **Comprehensive Data Collection**: Enhanced form with policy-specific fields
2. **Real Backend Integration**: Policies are created and stored automatically
3. **File-Based Storage**: No MySQL dependency - uses JSON files for data persistence
4. **Dynamic Form Fields**: Form adapts based on selected policy type
5. **Policy Preview**: Live preview of policy details and benefits
6. **Complete Data Validation**: Frontend and backend validation
7. **Automatic Policy Number Generation**: Unique policy numbers per type

### 🚀 How to Test the Enhanced Policy System:

#### Step 1: Access the Virtual Office

1. Open the browser with the virtual office page (already opened)
2. Click on any of the navigation cards for "POLICIES"

#### Step 2: Fill the Enhanced Policy Form

1. **Basic Information**:

   - Full Name: Enter your complete name
   - Email: Valid email address
   - Phone: Contact number with country code
   - Date of Birth: Select your DOB
   - Annual Income: Choose income range

2. **Select Policy Type**: Choose from:

   - **Motor Insurance**: For vehicle protection
   - **Health Insurance**: For medical coverage
   - **Home Insurance**: For property protection
   - **Travel Insurance**: For trip coverage

3. **Policy-Specific Details** (form adapts automatically):

   **For Motor Insurance**:

   - Vehicle Make & Model (e.g., Maruti Swift)
   - Manufacturing Year
   - Registration Number
   - Fuel Type

   **For Health Insurance**:

   - Sum Insured (₹3L to ₹25L)
   - Family Members coverage
   - Pre-existing conditions (optional)

   **For Home Insurance**:

   - Property Type (Apartment/House/Villa)
   - Built-up Area in sq ft
   - Property Value range
   - Construction Year

   **For Travel Insurance**:

   - Trip Type (Domestic/International)
   - Trip Duration
   - Destination Countries
   - Number of Travelers

#### Step 3: Review Policy Preview

- The form shows live preview with:
  - Estimated Premium
  - Coverage Amount
  - Key Features & Benefits

#### Step 4: Submit Application

- Click "Apply for Policy"
- Form validates all required fields
- Submits to backend API
- Creates policy with unique policy number

### 🔧 Backend Processing:

#### What Happens When You Submit:

1. **Data Validation**: Server validates all input fields
2. **User Creation**: Creates/finds user in the system
3. **Policy Generation**:
   - Generates unique policy number (e.g., HLT/2025/4567)
   - Calculates premium based on policy type
   - Sets coverage amounts and features
   - Creates policy record
4. **Response**: Returns complete policy details

#### Generated Policy Data Includes:

- **Policy Number**: Unique identifier
- **Premium Amount**: Calculated based on type and risk
- **Coverage Amount**: Protection limit
- **Policy Features**: List of covered benefits
- **Terms & Conditions**: Policy specific terms
- **Start/End Dates**: Policy validity period
- **Status**: Active status upon creation

### 📁 File Storage Structure:

```
backend/data/
├── users.json     -> User information
├── policies.json  -> All created policies
└── claims.json    -> Future claims data
```

### 🎉 Success Response:

After successful submission, you'll see:

- **Policy Confirmation**: Complete policy details
- **Policy Number**: Your unique reference
- **Next Steps**: What happens next
- **Features**: All included benefits
- **Contact Information**: Support details

### 🧪 Test Different Scenarios:

1. **Test All Policy Types**: Try creating different insurance policies
2. **Validation Testing**: Submit with missing required fields
3. **Email Validation**: Try invalid email formats
4. **Policy Preview**: Change policy types to see dynamic previews
5. **Backend Response**: Check network tab to see API responses

### 📊 Verify Data Storage:

Check the backend data files:

```powershell
# View created policies
Get-Content "backend/data/policies.json" | ConvertFrom-Json | Format-Table

# View created users
Get-Content "backend/data/users.json" | ConvertFrom-Json | Format-Table
```

### 🔄 API Endpoints Available:

- `POST /api/policies/register` - Create new policy
- `GET /api/policies` - List all policies
- `GET /api/policies/:id` - Get specific policy

### 💡 Key Features Demonstrated:

1. **Dynamic UI**: Form changes based on policy type
2. **Real-time Validation**: Immediate feedback on errors
3. **Policy Calculation**: Automatic premium and coverage calculation
4. **Data Persistence**: Policies stored permanently
5. **Professional UX**: Loading states, success messages, error handling
6. **Comprehensive Coverage**: All major insurance types supported

### 🎯 Next Steps for Production:

1. **Database Integration**: Replace file storage with MySQL/PostgreSQL
2. **Payment Gateway**: Integrate payment processing
3. **Email Notifications**: Send policy documents via email
4. **SMS Integration**: Premium payment reminders
5. **Document Upload**: Policy document management
6. **Renewal System**: Automatic renewal notifications

This system provides a complete policy registration experience with backend integration, ready for production deployment with minimal changes.
