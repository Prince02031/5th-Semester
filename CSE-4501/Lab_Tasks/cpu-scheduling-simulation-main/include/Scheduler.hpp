#ifndef SCHEDULER_HPP
#define SCHEDULER_HPP

#include "Process.hpp"
#include <vector>
#include <queue>

using namespace std;

// Base Scheduler class
class Scheduler {
public:
    virtual ~Scheduler() = default;

    // Adds a process to the ready queue (or similar structure)
    virtual void addProcess(Process* process) = 0;

    // Decides next process to run. Returns nullptr if no process is ready.
    virtual Process* nextProcess() = 0;
};

// These classes are to be implemented by the students

class FCFSScheduler : public Scheduler {
public:
    void addProcess(Process* process) override;
    Process* nextProcess() override;

private:
    queue<Process*> readyQueue;
};

class SJFScheduler : public Scheduler {
public:
    void addProcess(Process* process) override;
    Process* nextProcess() override;

private:
    vector<Process*> readyList;
    Process* currentProcess = nullptr;
};

class PreemptiveSJFScheduler : public Scheduler {
public:
    void addProcess(Process* process) override;
    Process* nextProcess() override;

private:
    vector<Process*> readyList;
};

class PriorityScheduler : public Scheduler {
public:
    void addProcess(Process* process) override;
    Process* nextProcess() override;

private:
    vector<Process*> readyList;
    Process* currentProcess = nullptr;
};

class RRScheduler : public Scheduler {
public:
    void addProcess(Process* process) override;
    Process* nextProcess() override;

private:
    int quanta = 2;
    int currentQuantumUsed = 0;
    queue<Process*> readyQueue;
    Process* currentProcess = nullptr;
};


#endif // SCHEDULER_HPP