#include <iostream>
#include <vector>
#include <algorithm>
#include <queue>
#include <climits>
using namespace std;

// Shared Process struct
struct Process {
    int id;
    int at;        // Arrival Time
    int bt;        // Burst Time
    int priority;  // Lower number = higher priority (used in Priority Scheduling)
    int ct;        // Completion Time
    int tat;       // Turnaround Time  = CT - AT
    int wt;        // Waiting Time     = TAT - BT
    int remaining; // Remaining Burst Time (for preemptive algorithms)
};

// Reset computed fields before each algorithm run
void reset(vector<Process>& proc) {
    for (auto& p : proc)
        p.ct = p.tat = p.wt = 0, p.remaining = p.bt;
}

// Shared print helper (called by each algorithm's print fn)
void printTable(const string& name, const vector<Process>& proc) {
    float totalTAT = 0, totalWT = 0;
    cout << "\n=== " << name << " ===\n";
    cout << "PID\tAT\tBT\tPriority\tCT\tTAT\tWT\n";
    for (const auto& p : proc) {
        cout << p.id << "\t" << p.at << "\t" << p.bt << "\t"
             << p.priority << "\t\t" << p.ct << "\t" << p.tat << "\t" << p.wt << "\n";
        totalTAT += p.tat;
        totalWT  += p.wt;
    }
    cout << "Avg TAT: " << totalTAT / proc.size()
         << "  Avg WT: " << totalWT  / proc.size() << "\n";
}


// 1. FCFS — First Come First Serve (Non-preemptive)
// Sort by AT. Run each to completion in arrival order.
void fcfs(vector<Process>& proc) {
    // Sort by arrival time (tie: lower id first)
    sort(proc.begin(), proc.end(), [](const Process& a, const Process& b) {
        return a.at != b.at ? a.at < b.at : a.id < b.id;
    });

    int currentTime = 0;
    for (auto& p : proc) {
        // If CPU is idle, jump to process arrival
        if (currentTime < p.at)
            currentTime = p.at;

        currentTime += p.bt;       // run to completion
        p.ct  = currentTime;
        p.tat = p.ct - p.at;
        p.wt  = p.tat - p.bt;
    }
}

void printFCFS(const vector<Process>& proc) {
    printTable("FCFS — First Come First Serve (Non-preemptive)", proc);
}


// 2. SJF — Shortest Job First (Non-preemptive)
// At each dispatch point, pick the arrived process with the shortest BT.
// Once started, runs to completion.
void sjf(vector<Process>& proc) {
    int n = proc.size();
    int currentTime = 0, completed = 0;
    vector<bool> done(n, false);

    while (completed < n) {
        // Find shortest BT among arrived, not-done processes
        int idx = -1, minBT = INT_MAX;
        for (int i = 0; i < n; i++) {
            if (!done[i] && proc[i].at <= currentTime) {
                if (proc[i].bt < minBT ||
                   (proc[i].bt == minBT && proc[i].at < proc[idx].at)) {
                    minBT = proc[i].bt;
                    idx = i;
                }
            }
        }

        if (idx == -1) { currentTime++; continue; }  // CPU idle

        // Run to completion (non-preemptive)
        currentTime    += proc[idx].bt;
        proc[idx].ct    = currentTime;
        proc[idx].tat   = proc[idx].ct - proc[idx].at;
        proc[idx].wt    = proc[idx].tat - proc[idx].bt;
        done[idx]       = true;
        completed++;
    }
}

void printSJF(const vector<Process>& proc) {
    printTable("SJF — Shortest Job First (Non-preemptive)", proc);
}


// 3. SRTF — Shortest Remaining Time First (Preemptive SJF)
// Every tick: pick the arrived process with least remaining.
// New arrival with shorter burst preempts current process.
void srtf(vector<Process>& proc) {
    int n = proc.size();
    int currentTime = 0, completed = 0;

    while (completed < n) {
        int idx = -1, minRem = INT_MAX;

        for (int i = 0; i < n; i++) {
            if (proc[i].at <= currentTime && proc[i].remaining > 0) {
                if (proc[i].remaining < minRem ||
                   (proc[i].remaining == minRem && proc[i].at < proc[idx].at)) {
                    minRem = proc[i].remaining;
                    idx = i;
                }
            }
        }

        if (idx == -1) { currentTime++; continue; }  // CPU idle

        proc[idx].remaining--;
        currentTime++;

        if (proc[idx].remaining == 0) {
            completed++;
            proc[idx].ct  = currentTime;
            proc[idx].tat = proc[idx].ct - proc[idx].at;
            proc[idx].wt  = proc[idx].tat - proc[idx].bt;
        }
    }
}

void printSRTF(const vector<Process>& proc) {
    printTable("SRTF — Shortest Remaining Time First (Preemptive SJF)", proc);
}


// 4. Priority Scheduling (Preemptive)
// Every tick: pick arrived process with lowest priority number.
// Lower number = higher urgency. Can preempt current process.
void priorityScheduling(vector<Process>& proc) {
    int n = proc.size();
    int currentTime = 0, completed = 0;

    while (completed < n) {
        int idx = -1, bestPrio = INT_MAX;

        for (int i = 0; i < n; i++) {
            if (proc[i].at <= currentTime && proc[i].remaining > 0) {
                if (proc[i].priority < bestPrio ||
                   (proc[i].priority == bestPrio && proc[i].at < proc[idx].at)) {
                    bestPrio = proc[i].priority;
                    idx = i;
                }
            }
        }

        if (idx == -1) { currentTime++; continue; }  // CPU idle

        proc[idx].remaining--;
        currentTime++;

        if (proc[idx].remaining == 0) {
            completed++;
            proc[idx].ct  = currentTime;
            proc[idx].tat = proc[idx].ct - proc[idx].at;
            proc[idx].wt  = proc[idx].tat - proc[idx].bt;
        }
    }
}

void printPriority(const vector<Process>& proc) {
    printTable("Priority Scheduling (Preemptive, lower number = higher priority)", proc);
}


// 5. Round Robin
// Each process gets at most TQ ticks per turn.
// After TQ ticks (or if finished), move to next in queue.
void roundRobin(vector<Process>& proc, int TQ = 2) {
    int n = proc.size();
    int currentTime = 0, completed = 0;
    queue<int> readyQueue;
    vector<bool> isAdded(n, false);

    // Seed queue with processes arriving at time 0
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

            int execTime = min(proc[i].remaining, TQ);
            proc[i].remaining -= execTime;
            currentTime       += execTime;

            // Check new arrivals during this slice
            for (int j = 0; j < n; j++) {
                if (!isAdded[j] && proc[j].at <= currentTime) {
                    readyQueue.push(j);
                    isAdded[j] = true;
                }
            }

            if (proc[i].remaining == 0) {
                completed++;
                proc[i].ct  = currentTime;
                proc[i].tat = proc[i].ct - proc[i].at;
                proc[i].wt  = proc[i].tat - proc[i].bt;
            } else {
                readyQueue.push(i);  // not done → back of queue
            }
        } else {
            // CPU idle: advance to next arrival
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

void printRR(const vector<Process>& proc) {
    printTable("Round Robin (Time Quantum = 2)", proc);
}


// ─────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────
int main() {
    int n, TQ;
    cout << "Enter number of processes: ";
    cin >> n;

    vector<Process> proc(n);
    for (int i = 0; i < n; i++) {
        proc[i].id = i + 1;
        cout << "Process " << i + 1 << " (AT, BT, Priority): ";
        cin >> proc[i].at >> proc[i].bt >> proc[i].priority;
    }

    cout << "Enter Time Quantum for Round Robin: ";
    cin >> TQ;

    vector<Process> p;

    p = proc; reset(p); fcfs(p);               printFCFS(p);
    p = proc; reset(p); sjf(p);                printSJF(p);
    p = proc; reset(p); srtf(p);               printSRTF(p);
    p = proc; reset(p); priorityScheduling(p); printPriority(p);
    p = proc; reset(p); roundRobin(p, TQ);     printRR(p);

    return 0;
}

// Compile: g++ -std=c++17 all_schedulers.cpp -o all_schedulers
// Run:     ./all_schedulers
