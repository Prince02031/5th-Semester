#include <iostream>
#include <vector>
#include <algorithm>
#include <iomanip>
using namespace std;

struct Process {
    int id;
    int arrival_time;
    int burst_time;
    int completion_time;
    int waiting_time;
    int turn_around_time;
    int remaining; // Remaining Time for preemption

    // --- Your Implementation Goes Here ---
    void preemptiveSJF(vector<Process>& processes) {
        int n = processes.size();
        int currentTime = 0;
        int completed = 0;
        
        // Initialize remaining time for each process
        for (auto& p : processes) {
            p.remaining = p.burst_time;
        }
        
        // Keep track of which process is currently running
        int shortestRemaining = -1;
        
        while (completed < n) {
            // Find process with shortest remaining time among arrived processes
            shortestRemaining = -1;
            int minRemaining = 9999;
            
            for (int i = 0; i < n; i++) {
                if (processes[i].arrival_time <= currentTime && processes[i].remaining > 0) {
                    if (processes[i].remaining < minRemaining) {
                        minRemaining = processes[i].remaining;
                        shortestRemaining = i;
                    }
                    // Tie-breaking: if same remaining time, pick the one with earliest arrival
                    else if (processes[i].remaining == minRemaining && shortestRemaining != -1) {
                        if (processes[i].arrival_time < processes[shortestRemaining].arrival_time) {
                            shortestRemaining = i;
                        }
                    }
                }
            }
            
            // If no process is available, increment time
            if (shortestRemaining == -1) {
                currentTime++;
                continue;
            }
            
            // Execute the selected process for 1 time unit
            processes[shortestRemaining].remaining--;
            currentTime++;
            
            // Check if process is completed
            if (processes[shortestRemaining].remaining == 0) {
                completed++;
                processes[shortestRemaining].completion_time = currentTime;
                processes[shortestRemaining].turn_around_time = 
                    processes[shortestRemaining].completion_time - processes[shortestRemaining].arrival_time;
                processes[shortestRemaining].waiting_time = 
                    processes[shortestRemaining].turn_around_time - processes[shortestRemaining].burst_time;
            }
        }
    }
    
    // Function to print the results
    static void printResults(vector<Process>& processes) {
        cout << "\n" << string(70, '=') << endl;
        cout << "|" << setw(8) << "ID" 
             << "|" << setw(12) << "Arrival Time" 
             << "|" << setw(10) << "Burst Time" 
             << "|" << setw(15) << "Completion Time" 
             << "|" << setw(15) << "Turnaround Time" 
             << "|" << setw(12) << "Waiting Time" << "|" << endl;
        cout << string(70, '=') << endl;
        
        float totalTAT = 0, totalWT = 0;
        
        for (const auto& p : processes) {
            cout << "|" << setw(8) << p.id 
                 << "|" << setw(12) << p.arrival_time 
                 << "|" << setw(10) << p.burst_time 
                 << "|" << setw(15) << p.completion_time 
                 << "|" << setw(15) << p.turn_around_time 
                 << "|" << setw(12) << p.waiting_time << "|" << endl;
            
            totalTAT += p.turn_around_time;
            totalWT += p.waiting_time;
        }
        
        cout << string(70, '=') << endl;
        cout << "\nAverage Turnaround Time: " << (totalTAT / processes.size()) << endl;
        cout << "Average Waiting Time: " << (totalWT / processes.size()) << endl;
    }
};

int main() {
    vector<Process> processes = {
        {1, 0, 6, 0, 0, 0, 0},
        {2, 2, 4, 0, 0, 0, 0},
        {3, 4, 2, 0, 0, 0, 0},
        {4, 6, 5, 0, 0, 0, 0}
    };
    
    Process scheduler;
    scheduler.preemptiveSJF(processes);
    Process::printResults(processes);
    
    return 0;
}