// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BushidoProtocol is Ownable {
    
    struct Warrior {
        uint64 createdAt;
        uint64 lastActivity;
        uint32 level;
        uint32 honor;
        uint32 reputation;
        uint32 achievements;
        bool active;
    }

    // Mapping from warrior wallet address to their profile
    mapping(address => Warrior) public warriors;
    
    // Events
    event WarriorInitiated(address indexed warrior, uint256 timestamp);
    event HonorUpdated(address indexed warrior, uint32 newHonor);

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Register a new warrior into the dojo
     */
    function enterDojo() external {
        require(!warriors[msg.sender].active, "Warrior already registered");
        
        warriors[msg.sender] = Warrior({
            createdAt: uint64(block.timestamp),
            lastActivity: uint64(block.timestamp),
            level: 1,
            honor: 72, // Starting honor tier baseline
            reputation: 50,
            achievements: 0,
            active: true
        });

        emit WarriorInitiated(msg.sender, block.timestamp);
    }

    /**
     * @notice Update honor score based on trade execution fidelity
     */
    function adjustHonor(address warriorAddress, uint32 honorDelta, bool positive) external onlyOwner {
        require(warriors[warriorAddress].active, "Warrior not found");
        
        if (positive) {
            warriors[warriorAddress].honor += honorDelta;
        } else {
            warriors[warriorAddress].honor = warriors[warriorAddress].honor > honorDelta 
                ? warriors[warriorAddress].honor - honorDelta 
                : 0;
        }
        
        warriors[warriorAddress].lastActivity = uint64(block.timestamp);
        emit HonorUpdated(warriorAddress, warriors[warriorAddress].honor);
    }
}