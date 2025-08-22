# Employee Efficiency System

## Overview
The Employee Efficiency System is a comprehensive tracking and analytics solution for monitoring employee performance in the Serendib Warehouse Management System. It tracks employee login/logout times, work hours, and truck management activities to calculate efficiency metrics.

## System Architecture

### Database Tables

#### 1. EMPLOYEE_LOGIN_SESSION
Tracks individual employee login sessions with precise timing.
- `SessionID`: Unique identifier for each session
- `EmployeeID`: Reference to employee
- `LoginTime`: When the employee logged in
- `LogoutTime`: When the employee logged out
- `DurationSeconds`: Calculated session duration

#### 2. EMPLOYEE_WORK_HOURS
Aggregates daily work hours for each employee.
- `RecordID`: Unique identifier
- `EmployeeID`: Reference to employee
- `Date`: Date of work
- `TotalWorkHours`: Total hours worked on that date
- `TotalSessions`: Number of login sessions that day
- `LastUpdated`: Timestamp of last update

#### 3. EMPLOYEE_TRUCK_MANAGEMENT
Tracks trucks managed by employees during their sessions.
- `RecordID`: Unique identifier
- `SessionID`: Reference to login session
- `EmployeeID`: Reference to employee
- `VisitID`: Reference to truck visit
- `TruckNumber`: Vehicle registration number
- `DriverName`: Name of the driver
- `OperationType`: Loading or Unloading
- `SessionStartTime`: When the session started
- `SessionEndTime`: When the session ended

### User Roles
The system supports four user roles:

#### Employee Roles (for efficiency tracking):
1. **Executive Officer**: Manages overall operations
2. **Security Officer**: Handles security and access control
3. **Inventory Officer**: Manages inventory and stock

#### Administrative Role:
4. **Administrator**: System administrator with full access (not tracked for efficiency)

## API Endpoints

### Employee Management
- `GET /api/employees` - Get all employees with efficiency metrics
- `GET /api/employees/monthly` - Get current month efficiency data
- `GET /api/employees/:employeeID/efficiency/:startDate/:endDate` - Get efficiency for date range
- `GET /api/employees/:employeeID/sessions/:date` - Get login sessions for specific date
- `GET /api/employees/summary` - Get performance summary

### Truck Management
- `GET /api/employees/sessions/:sessionID/trucks` - Get trucks managed in session
- `POST /api/employees/truck-management` - Add truck management record
- `PUT /api/employees/truck-management/:recordID` - Update truck management record
- `DELETE /api/employees/truck-management/:recordID` - Delete truck management record

### Authentication
- `POST /api/auth/login` - Employee login (automatically tracks session)
- `POST /api/auth/logout` - Employee logout (automatically updates work hours)
- `GET /api/auth/check-session` - Check current session status

## Efficiency Calculation

### Formula
Employee efficiency is calculated using a weighted scoring system:

**Efficiency = Trucks Efficiency (60%) + Work Hours Efficiency (40%)**

#### Trucks Efficiency
- Base: 60 points maximum
- Formula: `min((totalTrucksManaged / 50) * 60, 60)`
- Target: 50 trucks managed = 100% trucks efficiency

#### Work Hours Efficiency
- Base: 40 points maximum
- Formula: `min((totalWorkHours / 160) * 40, 40)`
- Target: 160 hours = 100% work hours efficiency

### Example Calculation
For an employee with:
- 30 trucks managed: `(30/50) * 60 = 36 points`
- 120 work hours: `(120/160) * 40 = 30 points`
- **Total Efficiency: 66%**

## Frontend Components

### 1. Employees.jsx
Main dashboard component displaying:
- Employee efficiency cards with circular progress bars
- Color-coded efficiency levels (Green: 80%+, Yellow: 60%+, Orange: 40%+, Red: <40%)
- Toggle between "All Time" and "This Month" views
- Search functionality
- Summary statistics

### 2. TruckManagementTracker.jsx
Component for managing truck management records:
- Add/edit/delete truck management records
- Associate trucks with employee sessions
- Track loading/unloading operations
- Session timing information

## Data Flow

### Login Process
1. User enters credentials (Employee or Administrator)
2. System validates and creates login session
3. Session ID is stored in user session
4. **For Employees**: Login time is recorded in `EMPLOYEE_LOGIN_SESSION`
5. **For Administrators**: No efficiency tracking (full system access)

### Logout Process
1. User logs out
2. **For Employees**: 
   - System calculates session duration
   - Updates `EMPLOYEE_LOGIN_SESSION` with logout time
   - Adds work hours to `EMPLOYEE_WORK_HOURS`
3. **For Administrators**: No efficiency tracking updates
4. Session is destroyed

### Truck Management
1. Employee manages trucks during their session
2. System records truck management activities
3. Associates trucks with employee sessions
4. Tracks operation types (Loading/Unloading)

## Implementation Notes

### Backend Changes
- **authController.js**: Enhanced to track login/logout sessions
- **authModel.js**: Added session management functions
- **employeeModel.js**: Completely rewritten for efficiency tracking
- **employeeController.js**: New efficiency calculation logic
- **employeeRoutes.js**: Expanded API endpoints

### Frontend Changes
- **Employees.jsx**: Enhanced with new metrics and views
- **RoleSelector.jsx**: Updated role names
- **TruckManagementTracker.jsx**: New component for truck tracking
- **index.css**: Added new color variables

### Database Changes
- New tables for session tracking and work hours
- Updated employee roles
- Foreign key relationships for data integrity

## Usage Instructions

### For Employees
1. Login with your credentials
2. Your session is automatically tracked
3. Manage trucks during your session
4. Logout when finished (work hours automatically calculated)

### For Managers
1. View employee efficiency dashboard
2. Monitor work hours and truck management
3. Track performance trends
4. Identify areas for improvement

### For Administrators
1. Access truck management tracker
2. Add/edit truck management records
3. Monitor system performance
4. Generate efficiency reports

## Benefits

1. **Accurate Time Tracking**: Precise login/logout timing
2. **Performance Metrics**: Comprehensive efficiency calculations
3. **Data Integrity**: Relational database with proper constraints
4. **Real-time Updates**: Live efficiency calculations
5. **Historical Data**: Track performance over time
6. **Role-based Access**: Secure access control

## Future Enhancements

1. **Real-time Notifications**: Alert managers of performance issues
2. **Advanced Analytics**: Trend analysis and predictions
3. **Mobile App**: On-the-go efficiency tracking
4. **Integration**: Connect with other warehouse systems
5. **Reporting**: Automated performance reports
6. **Goal Setting**: Individual and team performance targets

## Troubleshooting

### Common Issues
1. **Session not tracking**: Check database connection and session middleware
2. **Efficiency not calculating**: Verify data in all related tables
3. **Login errors**: Ensure employee exists and credentials are correct
4. **API errors**: Check endpoint URLs and request format

### Debug Mode
Enable detailed logging in the backend for troubleshooting:
```javascript
console.log('Session data:', sessionData);
console.log('Work hours calculation:', workHours);
```

## Support

For technical support or questions about the Employee Efficiency System, please contact the development team or refer to the system documentation.
