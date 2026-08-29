// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Purani Dilli Mandi & Agent Economy Contract
 * @notice Deterministic resource market & autonomous agent settlement engine on Monad Testnet.
 */
contract Market {
    enum ResourceType { Katiya, SarkariFiles, CholeBhature }

    struct Resource {
        uint256 price;       // In wei or base units
        uint256 supply;      // Available stock
        uint256 basePrice;   // Base price floor
    }

    struct Company {
        string name;
        address owner;
        uint256 totalInvested;
        uint256 cash;
    }

    address public owner;
    bool public isChakkaJamActive;
    uint256 public chakkaJamEndTime;

    mapping(ResourceType => Resource) public resources;
    mapping(uint256 => Company) public companies;
    mapping(address => mapping(ResourceType => uint256)) public playerResources;
    mapping(address => uint256) public playerThekas;

    event ResourceTraded(address indexed trader, uint8 resourceType, bool isBuy, uint256 amount, uint256 newPrice);
    event ChakkaJamTriggered(address indexed initiator, uint256 timestamp);
    event CompanyInvested(address indexed investor, uint256 indexed companyId, uint256 amount);
    event ThekaBuilt(address indexed builder, uint256 totalThekas);

    constructor() {
        owner = msg.sender;

        // Initialize Purani Dilli Mandi base prices (in Wei, assuming 1 MON = 1e18)
        resources[ResourceType.Katiya] = Resource(12 * 1e15, 500, 10 * 1e15);       // Katiya Power Line
        resources[ResourceType.SarkariFiles] = Resource(25 * 1e15, 200, 20 * 1e15); // Sarkari Files
        resources[ResourceType.CholeBhature] = Resource(8 * 1e15, 800, 5 * 1e15);   // Chole Bhature

        // Initialize Companies
        companies[0] = Company("Katiya Power Corp", address(0x1), 0, 1200 * 1e15);
        companies[1] = Company("Dilli Steel Corp", address(0x2), 0, 1800 * 1e15);
        companies[2] = Company("Rajdhani Builders", address(0x3), 0, 2400 * 1e15);
    }

    function getMarketState() external view returns (
        uint256 energyPrice,
        uint256 steelPrice,
        uint256 foodPrice,
        uint256 energySupply,
        uint256 steelSupply,
        uint256 foodSupply,
        bool activeChakkaJam
    ) {
        return (
            resources[ResourceType.Katiya].price,
            resources[ResourceType.SarkariFiles].price,
            resources[ResourceType.CholeBhature].price,
            resources[ResourceType.Katiya].supply,
            resources[ResourceType.SarkariFiles].supply,
            resources[ResourceType.CholeBhature].supply,
            isChakkaJamActive
        );
    }

    function buyResource(uint8 resourceTypeRaw, uint256 amount) external payable {
        require(resourceTypeRaw <= 2, "Invalid resource");
        require(amount > 0, "Amount must be > 0");

        ResourceType resType = ResourceType(resourceTypeRaw);
        Resource storage res = resources[resType];

        require(res.supply >= amount, "Insufficient Mandi supply");
        uint256 totalCost = res.price * amount;
        require(msg.value >= totalCost, "Insufficient MON sent");

        res.supply -= amount;
        playerResources[msg.sender][resType] += amount;

        // Dynamic price update (5% price bump per buy batch)
        res.price = res.price + (res.price * amount / 100);

        emit ResourceTraded(msg.sender, resourceTypeRaw, true, amount, res.price);
    }

    function sellResource(uint8 resourceTypeRaw, uint256 amount) external {
        require(resourceTypeRaw <= 2, "Invalid resource");
        require(amount > 0, "Amount must be > 0");

        ResourceType resType = ResourceType(resourceTypeRaw);
        Resource storage res = resources[resType];

        require(playerResources[msg.sender][resType] >= amount, "Insufficient player balance");

        uint256 totalPayout = res.price * amount;
        require(address(this).balance >= totalPayout, "Contract lacks MON balance for payout");

        playerResources[msg.sender][resType] -= amount;
        res.supply += amount;

        // Dynamic price update (3% price drop per sell batch)
        if (res.price > res.basePrice) {
            uint256 drop = (res.price * amount / 100);
            res.price = res.price > drop ? res.price - drop : res.basePrice;
        }

        payable(msg.sender).transfer(totalPayout);

        emit ResourceTraded(msg.sender, resourceTypeRaw, false, amount, res.price);
    }

    function buildTheka() external payable {
        uint256 cost = 50 * 1e15; // 0.05 MON build fee
        require(msg.value >= cost, "Building Theka requires 0.05 MON");

        playerThekas[msg.sender] += 1;
        emit ThekaBuilt(msg.sender, playerThekas[msg.sender]);
    }

    function triggerChakkaJam() external {
        require(!isChakkaJamActive || block.timestamp > chakkaJamEndTime, "Chakka Jam already in progress");

        isChakkaJamActive = true;
        chakkaJamEndTime = block.timestamp + 3 minutes;

        // Cut Katiya supply by 80% and spike price by 60%
        Resource storage katiya = resources[ResourceType.Katiya];
        katiya.supply = katiya.supply / 5;
        katiya.price = katiya.price * 160 / 100;

        emit ChakkaJamTriggered(msg.sender, block.timestamp);
    }

    function investInCompany(uint256 companyId) external payable {
        require(companyId <= 2, "Invalid Company ID");
        require(msg.value > 0, "Investment must be > 0 MON");

        companies[companyId].totalInvested += msg.value;
        companies[companyId].cash += msg.value;

        emit CompanyInvested(msg.sender, companyId, msg.value);
    }

    receive() external payable {}
}
