Roles:
bytes32 public constant ADMIN_ROLE;
bytes32 public constant CURATOR_ROLE;
bytes32 public constant MODERATOR_ROLE;
bytes32 public constant VALIDATOR_ROLE;
bytes32 public constant TREASURY_ROLE;
Mapping.sol
User Identity Layer
Every wallet becomes a warrior profile
struct Warrior {
    uint64 createdAt;
    uint64 lastActivity;
    uint32 level;
    uint32 honor;
    uint32 reputation;
    uint32 achievements;
    bool active;
}
mapping(address => Warrior) public warriors;
function registerWarrior();
function updateActivity(address);
function levelUp(address);
import { useBushidoContext }
  from "../context/BushidoProvider";

export function useBushido() {
  return useBushidoContext();
}

