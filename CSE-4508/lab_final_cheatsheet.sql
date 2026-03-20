-- -------Basic DDL commands----------

-- ---CREATE
-- Create a new database
CREATE DATABASE shop_db;

-- Create a table with specific constraints
CREATE TABLE table_name (
    column1_name datatype PRIMARY KEY,
    column2_name datatype NOT NULL,
    column3_name datatype UNIQUE,
    column4_name datatype DEFAULT current_timestamp
);

-- Create an index (for speed)
CREATE INDEX idx_customer_name ON Customers(CustomerName);

-- Create a view (a saved query)
CREATE VIEW active_orders AS 
SELECT * FROM Orders WHERE PaymentStatus = 'Paid';

-- ---ALTER

-- Add a new column
ALTER TABLE table_name ADD COLUMN new_col_name datatype;

-- Drop a column
ALTER TABLE table_name DROP COLUMN col_name;

-- Rename a column
ALTER TABLE table_name RENAME COLUMN old_name TO new_name;

-- Change a data type
ALTER TABLE table_name ALTER COLUMN col_name TYPE new_datatype;

-- Rename the table
ALTER TABLE table_name RENAME TO new_table_name;



-- ---DROP AND TRUNCATE

-- Remove the table and all data permanently
DROP TABLE IF EXISTS table_name;

-- Wipe all data from a table but keep the structure
TRUNCATE TABLE table_name;

-- Remove an index
DROP INDEX index_name;

-- -------Basic DML commands----------

-- ---INSERT

INSERT INTO Customers_2NF (CustomerID, CustomerName, CustomerPhone, CustomerAddress)
VALUES (17, 'Italo Calvino', '0123456789', 'Turin');

INSERT INTO Products_2NF (ProductID, ProductName, ProductPrice)
VALUES 
    (401, 'Webcam', 3500.00),
    (402, 'Microphone', 5500.00);

--insert ftom another table
INSERT INTO Customers_2NF (CustomerID, CustomerName)
SELECT DISTINCT CustomerID, CustomerName FROM Orders_Unnormalized;

-- ---UPDATE

UPDATE Customers_2NF
SET CustomerPhone = '0199999999', CustomerAddress = 'Venice'
WHERE CustomerID = 1; -- THE MOST IMPORTANT LINE

-- ---DELETE

--specific delete

DELETE FROM OrderDetails_2NF
WHERE OrderID = 1016 AND ProductID = 307;

--delete all rows

DELETE FROM Orders_2NF;

-- -------Lab 1 task----------

--a. Employees of Branch A earning more than the overall average

SELECT COUNT(*) AS High_Earners_Branch_A
FROM Employee
WHERE BranchID = 'A' 
AND Salary > (SELECT AVG(Salary) FROM Employee);

--b. Name of the Branch/Department where "your_name" works

SELECT Name 
FROM Branch 
WHERE BID = (
    SELECT BranchID 
    FROM Employee 
    WHERE Name = 'saladin'
);

--c. Locations in ascending order of employee count

SELECT B.Location, COUNT(E.EID) AS Employee_Count
FROM Branch B
JOIN Employee E ON B.BID = E.BranchID
GROUP BY B.Location
ORDER BY Employee_Count ASC;

-- -------Lab 2----------
-- ---basic block with variables and exceptions

DO $$
DECLARE
    v_salary NUMERIC;
    v_bonus NUMERIC := 1000;
BEGIN
    SELECT salary INTO v_salary FROM employees WHERE employee_id = 101;
    
    IF v_salary > 5000 THEN
        v_salary := v_salary + v_bonus;
    END IF;
    
    RAISE NOTICE 'Updated salary: %', v_salary;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE NOTICE 'Employee not found.';
    WHEN OTHERS THEN
        RAISE NOTICE 'An error occurred.';
END $$;

-- ---functions

--scalar functions
CREATE OR REPLACE FUNCTION dept_count(p_dept_name VARCHAR(20)) 
RETURNS INTEGER AS $$
DECLARE
    d_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO d_count 
    FROM instructor 
    WHERE dept_name = p_dept_name;
    
    RETURN d_count;
END;
$$ LANGUAGE plpgsql;

--table functions

CREATE OR REPLACE FUNCTION instructor_of(p_dept_name CHAR(20))
RETURNS TABLE (ID VARCHAR(5), name VARCHAR(20), dept_name VARCHAR(20), salary NUMERIC(8,2)) AS $$
BEGIN
    RETURN QUERY 
    SELECT i.ID, i.name, i.dept_name, i.salary
    FROM instructor i
    WHERE i.dept_name = p_dept_name;
END;
$$ LANGUAGE plpgsql;

-- To run: SELECT * FROM instructor_of('Music');

-- ---Procedures

CREATE OR REPLACE PROCEDURE dept_count_proc(p_dept_name IN VARCHAR(20), INOUT d_count INTEGER) AS $$
BEGIN
    SELECT COUNT(*) INTO d_count
    FROM instructor
    WHERE dept_name = p_dept_name;
END;
$$ LANGUAGE plpgsql;

-- To run:
-- CALL dept_count_proc('Physics', 0);

-- ---Language Constructs

--Conditionals

DO $$
DECLARE
    num INTEGER := 7;
BEGIN
    IF MOD(num, 2) = 0 THEN
        RAISE NOTICE 'The number is even.';
    ELSE
        RAISE NOTICE 'The number is odd.';
    END IF;
END $$;

--Loops

-- WHILE Loop
DO $$
DECLARE
    counter INTEGER := 1;
BEGIN
    WHILE counter <= 5 LOOP
        RAISE NOTICE 'Number: %', counter;
        counter := counter + 1;
    END LOOP;
END $$;

-- FOR Loop
DO $$
BEGIN
    FOR i IN 1..5 LOOP
        RAISE NOTICE 'Number: %', i;
    END LOOP;
END $$;

-- ---Mathematical functions

DO $$
DECLARE
    num NUMERIC := 16;
    num1 INTEGER := 10;
    num2 INTEGER := 3;
    result NUMERIC;
BEGIN
    result := SQRT(num);
    RAISE NOTICE 'The square root of % is %', num, result;
    
    RAISE NOTICE 'The remainder when % is divided by % is %', num1, num2, MOD(num1, num2);
END $$;

-- ---Task 1: Check for Perfect Number
--A number is called perfect if it is equal to the sum of all its positive divisors excluding itself (for example, 6 and 28).

DO $$ 
DECLARE 
    n INTEGER := 28; -- Change this value to test different numbers
    sum_divisors INTEGER := 0;
    i INTEGER;
BEGIN 
    -- Loop from 1 to n-1 to find divisors
    FOR i IN 1..(n - 1) LOOP
        IF MOD(n, i) = 0 THEN
            sum_divisors := sum_divisors + i;
        END IF;
    END LOOP;

    -- Check if the sum of divisors equals the original number
    IF sum_divisors = n AND n > 0 THEN
        RAISE NOTICE 'Perfect';
    ELSE
        RAISE NOTICE 'Not Perfect';
    END IF;
END $$;

-- ---task 2: Odd and Even Counter Procedure

CREATE OR REPLACE PROCEDURE odd_even_counter(start_val INTEGER, end_val INTEGER) 
LANGUAGE plpgsql
AS $$
DECLARE
    odd_count INTEGER := 0;
    even_count INTEGER := 0;
    i INTEGER;
BEGIN
    -- Validation: ensure start_val is not greater than end_val
    IF start_val > end_val THEN
        RAISE NOTICE 'Error: start_val must be less than or equal to end_val';
        RETURN;
    END IF;

    -- Loop through the range [start_val, end_val]
    FOR i IN start_val..end_val LOOP
        IF MOD(i, 2) = 0 THEN
            even_count := even_count + 1;
        ELSE
            odd_count := odd_count + 1;
        END IF;
    END LOOP;

    -- Print the results
    RAISE NOTICE 'Total count of odd numbers: %', odd_count;
    RAISE NOTICE 'Total count of even numbers: %', even_count;
END;
$$;

-- To execute the procedure:
-- CALL odd_even_counter(1, 10);

-- -------Lab 3----------

-- ---task 1: Write a PL/SQL block that uses an explicit cursor to display all employees whose salary is greater than 50,000.

DO $$
DECLARE
    -- Define the explicit cursor
    cur_emp CURSOR FOR 
        SELECT name, salary FROM employees WHERE salary > 50000;
    emp_record RECORD;
BEGIN
    OPEN cur_emp;
    LOOP
        FETCH cur_emp INTO emp_record;
        EXIT WHEN NOT FOUND; -- Exit when no more rows
        
        RAISE NOTICE 'Employee: %, Salary: %', emp_record.name, emp_record.salary;
    END LOOP;
    CLOSE cur_emp;
END $$;

-- ---task 2: Cursor with FOR UPDATE and WHERE CURRENT OF
--Update the salary of employees in department 20 by increasing it by 10% using a cursor and WHERE CURRENT OF

DO $$
DECLARE
    -- 'FOR UPDATE' locks the rows for the duration of the transaction
    cur_sal CURSOR FOR 
        SELECT salary FROM employees WHERE department_id = 20 FOR UPDATE;
    v_salary NUMERIC;
BEGIN
    OPEN cur_sal;
    LOOP
        FETCH cur_sal INTO v_salary;
        EXIT WHEN NOT FOUND;
        
        -- Apply update directly to the row currently held by the cursor
        UPDATE employees 
        SET salary = salary * 1.10 
        WHERE CURRENT OF cur_sal;
    END LOOP;
    CLOSE cur_sal;
END $$;

-- ---task 3: BEFORE INSERT Trigger
-- Create a BEFORE INSERT trigger on the students table to automatically set created_at to the current timestamp

-- Step 1: Create the Trigger Function
CREATE OR REPLACE FUNCTION set_student_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    -- In PostgreSQL, NEW refers to the row being inserted
    NEW.created_at := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Bind the Function to the Table as a Trigger
CREATE TRIGGER trg_students_created_at
BEFORE INSERT ON students
FOR EACH ROW
EXECUTE FUNCTION set_student_timestamp();

-- ---Task 4: AFTER INSERT Trigger
-- Create an AFTER INSERT trigger on the employees table to log IDs and timestamps into an emp_audit table

-- Step 1: Create the Audit Function
CREATE OR REPLACE FUNCTION log_employee_audit()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert the ID of the newly created employee into the audit table
    INSERT INTO emp_audit (employee_id, audit_timestamp)
    VALUES (NEW.employee_id, CURRENT_TIMESTAMP);
    
    RETURN NEW; -- For AFTER triggers, the return value is ignored but required
END;
$$ LANGUAGE plpgsql;

-- Step 2: Bind the Function to the Table
CREATE TRIGGER trg_employees_audit
AFTER INSERT ON employees
FOR EACH ROW
EXECUTE FUNCTION log_employee_audit();

-- -------Lab 4----------

-- ======================================================================================
-- TASK 1: Increase manager salary (<30k) by 10%, decrease assistant manager salary (>20k) 
-- by 10%, and show total affected rows using an implicit cursor[cite: 1101].
-- ======================================================================================
CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    salary DECIMAL(10, 2),
    designation VARCHAR(50)
);

INSERT INTO employee (name, salary, designation) VALUES
('Alice Johnson', 25000, 'manager'),           
('Bob Smith', 35000, 'manager'),               
('Charlie Brown', 22000, 'assistant manager'), 
('Diana Prince', 18000, 'assistant manager'), 
('Edward Norton', 29000, 'manager'),           
('Fiona Gallagher', 21000, 'assistant manager');

DO $$
DECLARE
    rows_affected INTEGER;
BEGIN
    UPDATE employee
    SET salary = CASE 
        WHEN designation = 'manager' AND salary < 30000 THEN salary * 1.10
        WHEN designation = 'assistant manager' AND salary > 20000 THEN salary * 0.90
        ELSE salary
    END
    WHERE (designation = 'manager' AND salary < 30000)
       OR (designation = 'assistant manager' AND salary > 20000);

    -- Use GET DIAGNOSTICS to mimic SQL%ROWCOUNT (implicit cursor attribute) [cite: 959]
    GET DIAGNOSTICS rows_affected = ROW_COUNT;

    RAISE NOTICE 'Total rows affected: %', rows_affected;
END $$;


-- ======================================================================================
-- TASK 2: Create a function that calculates a user's total transactions and uses a cursor 
-- to determine the correct loan scheme (S-A, S-B, S-C) from the loan_type table[cite: 1105].
-- ======================================================================================
CREATE TABLE transactions (
    User_ID INT,
    Amount DECIMAL(15, 2),
    T_Date DATE
);

CREATE TABLE loan_type (
    Scheme INT, -- 1 for S-A, 2 for S-B, 3 for S-C
    Installment_Number INT,
    Charge DECIMAL(5, 2),
    Min_Trans DECIMAL(15, 2)
);

INSERT INTO loan_type (Scheme, Installment_Number, Charge, Min_Trans) VALUES
(1, 30, 0.05, 2000000), 
(2, 20, 0.10, 1000000), 
(3, 15, 0.15, 500000);  

INSERT INTO transactions (User_ID, Amount, T_Date) VALUES
(101, 500000, '2025-01-01'),
(101, 750000, '2025-02-15'),
(102, 300000, '2025-03-10');

CREATE OR REPLACE FUNCTION get_eligible_loan_scheme(p_user_id INT)
RETURNS TEXT AS $$
DECLARE
    total_val DECIMAL(15, 2);
    scheme_record RECORD;
    result_scheme TEXT := 'No eligible scheme found';
    
    -- Explicit cursor to iterate through schemes in descending order of eligibility [cite: 1106]
    cur_schemes CURSOR FOR 
        SELECT Scheme, Min_Trans 
        FROM loan_type 
        ORDER BY Min_Trans DESC;
BEGIN
    SELECT SUM(Amount) INTO total_val 
    FROM transactions 
    WHERE User_ID = p_user_id;

    IF total_val IS NULL THEN
        total_val := 0;
    END IF;

    OPEN cur_schemes;
    LOOP
        FETCH cur_schemes INTO scheme_record;
        EXIT WHEN NOT FOUND;

        IF total_val >= scheme_record.Min_Trans THEN
            result_scheme := 'Scheme Number: ' || scheme_record.Scheme;
            EXIT; 
        END IF;
    END LOOP;
    CLOSE cur_schemes;

    RETURN result_scheme;
END;
$$ LANGUAGE plpgsql;

-- Testing Task 2
SELECT get_eligible_loan_scheme(101);
SELECT get_eligible_loan_scheme(102);


-- ======================================================================================
-- TASK 3.1: Write a trigger to automatically initialize a new customer's bill to 0 
-- in the BILL table upon creation[cite: 1107].
-- ======================================================================================
CREATE OR REPLACE FUNCTION initialize_customer_bill()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO BILL (SSN, Month, Year, amount)
    VALUES (NEW.SSN, 
            EXTRACT(MONTH FROM CURRENT_DATE), 
            EXTRACT(YEAR FROM CURRENT_DATE), 
            0);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_init_bill
AFTER INSERT ON CUSTOMER
FOR EACH ROW
EXECUTE FUNCTION initialize_customer_bill();


-- ======================================================================================
-- TASK 3.2: Write a trigger that updates the customer's monthly bill amount after 
-- each phone call based on their specific pricing plan[cite: 1108].
-- ======================================================================================
CREATE OR REPLACE FUNCTION update_bill_after_call()
RETURNS TRIGGER AS $$
DECLARE
    call_cost DECIMAL(10, 2);
    v_plan_code VARCHAR;
BEGIN
    -- Get plan code for the customer who made the call
    SELECT Plan INTO v_plan_code 
    FROM CUSTOMER 
    WHERE SSN = NEW.SSN;

    -- Calculate cost: ConnectionFee + (Seconds * PricePerSecond)
    SELECT (ConnectionFee + (NEW.Seconds * PricePerSecond)) INTO call_cost
    FROM PRICINGPLAN
    WHERE Code = v_plan_code;
    
    -- Update existing bill for that specific customer, month, and year
    UPDATE BILL
    SET amount = amount + call_cost
    WHERE SSN = NEW.SSN 
      AND Month = EXTRACT(MONTH FROM NEW.Date)
      AND Year = EXTRACT(YEAR FROM NEW.Date);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_bill
AFTER INSERT ON PHONECALL
FOR EACH ROW
EXECUTE FUNCTION update_bill_after_call();


-- ======================================================================================
-- TASK 4.1: Create a function and trigger to automatically generate a student ID 
-- in the format YY00DPSXX upon insertion[cite: 1113, 1116].
-- ======================================================================================
CREATE SEQUENCE student_id_seq START 1;

CREATE TABLE Student (
    ID VARCHAR(10),
    Date_of_Admission DATE,
    Department CHAR(1),
    Program CHAR(1),
    Section CHAR(1)
);

CREATE OR REPLACE FUNCTION Gen_ID(
    p_date DATE, 
    p_dept CHAR, 
    p_prog CHAR, 
    p_sec CHAR
) RETURNS VARCHAR AS $$
DECLARE
    v_year VARCHAR(2);
    v_seq_num VARCHAR(2);
    v_new_id VARCHAR(10);
BEGIN
    v_year := TO_CHAR(p_date, 'YY');    
    v_seq_num := LPAD(NEXTVAL('student_id_seq')::TEXT, 2, '0');
    v_new_id := v_year || '00' || p_dept || p_prog || p_sec || v_seq_num;
    
    RETURN v_new_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION trg_set_student_id()
RETURNS TRIGGER AS $$
BEGIN
    -- Set the ID using the Gen_ID function before the record is saved [cite: 1116]
    NEW.ID := Gen_ID(NEW.Date_of_Admission, NEW.Department, NEW.Program, NEW.Section);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER student_id_trigger
BEFORE INSERT ON Student
FOR EACH ROW
EXECUTE FUNCTION trg_set_student_id();

-- Testing Task 4.1
INSERT INTO Student (Date_of_Admission, Department, Program, Section) VALUES 
('2023-08-15', '1', '2', '3'),
('2025-02-10', '4', '5', '6'),
('2025-11-20', '2', '1', '1');

SELECT * FROM Student;


-- ======================================================================================
-- TASK 4.2: Use an explicit cursor in a procedure to update all account balances by 
-- adding interest based on daily, monthly, or yearly periods (GP)[cite: 1117].
-- ======================================================================================
CREATE TABLE Accounts (
    ID INT PRIMARY KEY,
    Name VARCHAR(100),
    AccCode VARCHAR(20),
    Balance DECIMAL(15, 2),
    LastDateofInterest DATE
);

CREATE TABLE AccountProperties (
    ID INT PRIMARY KEY,
    Name VARCHAR(100),
    interestRate DECIMAL(5, 2),
    GP INT, -- 1: Daily, 2: Monthly, 3: Yearly
    CONSTRAINT fk_account FOREIGN KEY(ID) REFERENCES Accounts(ID)
);

INSERT INTO Accounts (ID, Name, AccCode, Balance, LastDateofInterest) VALUES
(101, 'John Doe', 'SAV-001', 5000.00, '2025-12-15'), 
(102, 'Jane Smith', 'CUR-002', 12000.00, '2025-11-01'), 
(103, 'Alice Wong', 'FIX-003', 25000.00, '2024-12-18'); 

INSERT INTO AccountProperties (ID, Name, interestRate, GP) VALUES
(101, 'John Doe', 0.05, 1),  
(102, 'Jane Smith', 1.50, 2), 
(103, 'Alice Wong', 6.00, 3); 

CREATE OR REPLACE PROCEDURE update_account_interest()
LANGUAGE plpgsql
AS $$
DECLARE
    -- Explicit cursor to fetch all accounts and their properties [cite: 1117]
    cur_accounts CURSOR FOR 
        SELECT a.ID, a.Balance, a.LastDateofInterest, ap.interestRate, ap.GP
        FROM Accounts a
        JOIN AccountProperties ap ON a.ID = ap.ID;
        
    rec RECORD;
    interest_amount DECIMAL(15, 2);
    days_passed INTEGER;
    months_passed INTEGER;
    years_passed INTEGER;
    should_update BOOLEAN;
BEGIN
    OPEN cur_accounts;
    LOOP
        FETCH cur_accounts INTO rec;
        EXIT WHEN NOT FOUND;
        
        should_update := FALSE;
        interest_amount := 0;

        -- Daily Interest calculation (GP = 1)
        IF rec.GP = 1 THEN
            days_passed := CURRENT_DATE - rec.LastDateofInterest;
            IF days_passed >= 1 THEN
                interest_amount := rec.Balance * (rec.interestRate / 100) * days_passed;
                should_update := TRUE;
            END IF;
            
        -- Monthly Interest calculation (GP = 2)
        ELSIF rec.GP = 2 THEN
            months_passed := EXTRACT(YEAR FROM AGE(CURRENT_DATE, rec.LastDateofInterest)) * 12 +
                             EXTRACT(MONTH FROM AGE(CURRENT_DATE, rec.LastDateofInterest));
            IF months_passed >= 1 THEN
                interest_amount := rec.Balance * (rec.interestRate / 100) * months_passed;
                should_update := TRUE;
            END IF;

        -- Yearly Interest calculation (GP = 3)
        ELSIF rec.GP = 3 THEN
            years_passed := EXTRACT(YEAR FROM AGE(CURRENT_DATE, rec.LastDateofInterest));
            IF years_passed >= 1 THEN
                interest_amount := rec.Balance * (rec.interestRate / 100) * years_passed;
                should_update := TRUE;
            END IF;
        END IF;

        IF should_update THEN
            UPDATE Accounts
            SET Balance = Balance + interest_amount,
                LastDateofInterest = CURRENT_DATE
            WHERE ID = rec.ID;
        END IF;
    END LOOP;
    CLOSE cur_accounts;
END;
$$;

-- -------Lab 5--------

-- ======================================================================================
-- TASK 1: Recursive Task Dependencies
-- Generate a full list of all task and prerequisite task pairs, including both direct 
-- and indirect (nested) dependencies using a recursive CTE.
-- ======================================================================================
DROP TABLE IF EXISTS project_tasks;
CREATE TABLE project_tasks (
    task_id TEXT PRIMARY KEY,
    task_name TEXT,
    depends_on TEXT,
    duration_days INTEGER
);

INSERT INTO project_tasks VALUES
('T1', 'Setup Environment', NULL, 2),
('T2', 'Design Database', 'T1', 3),
('T3', 'Develop Backend', 'T2', 5),
('T4', 'Develop Frontend', 'T2', 4),
('T5', 'Integrate Backend', 'T3', 2),
('T6', 'Integrate Frontend', 'T4', 2),
('T7', 'Final Testing', 'T5', 3),
('T7b','Final Testing', 'T6', 3);

WITH RECURSIVE all_prereqs AS (
    SELECT task_id AS task, depends_on AS prereq
    FROM project_tasks
    WHERE depends_on IS NOT NULL
    UNION
    SELECT ap.task, pt.depends_on
    FROM all_prereqs ap
    JOIN project_tasks pt ON pt.task_id = ap.prereq
    WHERE pt.depends_on IS NOT NULL
)
SELECT DISTINCT task AS task_id, prereq AS depends_on
FROM all_prereqs
ORDER BY task_id, depends_on;


-- ======================================================================================
-- TASK 2: Department-wise Salary Ranking
-- Rank employees within each department based on their salary using DENSE_RANK() 
-- to ensure employees with the same salary share the same rank.
-- ======================================================================================
DROP TABLE IF EXISTS employees_rank;
CREATE TABLE employees_rank (
    emp_id INTEGER PRIMARY KEY,
    name TEXT,
    department TEXT,
    salary NUMERIC
);

INSERT INTO employees_rank VALUES
(1, 'Hasan', 'IT', 80000),
(2, 'Tania', 'IT', 75000),
(3, 'Riad',  'HR', 60000),
(4, 'Mitu',  'HR', 60000);

SELECT
    emp_id,
    name,
    department,
    salary,
    DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank
FROM employees_rank
ORDER BY department, dept_rank, emp_id;


-- ======================================================================================
-- TASK 3: Salary Difference using LAG
-- Analyze salary differences by comparing an employee's salary to the previous 
-- employee's salary (ordered by salary) to identify pay gaps.
-- ======================================================================================
DROP TABLE IF EXISTS employees_salarydiff;
CREATE TABLE employees_salarydiff (
    emp_id INTEGER PRIMARY KEY,
    name TEXT,
    salary INTEGER
);

INSERT INTO employees_salarydiff VALUES
(1,'Ayan',40000),(2,'Bithi',45000),(3,'Chayan',43000),
(4,'Danish',47000),(5,'Elina',42000),(6,'Farhan',48000),
(7,'Gita',46000),(8,'Hasan',44000),(9,'Iqbal',41000),
(10,'Joya',45000);

SELECT
    emp_id,
    name,
    salary,
    salary - LAG(salary) OVER (ORDER BY salary, emp_id) AS salary_difference
FROM employees_salarydiff
ORDER BY salary, emp_id;


-- ======================================================================================
-- TASK 4: Employee Hierarchy Level & Subordinates
-- Recursively identify reporting relationships to determine hierarchical levels and 
-- calculate the total count of direct and indirect subordinates.
-- ======================================================================================
DROP TABLE IF EXISTS employees_hier;
CREATE TABLE employees_hier (
    emp_id INTEGER PRIMARY KEY,
    emp_name TEXT,
    manager_id INTEGER,
    department TEXT
);

INSERT INTO employees_hier VALUES
(1,'Rahim',NULL,'Admin'),
(2,'Karim',1,'IT'),
(3,'Salma',1,'Finance'),
(4,'Anika',2,'IT'),
(5,'Fahim',2,'IT'),
(6,'Rafi',3,'Finance'),
(7,'Nusrat',NULL,'HR'),
(8,'Imran',7,'HR'),
(9,'Tithi',8,'HR');

WITH RECURSIVE org AS (
    -- Base case: Top-level employees (Level 1)
    SELECT emp_id, emp_name, manager_id, 1 AS level
    FROM employees_hier
    WHERE manager_id IS NULL
    UNION ALL
    -- Recursive member: Add 1 to level for each reporting relationship
    SELECT e.emp_id, e.emp_name, e.manager_id, o.level + 1
    FROM employees_hier e
    JOIN org o ON e.manager_id = o.emp_id
),
descendants AS (
    -- Map all direct and indirect subordinates for each manager
    SELECT manager_id AS manager, emp_id AS subordinate
    FROM employees_hier
    WHERE manager_id IS NOT NULL
    UNION ALL
    SELECT d.manager, e.emp_id
    FROM descendants d
    JOIN employees_hier e ON e.manager_id = d.subordinate
),
sub_counts AS (
    -- Count distinct subordinates mapped in the descendants CTE
    SELECT manager, COUNT(DISTINCT subordinate) AS total_subordinates
    FROM descendants
    GROUP BY manager
)
SELECT
    o.emp_id,
    o.emp_name,
    o.manager_id,
    o.level,
    COALESCE(sc.total_subordinates, 0) AS total_subordinates
FROM org o
LEFT JOIN sub_counts sc ON sc.manager = o.emp_id
ORDER BY o.emp_id;

-- --------Lab 6---------

--task 1
SELECT EMP_NAME, DEPT_NAME
FROM EMPLOYEES E
INNER JOIN DEPARTMENTS D ON E.DEPT_ID=D.DEPT_ID

--task-2

SELECT EMP_NAME, DEPT_NAME
FROM EMPLOYEES E
LEFT JOIN DEPARTMENTS D ON E.DEPT_ID=D.DEPT_ID


--task 3

SELECT EMP_NAME, DEPT_NAME
FROM EMPLOYEES E
RIGHT JOIN DEPARTMENTS D ON E.DEPT_ID=D.DEPT_ID

--task 4

SELECT EMP_NAME, DEPT_NAME
FROM EMPLOYEES E
FULL OUTER JOIN DEPARTMENTS D ON E.DEPT_ID=D.DEPT_ID

--Task 5

SELECT EMP_NAME, DEPT_NAME
FROM EMPLOYEES E
CROSS JOIN DEPARTMENTS D;

--task 6

SELECT CONCAT(FIRST_NAME,' ', LAST_NAME) AS FULL_NAME
FROM CUSTOMERS;


--task 7

SELECT INITCAP(FIRST_NAME), INITCAP(LAST_NAME) FROM CUSTOMERS;

task 8

SELECT UPPER(FIRST_NAME), LOWER(EMAIL) FROM CUSTOMERS;

task 9

SELECT LOWER(EMAIL), LENGTH(EMAIL) FROM CUSTOMERS;

--task 10 

SELECT PHONE, LPAD(PHONE, 15, '*'), RPAD(PHONE, 15, '-') FROM CUSTOMERS;

--task 11

SELECT EMAIL, SUBSTRING(EMAIL FOR 4) AS first_4_chars, SUBSTRING(EMAIL FROM POSITION('@' IN EMAIL) + 1) AS domain_name
FROM CUSTOMERS;

-- --------Lab 8---------

-- 1 E-COMMERCE ANALYTICS WITH ROLLUP AND CUBE

-- TASK 1.1: Hierarchical summary of total sales revenue by region, country, and city 
-- using ROLLUP to include subtotals at each level.
SELECT region, country, city, SUM(unit_price * quantity) AS total_revenue
FROM sales_transactions
GROUP BY ROLLUP (region, country, city);

-- TASK 1.2: Multi-dimensional analysis using CUBE to calculate total revenue and 
-- average discount across category, subcategory, and region.
SELECT category, subcategory, region, 
       SUM(unit_price * quantity) AS total_revenue, 
       AVG(discount_percent) AS average_discount
FROM sales_transactions
GROUP BY CUBE (category, subcategory, region);



-- 2 DATE OPERATIONS


-- TASK 2.1: Format the transaction date to a full readable string (e.g., Monday, 15 January 2024) 
-- using TO_CHAR.
SELECT transaction_id, 
       TO_CHAR(transaction_date, 'FMDay, DD FMMonth YYYY') AS formatted_transaction_date
FROM sales_transactions;

-- TASK 2.2: Group transactions by month and year to calculate total volume and 
-- total revenue after discount.
SELECT TO_CHAR(transaction_date, 'Mon-YYYY') AS month_year, 
       COUNT(transaction_id) AS total_transactions, 
       SUM((unit_price * quantity) * (1 - discount_percent/100)) AS total_revenue
FROM sales_transactions
GROUP BY TO_CHAR(transaction_date, 'Mon-YYYY'), TO_DATE(TO_CHAR(transaction_date, 'Mon-YYYY'), 'Mon-YYYY')
ORDER BY TO_DATE(TO_CHAR(transaction_date, 'Mon-YYYY'), 'Mon-YYYY');

-- TASK 2.3: Calculate a 12-month warranty expiry date for all Electronics transactions 
-- using interval addition.
SELECT transaction_id, transaction_date, 
       (transaction_date + INTERVAL '12 months') AS warranty_expiry_date
FROM sales_transactions
WHERE category = 'Electronics';

-- TASK 2.4: Calculate the age of each transaction in days relative to the reference 
-- date of 2024-03-01.
SELECT transaction_id, transaction_date, 
       (DATE '2024-03-01' - transaction_date) AS days_since_transaction
FROM sales_transactions;

-- TASK 2.5: Filter for older transactions that occurred more than 30 days prior 
-- to 2024-03-01.
SELECT transaction_id, transaction_date
FROM sales_transactions
WHERE (DATE '2024-03-01' - transaction_date) > 30;


-- ======================================================================================
-- 3 REGULAR EXPRESSION PATTERN MATCHING
-- ======================================================================================

-- TASK 3.1: Identify invalid email addresses that do not follow the standard 
-- 'username@domain.extension' format.
SELECT customer_id, email
FROM customers
WHERE email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';

-- TASK 3.2: Extract professional titles (e.g., Dr., Mr.) from customer names and 
-- display them alongside the name without the title.
SELECT 
    customer_name,
    SUBSTRING(customer_name FROM '^(Dr\.|Mr\.|Mrs\.|Ms\.|Prof\.)') AS title,
    REGEXP_REPLACE(customer_name, '^(Dr\.|Mr\.|Mrs\.|Ms\.|Prof\.)\s*', '') AS name_without_title
FROM customers;

-- --------Lab 9---------

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


