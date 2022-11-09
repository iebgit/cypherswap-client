 // SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity =0.7.6;
pragma abicoder v2;

import "./ClientStrategy.sol";

contract StrategyFactory {
    ClientStrategy[] public strategies;
    address[] public clients;

    constructor(){}

    function createClientStrategy(
        address _base,
        address _target,
        uint64[][6] memory _fib,
        uint8[5] memory _fibDiv,
        uint24 _poolFee, 
        uint256[] memory _timeStamps,
        uint64 _sma,
        bool _mode) 
        external returns (ClientStrategy newStrategy){
           ClientStrategy strategy = new ClientStrategy(_base, _target, _fib, _fibDiv, _poolFee, _timeStamps, _sma, _mode);
           address client = msg.sender;
           clients.push(client);
           strategies.push(strategy);
           return strategy;
        }

    function getClientStrategy(address client) external view returns (ClientStrategy strategy){
        for (uint256 x; x < strategies.length; x++){
            if(client == clients[x]){
                return strategies[x];
            }
        }
    }
}