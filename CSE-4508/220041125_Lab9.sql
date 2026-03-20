--task 1 
--contains repeating groups (Product1, Product2, etc)
--suffers from redundancy, as customer and product details are repeated in multiple rows


-- 1NF table
CREATE TABLE Orders_1NF (
    OrderID INT,
    OrderDate DATE,
    CustomerID INT,
    CustomerName VARCHAR(100),
    CustomerPhone VARCHAR(20),
    CustomerAddress VARCHAR(255),
    ProductID INT,
    ProductName VARCHAR(100),
    ProductPrice DECIMAL(10,2),
    ProductQty INT,
	PaymentMethod VARCHAR(50),
	PaymentStatus VARCHAR(50),
    PRIMARY KEY (ORDERID, PRODUCTID)
);

SELECT * FROM Orders_Unnormalized

--2NF tables

CREATE TABLE Customers_2NF (
	CustomerID INT PRIMARY KEY,
    CustomerName VARCHAR(100),
    CustomerPhone VARCHAR(20),
    CustomerAddress VARCHAR(255)
);

CREATE TABLE Products_2NF (
	ProductID INT PRIMARY KEY,
	ProductName VARCHAR(100),
	ProductPrice DECIMAL(10,2)
);

CREATE TABLE Orders_2NF (
	OrderID INT PRIMARY KEY,
	OrderDate DATE,
	CustomerID INT REFERENCES Customers_2NF(CustomerID),
	PaymentMethod VARCHAR(50),
    PaymentStatus VARCHAR(50)
	
);

CREATE TABLE OrderDetails_2NF (
	OrderID INT REFERENCES Orders_2NF(OrderID),
	ProductID INT REFERENCES Products_2NF(ProductID),
	ProductQty INT,
	PRIMARY KEY (OrderID, ProductID)
);
	
--3NF tables (only orders table is changed)

CREATE TABLE Orders_3NF (
	OrderID INT PRIMARY KEY,
	OrderDate DATE,
	CustomerID INT REFERENCES Customers_2NF(CustomersID),
	PaymentTypeID INT REFERENCES PaymentTypes_3NF(PaymentTypeID)
);

CREATE TABLE PaymentTypes_3NF (
	PaymentTypeID SERIAL INT PRIMARY KEY,
	PaymentMethod VARCHAR(50) UNIQUE,
	DefaultStatus VARCHAR(50) 
);


--task 5
--insert anomaly: cannot add a new product to the system unless someone buys
--Update Anomaly:Changing a customer’s address requires updating every single row they appear in
--Delete Anomaly:Deleting an order might accidentally erase the only existing record of a specific product's price or name