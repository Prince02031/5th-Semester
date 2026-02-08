--Task 1

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

    
    GET DIAGNOSTICS rows_affected = ROW_COUNT;

  
    RAISE NOTICE 'Total rows affected: %', rows_affected;

--Task 2

	Table for transactions
CREATE TABLE transactions (
    User_ID INT,
    Amount DECIMAL(15, 2),
    T_Date DATE
);


CREATE TABLE loan_type (
    -- Scheme INT, 1 for S-A, 2 for S-B, 3 for S-C
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



SELECT get_eligible_loan_scheme(101);


SELECT get_eligible_loan_scheme(102);


--task 3

--3a

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

--3b
CREATE OR REPLACE FUNCTION update_bill_after_call()
RETURNS TRIGGER AS $$
DECLARE
    call_cost DECIMAL(10, 2);
    v_plan_code VARCHAR;
BEGIN

    SELECT Plan INTO v_plan_code 
    FROM CUSTOMER 
    WHERE SSN = NEW.SSN;


    SELECT (ConnectionFee + (NEW.Seconds * PricePerSecond)) INTO call_cost
    FROM PRICINGPLAN
    WHERE Code = v_plan_code;
	
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

--task 4

--4a

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
   
    NEW.ID := Gen_ID(NEW.Date_of_Admission, NEW.Department, NEW.Program, NEW.Section);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--trigger
CREATE TRIGGER student_id_trigger
BEFORE INSERT ON Student
FOR EACH ROW
EXECUTE FUNCTION trg_set_student_id();



INSERT INTO Student (Date_of_Admission, Department, Program, Section) VALUES 
('2023-08-15', '1', '2', '3'),
('2025-02-10', '4', '5', '6'),
('2025-11-20', '2', '1', '1');


SELECT * FROM Student;

--4b

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

        
        IF rec.GP = 1 THEN
         
            days_passed := CURRENT_DATE - rec.LastDateofInterest;
            IF days_passed >= 1 THEN
                interest_amount := rec.Balance * (rec.interestRate / 100) * days_passed;
                should_update := TRUE;
            END IF;
            
        ELSIF rec.GP = 2 THEN
          
            months_passed := EXTRACT(YEAR FROM AGE(CURRENT_DATE, rec.LastDateofInterest)) * 12 +
                             EXTRACT(MONTH FROM AGE(CURRENT_DATE, rec.LastDateofInterest));
            IF months_passed >= 1 THEN
                interest_amount := rec.Balance * (rec.interestRate / 100) * months_passed;
                should_update := TRUE;
            END IF;

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