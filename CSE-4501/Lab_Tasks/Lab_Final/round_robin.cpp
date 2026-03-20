#include <iostream>
#include <vector>
#include <algorithm>
#include <iomanip>
#include <queue>
using namespace std;

struct Process {
    int id;
    int at;           // Arrival Time
    int bt;           // Burst Time
    int priority;     // For priority variants
    int ct, tat, wt;  // Completion, Turnaround, Waiting Times
    int remaining_bt; // Remaining Burst Time
};

void findScheduling(vector<Process>& proc, int n) {
    int TQ = 2; // Time Quantum as specified
    int currentTime = 0;
    int completed = 0;
    queue<int> readyQueue;
    vector<bool> isAdded(n, false);

    // Initial: Add processes that arrived at time 0
    for (int i = 0; i < n; i++) {
        if (proc[i].at <= currentTime) {
            readyQueue.push(i);
            isAdded[i] = true;
        }
    }

    while (completed < n) {
        if (!readyQueue.empty()) {
            int i = readyQueue.front();
            readyQueue.pop();

            // Execute for TQ or remaining time, whichever is smaller
            int executeTime = min(proc[i].remaining_bt, TQ);
            proc[i].remaining_bt -= executeTime;
            currentTime += executeTime;

            // Check for new arrivals during the execution window
            for (int j = 0; j < n; j++) {
                if (!isAdded[j] && proc[j].at <= currentTime) {
                    readyQueue.push(j);
                    isAdded[j] = true;
                }
            }

            if (proc[i].remaining_bt == 0) {
                completed++;
                proc[i].ct = currentTime;
                proc[i].tat = proc[i].ct - proc[i].at;
                proc[i].wt = proc[i].tat - proc[i].bt;
            } else {
                // Not finished? Back to the end of the queue
                readyQueue.push(i);
            }
        } else {
            // CPU Idle: Move to the next arrival time
            currentTime++;
            for (int j = 0; j < n; j++) {
                if (!isAdded[j] && proc[j].at <= currentTime) {
                    readyQueue.push(j);
                    isAdded[j] = true;
                }
            }
        }
    }
}

void display(const vector<Process>& proc, int n) {
    float total_tat = 0, total_wt = 0;
    cout << "\nPID\tAT\tBT\tCT\tTAT\tWT\n";
    for (int i = 0; i < n; i++) {
        cout << proc[i].id << "\t" << proc[i].at << "\t" << proc[i].bt << "\t"
                  << proc[i].ct << "\t" << proc[i].tat << "\t" << proc[i].wt << "\n";
        total_tat += proc[i].tat;
        total_wt += proc[i].wt;
    }
    cout << fixed << setprecision(2);
    cout << "\nAverage Turnaround Time: " << total_tat / n;
    cout << "\nAverage Waiting Time: " << total_wt / n << endl;
}

int main() {
    int n;
    cout << "Enter number of processes: ";
    cin >> n;
    vector<Process> proc(n);

    for (int i = 0; i < n; i++) {
        proc[i].id = i + 1;
        cout << "Process " << i + 1 << " (AT, BT, Priority): ";
        cin >> proc[i].at >> proc[i].bt >> proc[i].priority;
        proc[i].remaining_bt = proc[i].bt;
    }

    findScheduling(proc, n);
    display(proc, n);

    return 0;
}