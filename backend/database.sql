-- COMPANY
CREATE TABLE COMPANY (
    CompanyID INT PRIMARY KEY,
    Name VARCHAR(255),
    Address VARCHAR(255)
);

-- EMPLOYEE
CREATE TABLE EMPLOYEE (
    EmployeeID INT PRIMARY KEY,
    Name VARCHAR(255),
    Role ENUM('Administrator', 'Executive', 'Senior Officer', 'Inventory Officer'),
    ContactInfo VARCHAR(255),
    Password VARCHAR(255)
);

INSERT INTO EMPLOYEE VALUES (1001, 'TestUser', 'Administrator', '0771234567', '123456');
-- ORDER
CREATE TABLE `ORDER` (
    OrderID INT PRIMARY KEY,
    ProductName VARCHAR(255),
    QtyOrdered INT,
    CompanyID INT,
    FOREIGN KEY (CompanyID) REFERENCES COMPANY(CompanyID)
);

-- TRUCKVISIT
CREATE TABLE TRUCKVISIT (
    VisitID INT PRIMARY KEY,
    VehicleNumber VARCHAR(50),
    DriverName VARCHAR(255),
    ArrivalTime DATETIME,
    LeaveTime DATETIME,
    NumSacks INT,
    CompanyID INT,
    TruckType ENUM('Loading', 'Unloading'),
    SE_ID INT,
    EO_ID INT,
    FOREIGN KEY (CompanyID) REFERENCES COMPANY(CompanyID),
    FOREIGN KEY (SE_ID) REFERENCES EMPLOYEE(EmployeeID),
    FOREIGN KEY (EO_ID) REFERENCES EMPLOYEE(EmployeeID)
);

-- EMPLOYEE EFFICIENCY
CREATE TABLE EMPLOYEEEFFICIENCY (
    EfficiencyID INT PRIMARY KEY,
    EmployeeID INT,
    Date DATE,
    WorkingHours DECIMAL(5,2),
    TrucksManaged INT,
    FOREIGN KEY (EmployeeID) REFERENCES EMPLOYEE(EmployeeID)
);

-- BAY
CREATE TABLE BAY (
    BayID INT PRIMARY KEY,
    LocationDescription VARCHAR(255)
);

-- BAY OPERATION
CREATE TABLE BAYOPERATION (
    BayOpID INT PRIMARY KEY,
    BayInTime DATETIME,
    BayOutTime DATETIME,
    DelayMinutes INT,
    VisitID INT,
    EO_ID INT,
    BayID INT,
    FOREIGN KEY (VisitID) REFERENCES TRUCKVISIT(VisitID),
    FOREIGN KEY (EO_ID) REFERENCES EMPLOYEE(EmployeeID),
    FOREIGN KEY (BayID) REFERENCES BAY(BayID)
);

-- COUNTER VERIFICATION
CREATE TABLE COUNTERVERIFICATION (
    VerifID INT PRIMARY KEY,
    ManualCount INT,
    AICount INT,
    SacksNoError INT,
    OverlapPairs INT,
    OverlapPositions VARCHAR(255),
    VerifTime DATETIME,
    VisitID INT,
    IO_ID INT,
    FOREIGN KEY (VisitID) REFERENCES TRUCKVISIT(VisitID),
    FOREIGN KEY (IO_ID) REFERENCES EMPLOYEE(EmployeeID)
);
