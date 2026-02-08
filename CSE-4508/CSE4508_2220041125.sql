--SELECT * FROM sales_transactions;

-- --task 1.1
-- SELECT region, country, city, SUM(unit_price * quantity) AS total_revenue
-- FROM sales_transactions
-- GROUP BY ROLLUP (region, country, city);

--task 1.2
SELECT category, subcategory, region, SUM(unit_price * quantity) AS total_revenue, AVG(discount_percent) AS average_discount
FROM sales_transactions
GROUP BY CUBE (category, subcategory, region);

-- --task 2.1
-- SELECT transaction_id, TO_CHAR(transaction_date, 'FMDay, DD FMMonth YYYY') AS formatted_transaction_date
-- FROM sales_transactions;

-- --task 2.2
-- SELECT TO_CHAR(transaction_date, 'Mon-YYYY') AS month_year, COUNT(transaction_id) AS total_transactions, SUM((unit_price * quantity) * (1 - discount_percent/100)) AS total_revenue
-- FROM sales_transactions
-- GROUP BY TO_CHAR(transaction_date, 'Mon-YYYY'), TO_DATE(TO_CHAR(transaction_date, 'Mon-YYYY'), 'Mon-YYYY')
-- ORDER BY TO_DATE(TO_CHAR(transaction_date, 'Mon-YYYY'), 'Mon-YYYY');

--task 2.3
SELECT transaction_id, transaction_date, (transaction_date + INTERVAL '12 months') AS warranty_expiry_date
FROM sales_transactions
WHERE category = 'Electronics';

-- --task 2.4
-- SELECT transaction_id, transaction_date, (DATE '2024-03-01' - transaction_date) AS days_since_transaction
-- FROM sales_transactions;

-- --task 2.5
-- SELECT transaction_id, transaction_date
-- FROM sales_transactions
-- WHERE (DATE '2024-03-01' - transaction_date) > 30;

-- --task 2.6


