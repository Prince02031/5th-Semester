DO $$
DECLARE
    n INTEGER := 28;
    divisor_sum INTEGER := 0;
    i INTEGER;
BEGIN
    RAISE NOTICE '--- Task 1: Perfect Number Check ---';
    RAISE NOTICE 'Checking number: %', n;

    IF n <= 0 THEN
        RAISE NOTICE 'The number % is not a positive integer, skipping check.', n;
        RETURN;
    END IF;

    FOR i IN 1 .. (n / 2) LOOP
        IF MOD(n, i) = 0 THEN
            divisor_sum := divisor_sum + i;
        END IF;
    END LOOP;

    IF divisor_sum = n THEN
        RAISE NOTICE 'Result: Perfect';
    ELSE
        RAISE NOTICE 'Result: Not Perfect';
    END IF;

    RAISE NOTICE '------------------------------------';
END $$;


CREATE OR REPLACE FUNCTION odd_even_counter(
    start_val INTEGER,
    end_val INTEGER
)
RETURNS VOID
AS $$
DECLARE
    odd_count INTEGER := 0;
    even_count INTEGER := 0;
    current_num INTEGER;
BEGIN
    RAISE NOTICE '--- Task 2: Odd/Even Counter ---';
    RAISE NOTICE 'Range to check: [%, %]', start_val, end_val;

    IF start_val > end_val THEN
        RAISE EXCEPTION 'Input error: start_val (%) must be less than or equal to end_val (%)',
            start_val, end_val;
    END IF;

    FOR current_num IN start_val .. end_val LOOP
        IF MOD(current_num, 2) = 0 THEN
            even_count := even_count + 1;
        ELSE
            odd_count := odd_count + 1;
        END IF;
    END LOOP;

    RAISE NOTICE 'Total Odd Numbers: %', odd_count;
    RAISE NOTICE 'Total Even Numbers: %', even_count;
    RAISE NOTICE '--------------------------------';
END;
$$ LANGUAGE plpgsql;

SELECT odd_even_counter(1, 10);
SELECT odd_even_counter(5, 12);