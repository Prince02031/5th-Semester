#include <iostream>
#include <vector>
#include <map>
#include <string>
#include <iomanip>

using namespace std;

// Resource Allocation structure
struct Allocation {
    int processId;
    int resourceId;
};

struct Request {
    int processId;
    int resourceId;
};

// Wait-For Graph using adjacency list (much cleaner than C arrays!)
class WaitForGraph {
private:
    int numProcesses;
    map<int, vector<int>> adjList;  // process -> list of processes it waits for
    
public:
    WaitForGraph(int n) : numProcesses(n) {}
    
    void addEdge(int from, int to) {
        adjList[from].push_back(to);
        cout << "Added edge: P" << from << " → P" << to 
             << " (P" << from << " waits for P" << to << ")" << endl;
    }
    
    void display() {
        cout << "\n=== Wait-For Graph ===" << endl;
        cout << "Adjacency List:" << endl;
        
        if (adjList.empty()) {
            cout << "No waiting relationships (No edges)" << endl;
            return;
        }
        
        for (int i = 0; i < numProcesses; i++) {
            cout << "P" << i << " → ";
            if (adjList.find(i) != adjList.end() && !adjList[i].empty()) {
                for (size_t j = 0; j < adjList[i].size(); j++) {
                    cout << "P" << adjList[i][j];
                    if (j < adjList[i].size() - 1) cout << ", ";
                }
            } else {
                cout << "none";
            }
            cout << endl;
        }
    }
    
    map<int, vector<int>>& getAdjList() { return adjList; }
    int getNumProcesses() { return numProcesses; }
};

// Resource Allocation Graph
class ResourceGraph {
private:
    int numProcesses;
    int numResources;
    vector<Allocation> allocations;
    vector<Request> requests;
    
public:
    ResourceGraph(int p, int r) : numProcesses(p), numResources(r) {}
    
    void addAllocation(int process, int resource) {
        allocations.push_back({process, resource});
    }
    
    void addRequest(int process, int resource) {
        requests.push_back({process, resource});
    }
    
    WaitForGraph* buildWaitForGraph() {
        WaitForGraph* wfg = new WaitForGraph(numProcesses);
        
        cout << "\n=== Converting Resource Allocation Graph to Wait-For Graph ===" << endl;
        
        // For each process requesting a resource
        for (const auto& req : requests) {
            int requestingProcess = req.processId;
            int requestedResource = req.resourceId;
            
            // Find which process holds this resource
            for (const auto& alloc : allocations) {
                if (alloc.resourceId == requestedResource && 
                    alloc.processId != requestingProcess) {
                    int holdingProcess = alloc.processId;
                    
                    cout << "P" << requestingProcess << " requests R" 
                         << requestedResource << " held by P" << holdingProcess 
                         << " → Edge P" << requestingProcess << " → P" 
                         << holdingProcess << endl;
                    
                    wfg->addEdge(requestingProcess, holdingProcess);
                }
            }
        }
        
        return wfg;
    }
    
    void displayScenario() {
        cout << "\nResource Allocations:" << endl;
        for (const auto& alloc : allocations) {
            cout << "  P" << alloc.processId << " holds R" << alloc.resourceId << endl;
        }
        
        cout << "\nResource Requests:" << endl;
        for (const auto& req : requests) {
            cout << "  P" << req.processId << " requests R" << req.resourceId << endl;
        }
    }
};

// Example scenarios
void example1_SimpleDeadlock() {
    cout << "\n╔════════════════════════════════════════════════════════╗" << endl;
    cout << "║  EXAMPLE 1: Simple Two-Process Deadlock               ║" << endl;
    cout << "╚════════════════════════════════════════════════════════╝" << endl;
    
    ResourceGraph rag(2, 2);
    
    cout << "\nScenario:" << endl;
    cout << "- P0 holds R0, requests R1" << endl;
    cout << "- P1 holds R1, requests R0" << endl;
    
    rag.addAllocation(0, 0);  // P0 holds R0
    rag.addAllocation(1, 1);  // P1 holds R1
    rag.addRequest(0, 1);     // P0 requests R1
    rag.addRequest(1, 0);     // P1 requests R0
    
    rag.displayScenario();
    
    WaitForGraph* wfg = rag.buildWaitForGraph();
    wfg->display();
    
    delete wfg;
}

void example2_CircularWait() {
    cout << "\n╔════════════════════════════════════════════════════════╗" << endl;
    cout << "║  EXAMPLE 2: Three-Process Circular Wait               ║" << endl;
    cout << "╚════════════════════════════════════════════════════════╝" << endl;
    
    ResourceGraph rag(3, 3);
    
    cout << "\nScenario:" << endl;
    cout << "- P0 holds R0, requests R1" << endl;
    cout << "- P1 holds R1, requests R2" << endl;
    cout << "- P2 holds R2, requests R0" << endl;
    
    rag.addAllocation(0, 0);
    rag.addAllocation(1, 1);
    rag.addAllocation(2, 2);
    rag.addRequest(0, 1);
    rag.addRequest(1, 2);
    rag.addRequest(2, 0);
    
    rag.displayScenario();
    
    WaitForGraph* wfg = rag.buildWaitForGraph();
    wfg->display();
    
    delete wfg;
}

void example3_NoDeadlock() {
    cout << "\n╔════════════════════════════════════════════════════════╗" << endl;
    cout << "║  EXAMPLE 3: No Deadlock - Linear Chain                ║" << endl;
    cout << "╚════════════════════════════════════════════════════════╝" << endl;
    
    ResourceGraph rag(3, 3);
    
    cout << "\nScenario:" << endl;
    cout << "- P0 holds R0, requests R1" << endl;
    cout << "- P1 holds R1, requests R2" << endl;
    cout << "- P2 holds R2 (no request)" << endl;
    
    rag.addAllocation(0, 0);
    rag.addAllocation(1, 1);
    rag.addAllocation(2, 2);
    rag.addRequest(0, 1);
    rag.addRequest(1, 2);
    
    rag.displayScenario();
    
    WaitForGraph* wfg = rag.buildWaitForGraph();
    wfg->display();
    
    delete wfg;
}

void example4_ComplexScenario() {
    cout << "\n╔════════════════════════════════════════════════════════╗" << endl;
    cout << "║  EXAMPLE 4: Complex Multi-Resource Scenario           ║" << endl;
    cout << "╚════════════════════════════════════════════════════════╝" << endl;
    
    ResourceGraph rag(4, 4);
    
    cout << "\nScenario:" << endl;
    cout << "- P0 holds R0, requests R1" << endl;
    cout << "- P1 holds R1, R2, requests R3" << endl;
    cout << "- P2 holds R3, requests R0" << endl;
    cout << "- P3 waits for no one" << endl;
    
    rag.addAllocation(0, 0);
    rag.addAllocation(1, 1);
    rag.addAllocation(1, 2);  // P1 holds multiple resources
    rag.addAllocation(2, 3);
    
    rag.addRequest(0, 1);
    rag.addRequest(1, 3);
    rag.addRequest(2, 0);
    
    rag.displayScenario();
    
    WaitForGraph* wfg = rag.buildWaitForGraph();
    wfg->display();
    
    delete wfg;
}

int main() {
    cout << "╔═══════════════════════════════════════════════════════════╗" << endl;
    cout << "║    Wait-For Graph Construction (C++ STL Version)         ║" << endl;
    cout << "╚═══════════════════════════════════════════════════════════╝" << endl;
    
    example1_SimpleDeadlock();
    cout << "\nPress Enter to continue..."; 
    cin.get();
    
    example2_CircularWait();
    cout << "\nPress Enter to continue..."; 
    cin.get();
    
    example3_NoDeadlock();
    cout << "\nPress Enter to continue..."; 
    cin.get();
    
    example4_ComplexScenario();
    
    cout << "\n\n=== Summary ===" << endl;
    cout << "Wait-For Graph advantages:" << endl;
    cout << "1. Simplifies Resource Allocation Graph" << endl;
    cout << "2. Only shows process-to-process dependencies" << endl;
    cout << "3. Easier to detect cycles (deadlocks)" << endl;
    cout << "4. C++ STL makes implementation much cleaner!" << endl;
    
    return 0;
}
