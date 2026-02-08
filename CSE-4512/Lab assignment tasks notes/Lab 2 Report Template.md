# DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING

# ISLAMIC UNIVERSITY OF TECHNOLOGY

### A SUBSIDIARY ORGAN OF OIC

## LAB REPORT 2

**CSE 4512: COMPUTER NETWORKING LAB**

**Name:**

$$Your Name Here$$

**Student ID:**

$$Your ID Here$$

(Calculations based on ID 25) **Section:**

$$Your Section$$

**Semester:**

$$Your Semester$$

**Date of Submission:**

$$Date$$

### 1. Lab Task

The primary objective of this laboratory assignment was to design and implement a subnetted network to divide certain network ranges among specific groups (Sales, Marketing, Engineering, Administration, and Management).

**Problem Description**

- **Topology:** Five individual groups, each containing a variable number of computers.
    
- **Addressing Scheme:** Each lab network must follow the pattern `192.i.(i+3 % 14).0`, where _i_ is the last two digits of the student ID.
    
- **Goal:** To demonstrate full global connectivity using efficient VLSM (Variable Length Subnet Masking).
    

#### Calculations for Student ID: 25

**Network Prefix Generation:**

- $i = 25$
    
- Third octet calculation: $(25 + 3) \pmod{14} = 28 \pmod{14} = 0$
    
- **Base Network:** `192.25.0.0`
    

**Host Requirements Calculation:**

1. **Engineering:** $E(25) = (7 \times 25 + 3) \pmod{41} + 10$ $= (175 + 3) \pmod{41} + 10 = 178 \pmod{41} + 10 = 14 + 10 = \mathbf{24 \text{ Hosts}}$
    
2. **Marketing:** $M(25) = (5 \times 25 + 11) \pmod{26} + 5$ $= (125 + 11) \pmod{26} + 5 = 136 \pmod{26} + 5 = 6 + 5 = \mathbf{11 \text{ Hosts}}$
    
3. **Sales:** $S(25) = (11 \times 25 + 7) \pmod{36} + 5$ $= (275 + 7) \pmod{36} + 5 = 282 \pmod{36} + 5 = 30 + 5 = \mathbf{35 \text{ Hosts}}$
    
4. **Administration:** $A(25) = (3 \times 25 + 17) \pmod{18} + 3$ $= (75 + 17) \pmod{18} + 3 = 92 \pmod{18} + 3 = 2 + 3 = \mathbf{5 \text{ Hosts}}$
    
5. **Management:** $G(25) = (13 \times 25 + 1) \pmod{9} + 2$ $= (325 + 1) \pmod{9} + 2 = 326 \pmod{9} + 2 = 2 + 2 = \mathbf{4 \text{ Hosts}}$
    

### 2. Subnetting Worksheet

The subnets were assigned using VLSM, ordering departments from largest host requirement to smallest to prevent IP overlap.

|   |   |   |   |   |   |
|---|---|---|---|---|---|
|**Department**|**Devices Needed**|**Network Address**|**CIDR / Mask**|**Usable Host Range**|**Broadcast Address**|
|**Sales**|35|`192.25.0.0`|`/26` (255.255.255.192)|`192.25.0.1 - 192.25.0.62`|`192.25.0.63`|
|**Engineering**|24|`192.25.0.64`|`/27` (255.255.255.224)|`192.25.0.65 - 192.25.0.94`|`192.25.0.95`|
|**Marketing**|11|`192.25.0.96`|`/28` (255.255.255.240)|`192.25.0.97 - 192.25.0.110`|`192.25.0.111`|
|**Administration**|5|`192.25.0.112`|`/29` (255.255.255.248)|`192.25.0.113 - 192.25.0.118`|`192.25.0.119`|
|**Management**|4|`192.25.0.120`|`/29` (255.255.255.248)|`192.25.0.121 - 192.25.0.126`|`192.25.0.127`|
|**Router Link 1**|2|`192.25.0.128`|`/30` (255.255.255.252)|`192.25.0.129 - 192.25.0.130`|`192.25.0.131`|
|**Router Link 2**|2|`192.25.0.132`|`/30` (255.255.255.252)|`192.25.0.133 - 192.25.0.134`|`192.25.0.135`|

### 3. Procedure: Step-by-Step Implementation

The network was configured in a three-step process: Topology Setup, Router Configuration, and PC Configuration.

#### 3.1 Building the Physical Topology

1. **Departments:** Five distinct LANs were created.
    
    - Sales & Marketing were connected to Router 0.
        
    - Engineering was connected to Router 1 (Central).
        
    - Administration & Management were connected to Router 2.
        
2. **Interconnection:**
    
    - Router 0 was connected to Router 1 via a serial/gigabit link.
        
    - Router 1 was connected to Router 2 via a serial/gigabit link.
        

#### 3.2 Configuring the Routers (CLI)

RIPv2 was used for dynamic routing. The `no auto-summary` command was crucial to ensure the subnets (VLSM) were advertised correctly instead of the classful /24 mask.

**Router 0 Configuration (Sales & Marketing):**

```
Router> enable
Router# configure terminal
! Configure Sales Gateway
Router(config)# interface gig0/1
Router(config-if)# ip address 192.25.0.1 255.255.255.192
Router(config-if)# no shutdown
! Configure Marketing Gateway
Router(config)# interface gig0/2
Router(config-if)# ip address 192.25.0.97 255.255.255.240
Router(config-if)# no shutdown
! Configure Link to Router 1
Router(config)# interface gig0/0
Router(config-if)# ip address 192.25.0.129 255.255.255.252
Router(config-if)# no shutdown
! Configure Routing
Router(config)# router rip
Router(config-router)# version 2
Router(config-router)# no auto-summary
Router(config-router)# network 192.25.0.0
```

**Router 1 Configuration (Engineering & Backbone):**

```
! Configure Engineering Gateway
Router(config)# interface gig0/0
Router(config-if)# ip address 192.25.0.65 255.255.255.224
Router(config-if)# no shutdown
! Configure Link to Router 0
Router(config)# interface gig0/1
Router(config-if)# ip address 192.25.0.130 255.255.255.252
Router(config-if)# no shutdown
! Configure Link to Router 2
Router(config)# interface gig0/2
Router(config-if)# ip address 192.25.0.133 255.255.255.252
Router(config-if)# no shutdown
! Configure Routing
Router(config)# router rip
Router(config-router)# version 2
Router(config-router)# no auto-summary
Router(config-router)# network 192.25.0.0
```

**Router 2 Configuration (Admin & Management):**

```
! Configure Admin Gateway
Router(config)# interface gig0/1
Router(config-if)# ip address 192.25.0.113 255.255.255.248
Router(config-if)# no shutdown
! Configure Management Gateway
Router(config)# interface gig0/2
Router(config-if)# ip address 192.25.0.121 255.255.255.248
Router(config-if)# no shutdown
! Configure Link to Router 1
Router(config)# interface gig0/0
Router(config-if)# ip address 192.25.0.134 255.255.255.252
Router(config-if)# no shutdown
! Configure Routing
Router(config)# router rip
Router(config-router)# version 2
Router(config-router)# no auto-summary
Router(config-router)# network 192.25.0.0
```

#### 3.3 Configuring the PCs

PCs were assigned the **last usable IP** in their respective subnets to avoid conflict with the gateway (first usable).

- **PC Sales:** IP 192.25.0.62, Gateway 192.25.0.1
    
- **PC Engineering:** IP 192.25.0.94, Gateway 192.25.0.65
    
- **PC Marketing:** IP 192.25.0.110, Gateway 192.25.0.97
    
- **PC Admin:** IP 192.25.0.118, Gateway 192.25.0.113
    
- **PC Management:** IP 192.25.0.126, Gateway 192.25.0.121
    

### 4. Observations & Results

**Topology Screenshot** _(Insert your screenshot of the Packet Tracer topology here)_

**Connectivity Tests** Successful pings were observed between devices in different departments, confirming that the RIPv2 routing table successfully populated.

_(Insert screenshot of `ping 192.25.0.62` from PC-Management here)_

### 5. Challenges Faced

1. **VLSM Calculation:** Arranging the subnets to ensure no overlap occurred. Specifically, ensuring the Marketing subnet did not overlap with Sales was a critical step.
    
2. **Router Interface Limits:** Managing multiple departments on limited router interfaces required careful planning of which router hosted which department.
    
3. **RIPv2 Convergence:** Initially, pings failed (Request Timed Out) while the routers were exchanging tables. After 30 seconds, connectivity was established.