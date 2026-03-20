-- DROP TABLE IF EXISTS employees CASCADE;
-- DROP TABLE IF EXISTS departments CASCADE;
-- DROP TABLE IF EXISTS salary_audit CASCADE;
-- DROP TABLE IF EXISTS employee_log CASCADE;

-- CREATE TABLE departments (
--     department_id   INT PRIMARY KEY,
--     dept_name       VARCHAR(50) NOT NULL,
--     location        VARCHAR(50),
--     budget          DECIMAL(12, 2)
-- );

-- CREATE TABLE employees (
--     employee_id       INT           PRIMARY KEY,
--     full_name         VARCHAR(100)  NOT NULL,
--     department_id     INT,
--     job_title         VARCHAR(50),
--     salary            DECIMAL(10,2),
--     hire_date         DATE,
--     is_active         BOOLEAN       DEFAULT TRUE,
--     performance_score DECIMAL(3,1),
--     bonus_percent     DECIMAL(5,2),
--     email             VARCHAR(100)  UNIQUE
-- );

-- CREATE TABLE salary_audit (
--     audit_id      SERIAL        PRIMARY KEY,
--     employee_id   INT           NOT NULL,
--     old_salary    DECIMAL(10,2),
--     new_salary    DECIMAL(10,2),
--     changed_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE employee_log (
--     log_id        SERIAL        PRIMARY KEY,
--     employee_id   INT           NOT NULL,
--     full_name     VARCHAR(100),
--     action        VARCHAR(20),
--     action_time   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
-- );

-- INSERT INTO departments (department_id, dept_name, location, budget) VALUES
-- (1, 'Engineering', 'New York',     500000.00),
-- (2, 'Marketing',   'Chicago',      200000.00),
-- (3, 'HR',          'Austin',       150000.00),
-- (4, 'Sales',       'Dallas',       300000.00),
-- (5, 'Finance',     'New York',     250000.00),
-- (6, 'Legal',       'San Francisco', 180000.00);

-- INSERT INTO employees VALUES
--  (1,  'Alice Johnson', 1, 'Senior Engineer',  95000.00, '2018-03-15', TRUE,  9.2, 15.00, 'alice@company.com'),
--  (2,  'Bob Smith',     1, 'Junior Engineer',  62000.00, '2021-07-01', TRUE,  7.4,  8.00, 'bob@company.com'),
--  (3,  'Carol White',   2, 'Marketing Lead',   78000.00, '2019-11-20', TRUE,  8.8, 12.00, 'carol@company.com'),
--  (4,  'David Brown',   2, 'Analyst',          55000.00, '2022-01-10', TRUE,  6.5,  5.00, 'david@company.com'),
--  (5,  'Eva Green',     3, 'HR Manager',       82000.00, '2017-06-05', TRUE,  9.0, 13.00, 'eva@company.com'),
--  (6,  'Frank Lee',     3, 'HR Specialist',    50000.00, '2023-03-22', TRUE,  7.1,  6.00, 'frank@company.com'),
--  (7,  'Grace Kim',     1, 'Tech Lead',       110000.00, '2015-09-30', TRUE,  9.7, 18.00, 'grace@company.com'),
--  (8,  'Henry Adams',   4, 'Sales Executive',  67000.00, '2020-05-14', TRUE,  7.8, 10.00, 'henry@company.com'),
--  (9,  'Iris Patel',    4, 'Sales Intern',     38000.00, '2023-08-01', FALSE, 6.0,  NULL, 'iris@company.com'),
--  (10, 'James Turner',  5, 'Finance Manager',  91000.00, '2016-12-01', FALSE, 8.3, 14.00, 'james@company.com');

--SELECT * FROM employees;
-- SELECT * FROM departments;


--COUNT
SELECT d.dept_name, COUNT(e.employee_id) AS total
FROM departments d
LEFT JOIN employees e ON d.department_id = e.department_id
GROUP BY d.dept_name
ORDER BY total DESC;

--CURSOR
CREATE OR REPLACE PROCEDURE list_inactive()
	LANGUAGE plpgsql AS $$
	DECLARE 
		cur CURSOR FOR 
			SELECT full_name, job_title, salary FROM employees
			WHERE is_active= FALSE;
		inactive_record RECORD;
	BEGIN
		OPEN cur;
		LOOP
			FETCH cur INTO inactive_record;
			EXIT WHEN NOT FOUND;

			RAISE NOTICE 'Employee: %, Salary: %', inactive_record.full_name, inactive_record.salary;
		END LOOP;
		CLOSE cur;
	END $$;

CALL list_inactive();
			
	

