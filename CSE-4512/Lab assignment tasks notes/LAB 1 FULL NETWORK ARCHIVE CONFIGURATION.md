## 1. CENTRAL L3 SWITCH CONFIGURATION (CORE ROUTING)

This switch performs the Layer 3 transformation and runs OSPF to connect all labs.

```
enable
configure terminal
hostname Central-Switch

! Layer 3 Transformation
ip routing

! Uplinks to L1R1 (192.25.11.0/24)
interface GigabitEthernet1/0/3
ip address 192.25.11.2 255.255.255.0
no switchport
no shutdown

! Uplinks to L1R2 (192.25.12.0/24)
interface GigabitEthernet1/0/4
ip address 192.25.12.2 255.255.255.0
no switchport
no shutdown

! OSPF Configuration
router ospf 1
router-id 10.10.10.1
network 192.25.11.0 0.0.0.255 area 0
network 192.25.12.0 0.0.0.255 area 0
! NOTE: You would add network commands for Labs 2, 3, 4, and 5 here as well.
! E.g.: network 192.25.21.0 0.0.0.255 area 0
end
```

## 2. L1R1 ROUTER CONFIGURATION (LAB 1 - ACTIVE)

L1R1 is configured as the primary (Active) HSRP router with higher priority (110).

```
enable
configure terminal
hostname L1R1

! WAN Uplink (GigabitEthernet0/1)
interface GigabitEthernet0/1
ip address 192.25.11.1 255.255.255.0
no shutdown

! LAN Interface (GigabitEthernet0/0) - HSRP Primary IP
interface GigabitEthernet0/0
ip address 192.25.1.1 255.255.255.0
no shutdown

! HSRP TRACKING OBJECT (Monitors the WAN uplink for failover)
track 11 interface GigabitEthernet0/1 line-protocol

! HSRP Configuration (on Gig0/0)
interface GigabitEthernet0/0
standby 1 ip 192.25.1.254     ! The Virtual Gateway IP
standby 1 priority 110        ! Higher priority = ACTIVE
standby 1 preempt             ! Allows it to take Active role
standby 1 track 11 decrement 15 ! Drops priority to 95 if uplink fails

! OSPF Configuration
router ospf 1
router-id 1.1.1.1
network 192.25.1.0 0.0.0.255 area 0
network 192.25.11.0 0.0.0.255 area 0
end
```

## 3. L1R2 ROUTER CONFIGURATION (LAB 1 - STANDBY)

L1R2 is configured as the backup (Standby) HSRP router with standard priority (100).

```
enable
configure terminal
hostname L1R2

! WAN Uplink (GigabitEthernet0/2)
interface GigabitEthernet0/2
ip address 192.25.12.1 255.255.255.0
no shutdown

! LAN Interface (GigabitEthernet0/0) - HSRP Secondary IP
interface GigabitEthernet0/0
ip address 192.25.1.2 255.255.255.0
no shutdown

! HSRP TRACKING OBJECT (Monitors the WAN uplink for failover)
track 12 interface GigabitEthernet0/2 line-protocol

! HSRP Configuration (on Gig0/0)
interface GigabitEthernet0/0
standby 1 ip 192.25.1.254     ! The Virtual Gateway IP
standby 1 priority 100        ! Standard priority = STANDBY
standby 1 preempt             ! Allows it to take Active role on failover
standby 1 track 12 decrement 15 ! Drops priority to 85 if uplink fails

! OSPF Configuration
router ospf 1
router-id 1.1.1.2
network 192.25.1.0 0.0.0.255 area 0
network 192.25.12.0 0.0.0.255 area 0
end
```