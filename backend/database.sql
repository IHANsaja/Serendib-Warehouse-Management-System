-- COMPANY
CREATE TABLE COMPANY (
    CompanyID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    Address VARCHAR(255),
    Email VARCHAR(255),
    ContactPerson VARCHAR(255),
    Phone VARCHAR(50)
);

-- EMPLOYEE
CREATE TABLE EMPLOYEE (
    EmployeeID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    Role ENUM('Administrator', 'Executive Officer', 'Security Officer', 'Inventory Officer') NOT NULL,
    ContactInfo VARCHAR(255),
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(255)
);

-- Insert sample employees
INSERT INTO EMPLOYEE VALUES (1001, 'TestUser', 'Administrator', '0771234567', '123456', 'admin@serendib.com');
INSERT INTO EMPLOYEE VALUES (1002, 'Jane Doe', 'Executive Officer', 'jane.doe@example.com', 'execpassword', 'jane@serendib.com');
INSERT INTO EMPLOYEE VALUES (1003, 'John Smith', 'Security Officer', '0719876543', 'senpassword', 'john@serendib.com');
INSERT INTO EMPLOYEE VALUES (1004, 'Alice Brown', 'Inventory Officer', 'alice.b@example.com', 'invenpassword', 'alice@serendib.com');

-- BAY
CREATE TABLE BAY (
    BayID INT PRIMARY KEY AUTO_INCREMENT,
    BayNumber VARCHAR(10) NOT NULL UNIQUE,
    LocationDescription VARCHAR(255),
    Type ENUM('Loading', 'Unloading') NOT NULL,
    Status ENUM('Available', 'Occupied', 'Maintenance') DEFAULT 'Available'
);

-- Insert sample bays (3 for loading, 3 for unloading)
INSERT INTO BAY VALUES (1, 'Bay 01', 'Loading Bay A - Main Entrance', 'Loading', 'Available');
INSERT INTO BAY VALUES (2, 'Bay 02', 'Loading Bay B - Side Entrance', 'Loading', 'Available');
INSERT INTO BAY VALUES (3, 'Bay 03', 'Loading Bay C - Rear Entrance', 'Loading', 'Available');
INSERT INTO BAY VALUES (4, 'Bay 04', 'Unloading Bay D - Main Exit', 'Unloading', 'Available');
INSERT INTO BAY VALUES (5, 'Bay 05', 'Unloading Bay E - Side Exit', 'Unloading', 'Available');
INSERT INTO BAY VALUES (6, 'Bay 06', 'Unloading Bay F - Rear Exit', 'Unloading', 'Available');

-- Insert sample companies
INSERT INTO COMPANY VALUES (1, 'Serendib Tea Company', '123 Tea Garden Road, Kandy, Sri Lanka', 'tea@serendib.com', 'Ravi Perera', '0771234567');
INSERT INTO COMPANY VALUES (2, 'Ceylon Spice Traders', '456 Spice Lane, Colombo, Sri Lanka', 'spice@ceylon.com', 'Saman Silva', '0772345678');
INSERT INTO COMPANY VALUES (3, 'Highland Coffee Exporters', '789 Coffee Estate, Nuwara Eliya, Sri Lanka', 'coffee@highland.com', 'Kumar Fernando', '0773456789');
INSERT INTO COMPANY VALUES (4, 'Tropical Fruit Suppliers', '321 Fruit Valley, Galle, Sri Lanka', 'fruit@tropical.com', 'Priya Wijesinghe', '0774567890');
INSERT INTO COMPANY VALUES (5, 'Organic Herb Producers', '654 Herb Garden, Matale, Sri Lanka', 'herb@organic.com', 'Ajith Bandara', '0775678901');

-- ORDER (Email orders from companies)
CREATE TABLE `ORDER` (
    OrderID INT PRIMARY KEY AUTO_INCREMENT,
    CompanyID INT NOT NULL,
    DriverName VARCHAR(255) NOT NULL,
    VehicleNumber VARCHAR(50) NOT NULL,
    ItemCode VARCHAR(255) NOT NULL,
    Item VARCHAR(255) NOT NULL,
    Type ENUM('loading', 'unloading') NOT NULL,
    Quantity INT NOT NULL,
    OrderDate DATE NOT NULL,
    EstimatedBayInTime DATETIME,
    EstimatedBayOutTime DATETIME,
    Status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
    EO_ID INT NOT NULL,
    FOREIGN KEY (CompanyID) REFERENCES COMPANY(CompanyID),
    FOREIGN KEY (EO_ID) REFERENCES EMPLOYEE(EmployeeID)
);

-- TRUCK VISIT (Actual truck arrival and processing)
CREATE TABLE TRUCKVISIT (
    VisitID INT PRIMARY KEY AUTO_INCREMENT,
    OrderID INT NOT NULL,
    VehicleNumber VARCHAR(50) NOT NULL,
    DriverName VARCHAR(255) NOT NULL,
    CompanyID INT NOT NULL,
    Type ENUM('Loading', 'Unloading') NOT NULL,
    Quantity INT NOT NULL,
    EstimatedArrivalTime DATETIME NOT NULL,
    EstimatedLeaveTime DATETIME NOT NULL,
    ActualArrivalTime DATETIME,
    ActualLeaveTime DATETIME,
    Status ENUM('Scheduled', 'Arrived', 'At Bay', 'Completed', 'Left') DEFAULT 'Scheduled',
    SE_ID INT,
    EO_ID INT NOT NULL,
    FOREIGN KEY (OrderID) REFERENCES `ORDER`(OrderID),
    FOREIGN KEY (CompanyID) REFERENCES COMPANY(CompanyID),
    FOREIGN KEY (SE_ID) REFERENCES EMPLOYEE(EmployeeID),
    FOREIGN KEY (EO_ID) REFERENCES EMPLOYEE(EmployeeID)
);

-- BAY OPERATION (Bay assignment and timing)
CREATE TABLE BAYOPERATION (
    BayOpID INT PRIMARY KEY AUTO_INCREMENT,
    VisitID INT NOT NULL,
    BayID INT NOT NULL,
    EstimatedBayInTime DATETIME NOT NULL,
    EstimatedBayOutTime DATETIME NOT NULL,
    ActualBayInTime DATETIME,
    ActualBayOutTime DATETIME,
    Status ENUM('Scheduled', 'Bay In', 'Bay Out', 'Completed') DEFAULT 'Scheduled',
    EO_ID INT NOT NULL,
    FOREIGN KEY (VisitID) REFERENCES TRUCKVISIT(VisitID),
    FOREIGN KEY (BayID) REFERENCES BAY(BayID),
    FOREIGN KEY (EO_ID) REFERENCES EMPLOYEE(EmployeeID)
);

-- Insert sample orders (Email orders from companies)
INSERT INTO `ORDER` VALUES (1, 1, 'Ravi Perera', 'WP-KA-1234', 'TEA001', 'Ceylon Black Tea', 'loading', 500, '2024-01-15', '2024-01-15 08:15:00', '2024-01-15 11:45:00', 'Pending', 1002);
INSERT INTO `ORDER` VALUES (2, 2, 'Saman Silva', 'WP-CB-5678', 'SPC002', 'Cinnamon Sticks', 'loading', 200, '2024-01-16', '2024-01-16 09:15:00', '2024-01-16 12:45:00', 'Pending', 1002);
INSERT INTO `ORDER` VALUES (3, 3, 'Kumar Fernando', 'WP-NE-9012', 'COF003', 'Arabica Coffee Beans', 'loading', 300, '2024-01-17', '2024-01-17 07:45:00', '2024-01-17 11:15:00', 'Pending', 1002);
INSERT INTO `ORDER` VALUES (4, 4, 'Priya Wijesinghe', 'WP-GA-3456', 'FRT004', 'Mangoes', 'unloading', 150, '2024-01-18', '2024-01-18 10:15:00', '2024-01-18 13:45:00', 'Pending', 1002);
INSERT INTO `ORDER` VALUES (5, 5, 'Ajith Bandara', 'WP-MT-7890', 'HRB005', 'Lemongrass', 'loading', 100, '2024-01-19', '2024-01-19 08:45:00', '2024-01-19 12:15:00', 'Pending', 1002);

-- Insert sample truck visits with estimated times
INSERT INTO TRUCKVISIT VALUES (1, 1, 'WP-KA-1234', 'Ravi Perera', 1, 'Loading', 500, '2024-01-15 08:00:00', '2024-01-15 12:00:00', NULL, NULL, 'Scheduled', NULL, 1002);
INSERT INTO TRUCKVISIT VALUES (2, 2, 'WP-CB-5678', 'Saman Silva', 2, 'Loading', 200, '2024-01-16 09:00:00', '2024-01-16 13:00:00', NULL, NULL, 'Scheduled', NULL, 1002);
INSERT INTO TRUCKVISIT VALUES (3, 3, 'WP-NE-9012', 'Kumar Fernando', 3, 'Loading', 300, '2024-01-17 07:30:00', '2024-01-17 11:30:00', NULL, NULL, 'Scheduled', NULL, 1002);
INSERT INTO TRUCKVISIT VALUES (4, 4, 'WP-GA-3456', 'Priya Wijesinghe', 4, 'Unloading', 150, '2024-01-18 10:00:00', '2024-01-18 14:00:00', NULL, NULL, 'Scheduled', NULL, 1002);
INSERT INTO TRUCKVISIT VALUES (5, 5, 'WP-MT-7890', 'Ajith Bandara', 5, 'Loading', 100, '2024-01-19 08:30:00', '2024-01-19 12:30:00', NULL, NULL, 'Scheduled', NULL, 1002);

-- Insert sample bay operations with estimated times
INSERT INTO BAYOPERATION VALUES (1, 1, 1, '2024-01-15 08:15:00', '2024-01-15 11:45:00', NULL, NULL, 'Scheduled', 1002);
INSERT INTO BAYOPERATION VALUES (2, 2, 2, '2024-01-16 09:15:00', '2024-01-16 12:45:00', NULL, NULL, 'Scheduled', 1002);
INSERT INTO BAYOPERATION VALUES (3, 3, 1, '2024-01-17 07:45:00', '2024-01-17 11:15:00', NULL, NULL, 'Scheduled', 1002);
INSERT INTO BAYOPERATION VALUES (4, 4, 4, '2024-01-18 10:15:00', '2024-01-18 13:45:00', NULL, NULL, 'Scheduled', 1002);
INSERT INTO BAYOPERATION VALUES (5, 5, 2, '2024-01-19 08:45:00', '2024-01-19 12:15:00', NULL, NULL, 'Scheduled', 1002);

-- SESSIONS TABLE for express-mysql-session
CREATE TABLE `sessions` (
    `session_id` VARCHAR(128) NOT NULL,
    `expires` BIGINT UNSIGNED NOT NULL,
    `data` TEXT,
    PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;