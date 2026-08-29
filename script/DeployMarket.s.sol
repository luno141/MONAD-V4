// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../contracts/Market.sol";

// Simple deployment helper script for Monad Testnet
contract DeployMarket {
    function run() external returns (Market) {
        Market market = new Market();
        return market;
    }
}
