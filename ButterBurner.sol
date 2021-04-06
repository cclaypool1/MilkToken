pragma solidity ^0.6.12;
// SPDX-License-Identifier: Unlicensed
import "./Butter.sol";


contract ButterBurner is Context, Ownable {
    using SafeMath for uint256;
    using Address for address;
    
    address payable butterAddress = 0x0110fF9e7E4028a5337F07841437B92d5bf53762;
    address payable milkAddress = 0xb7CEF49d89321e22dd3F51a212d58398Ad542640;
    
    Butter butter = Butter(butterAddress);
    Milk milk = Milk(milkAddress);
    
    IUniswapV2Router02 public immutable uniswapV2Router;
    
    receive() external payable {}
    
    constructor () public {
        
        IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F);
         // Create a uniswap pair for this new token

        // set the rest of the contract variables
        uniswapV2Router = _uniswapV2Router;
    }
    
    
    function stakeHalf() public onlyOwner
    {
        milk.approve(butterAddress, butter._maxLeftToStake());
        butter._stakeMilk(butter._maxLeftToStake());
    }
    
    function liquifyRemaining() public onlyOwner
    {
        uint256 half = milk.balanceOf(address(this)).div(2);
        uint256 otherHalf = milk.balanceOf(address(this)).sub(half);
        
        uint256 initialBalance = address(this).balance;

        // swap tokens for ETH
        swapTokensForEth(half); // <- this breaks the ETH -> MILK swap when swap+liquify is triggered

        // how much ETH did we just swap into?
        uint256 newBalance = address(this).balance.sub(initialBalance);
        
        addLiquidity(otherHalf, newBalance);
    }
    

    function swapTokensForEth(uint256 tokenAmount) private {
        // generate the uniswap pair path of token -> weth
        address[] memory path = new address[](2);
        path[0] = milkAddress;
        path[1] = uniswapV2Router.WETH();

        milk.approve(address(uniswapV2Router), tokenAmount);

        // make the swap
        uniswapV2Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            tokenAmount,
            0, // accept any amount of ETH
            path,
            address(this),
            block.timestamp
        );
    }

    function addLiquidity(uint256 tokenAmount, uint256 ethAmount) private {
        // approve token transfer to cover all possible scenarios
        milk.approve(address(uniswapV2Router), tokenAmount);

        // add the liquidity
        uniswapV2Router.addLiquidityETH{value: ethAmount}(
            milkAddress,
            tokenAmount,
            0, // slippage is unavoidable
            0, // slippage is unavoidable
            lockedLiquidity(),
            block.timestamp
        );
    }
    
    function  burnedButter() public view returns (uint256)
    {
        return butter._currentRewards(address(this));   
    }
    
    function butterDeflationRate() public view returns (uint256)
    {
        uint256 percentPool = butter._percentageOfStakePool(address(this));
        uint256 percentButterTransactions = percentPool.mul(2); //with shift decimal 4 places
        
        return percentButterTransactions;
    }
    
    
}
