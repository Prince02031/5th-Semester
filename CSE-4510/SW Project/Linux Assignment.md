Part 1:

1.  mkdir linux_assignment
2. cd linux_assignment
3. mkdir Documents

Part 2:

1. touch report.txt 
2. touch notes.log
3. echo "Experiment data collected on 2024-01-01" > data.csv
4.  cp "Academic Catalogue.pdf" /home/prince0203/linux_assignmen
t/Documents
less "Academic Catalogue.pdf"

Part 3:

1. cp report.txt /home/prince0203/linux_assignment/Documents
2. mv notes.log server_logs.txt
3. mv data.csv Documents/
4. mkdir temp
5. rmdir temp
6. cp -r Documents/ backup/


Part 4:

1. find . -name "server_logs.txt"
./prince0203/linux_assignment/Documents/server_logs.txt

2. grep "Experiment" /home/prince0203/linux_assignment/Documents/data.csv
	Experiment data collected on 2024-01-01

3.  du -h
	11M     ./Documents
	11M     .

4. chmod 600 server_logs.txt
5. chown prince2 server_logs.txt


Part 5:

1. head -n 5 server_logs.txt
2.  rm -r linux_assignment