
-- TASK 1: Recursive task dependencies


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



-- TASK 2: Department-wise salary ranking


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



-- TASK 3: Salary difference using LAG


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



-- TASK 4: Employee hierarchy level & subordinates


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
    SELECT emp_id, emp_name, manager_id, 1 AS level
    FROM employees_hier
    WHERE manager_id IS NULL
    UNION ALL
    SELECT e.emp_id, e.emp_name, e.manager_id, o.level + 1
    FROM employees_hier e
    JOIN org o ON e.manager_id = o.emp_id
),
descendants AS (
    SELECT manager_id AS manager, emp_id AS subordinate
    FROM employees_hier
    WHERE manager_id IS NOT NULL
    UNION ALL
    SELECT d.manager, e.emp_id
    FROM descendants d
    JOIN employees_hier e ON e.manager_id = d.subordinate
),
sub_counts AS (
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
