//Connect to user's wallet
	if (window.ethereum) {
	
	web3 = new Web3(window.ethereum);
	
	try { 
      window.ethereum.enable().then(function() {

      });
	} catch(e) {
      // User has denied account access to DApp...
	}
	}
	// Legacy DApp Browsers
	else if (window.web3) {
		web3 = new Web3(web3.currentProvider);
	}
	// Non-DApp Browsers
	else {
		alert('You have to install MetaMask !');
	}
	
	//Init stuff
	const BN = web3.utils.BN;
	
	
	//contract objects
	var milkContractAddress = "0xb7CEF49d89321e22dd3F51a212d58398Ad542640";
	var milkContractABI = "[{\"inputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"Approval\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"ethCollected\",\"type\":\"uint256\"}],\"name\":\"CharityCollected\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"minTokensBeforeSwap\",\"type\":\"uint256\"}],\"name\":\"MinTokensBeforeSwapUpdated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"previousOwner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"OwnershipTransferred\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"tokensSwapped\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"ethReceived\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"tokensIntoLiqudity\",\"type\":\"uint256\"}],\"name\":\"SwapAndLiquify\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"bool\",\"name\":\"enabled\",\"type\":\"bool\"}],\"name\":\"SwapAndLiquifyEnabledUpdated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"Transfer\",\"type\":\"event\"},{\"inputs\":[],\"name\":\"_liquidityFee\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"_maxTxAmount\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"_taxFee\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"}],\"name\":\"allowance\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"approve\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"balanceOf\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"burn\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"charity\",\"outputs\":[{\"internalType\":\"address payable\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"charityPercentageOfLiquidity\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"collectCharity\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"decimals\",\"outputs\":[{\"internalType\":\"uint8\",\"name\":\"\",\"type\":\"uint8\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"subtractedValue\",\"type\":\"uint256\"}],\"name\":\"decreaseAllowance\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tAmount\",\"type\":\"uint256\"}],\"name\":\"deliver\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"devWallet\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"excludeFromFee\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"excludeFromReward\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"includeInFee\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"includeInReward\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"addedValue\",\"type\":\"uint256\"}],\"name\":\"increaseAllowance\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"isExcludedFromFee\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"isExcludedFromReward\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"lockedLiquidity\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"name\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tAmount\",\"type\":\"uint256\"},{\"internalType\":\"bool\",\"name\":\"deductTransferFee\",\"type\":\"bool\"}],\"name\":\"reflectionFromToken\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"renounceOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"setAsDevWallet\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address payable\",\"name\":\"charityAddress\",\"type\":\"address\"}],\"name\":\"setCharityAddress\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"liquidityAddress\",\"type\":\"address\"}],\"name\":\"setLockedLiquidityAddress\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bool\",\"name\":\"_enabled\",\"type\":\"bool\"}],\"name\":\"setSwapAndLiquifyEnabled\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"swapAndLiquifyEnabled\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"symbol\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"rAmount\",\"type\":\"uint256\"}],\"name\":\"tokenFromReflection\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"totalCharityCollected\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"totalFees\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"totalSupply\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"recipient\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"transfer\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"recipient\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"transferFrom\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"uniswapV2Pair\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"uniswapV2Router\",\"outputs\":[{\"internalType\":\"contract IUniswapV2Router02\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"stateMutability\":\"payable\",\"type\":\"receive\"}]";
	var milkTokenContract = new web3.eth.Contract(JSON.parse(milkContractABI), milkContractAddress);
	
	var butterContractAddress = "0x0110fF9e7E4028a5337F07841437B92d5bf53762";
	var butterContractABI = "[{\"inputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"Approval\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"ethCollected\",\"type\":\"uint256\"}],\"name\":\"CharityCollected\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"ethCollected\",\"type\":\"uint256\"}],\"name\":\"ExpensesCollected\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"minTokensBeforeSwap\",\"type\":\"uint256\"}],\"name\":\"MinTokensBeforeSwapUpdated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"previousOwner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"OwnershipTransferred\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"tokensSwapped\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"ethReceived\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"tokensIntoLiqudity\",\"type\":\"uint256\"}],\"name\":\"SwapAndLiquify\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"bool\",\"name\":\"enabled\",\"type\":\"bool\"}],\"name\":\"SwapAndLiquifyEnabledUpdated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"Transfer\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addy\",\"type\":\"address\"}],\"name\":\"_addressStakedMilk\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addy\",\"type\":\"address\"}],\"name\":\"_calculateReward\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"_claimAllButter\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addy\",\"type\":\"address\"}],\"name\":\"_currentRewards\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"_emergencyWithdraw\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"_liquidityFee\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"_maxLeftToStake\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"_maxStakeAmount\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"_maxTxAmount\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addy\",\"type\":\"address\"}],\"name\":\"_milkNeededToAvoidSlash\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addy\",\"type\":\"address\"}],\"name\":\"_percentageOfStakePool\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"_percentageOfStakePool\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"_percentageOfStakePoolNewStake\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addy\",\"type\":\"address\"}],\"name\":\"_slashWillOccur\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"stakeAmount\",\"type\":\"uint256\"}],\"name\":\"_stakeMilk\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"_taxFee\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"_totalStakedMilk\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"_unstakeAll\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"unstakeAmount\",\"type\":\"uint256\"}],\"name\":\"_unstakeMilk\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"actualAccruedButter\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"}],\"name\":\"allowance\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"approve\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"balanceOf\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"burn\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"charity\",\"outputs\":[{\"internalType\":\"address payable\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"charityCollectAll\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"charityPercentageOfLiquidity\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"collectCharity\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"collectExpenses\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"decimals\",\"outputs\":[{\"internalType\":\"uint8\",\"name\":\"\",\"type\":\"uint8\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"subtractedValue\",\"type\":\"uint256\"}],\"name\":\"decreaseAllowance\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tAmount\",\"type\":\"uint256\"}],\"name\":\"deliver\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"devWallet\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addy\",\"type\":\"address\"}],\"name\":\"earnedButter\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"ethReservedForCharity\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"ethReservedForExpenses\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"excludeFromFee\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"excludeFromReward\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"expense\",\"outputs\":[{\"internalType\":\"address payable\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"includeInFee\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"includeInReward\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"addedValue\",\"type\":\"uint256\"}],\"name\":\"increaseAllowance\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"isExcludedFromFee\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"isExcludedFromReward\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"lockedLiquidity\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"name\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tAmount\",\"type\":\"uint256\"},{\"internalType\":\"bool\",\"name\":\"deductTransferFee\",\"type\":\"bool\"}],\"name\":\"reflectionFromToken\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"renounceOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"setAsDevWallet\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address payable\",\"name\":\"charityAddress\",\"type\":\"address\"}],\"name\":\"setCharityAddress\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address payable\",\"name\":\"_address\",\"type\":\"address\"}],\"name\":\"setExpenseWallet\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"liquidityAddress\",\"type\":\"address\"}],\"name\":\"setLockedLiquidityAddress\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bool\",\"name\":\"_enabled\",\"type\":\"bool\"}],\"name\":\"setSwapAndLiquifyEnabled\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"swapAndLiquifyEnabled\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"symbol\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"rAmount\",\"type\":\"uint256\"}],\"name\":\"tokenFromReflection\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"totalCharityCollected\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"totalFees\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"totalSupply\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"recipient\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"transfer\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"recipient\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"transferFrom\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"uniswapV2Pair\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"uniswapV2Router\",\"outputs\":[{\"internalType\":\"contract IUniswapV2Router02\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"stateMutability\":\"payable\",\"type\":\"receive\"}]";
	var butterContract = new web3.eth.Contract(JSON.parse(butterContractABI), butterContractAddress);
	
	//vars gotten from contract interaction
	var milkTokenBalance;
	var milkTokenDecimals;
	var stakedMilk;
	var milkLeftToStake;
	var milkLeftToStakeString;
	
	var butterTokenBalance;
	var butterTokenDecimals;
	var earnedButter;
	var slashedReward;
	var milkApproval;
	var percentOfPool;
	var slashedRewardString;
	var stakedMilkString;
	
	//View functions
	async function getMilkBalance() {
		milkTokenBalance = await milkTokenContract.methods.balanceOf(account).call();
		milkTokenDecimals = await milkTokenContract.methods.decimals().call();
		
		//BN stuff
		var balanceWeiString = milkTokenBalance.toString();
		var balanceWeiBN = new BN(balanceWeiString);
		var decimalsBN = new BN(milkTokenDecimals);
		var divisor = new BN(10).pow(decimalsBN);
		
		var beforeDecimal = balanceWeiBN.div(divisor);
		var afterDecimal = balanceWeiBN.mod(divisor);
		
		afterDecimal = afterDecimal.toString();
		var s = "00000000" + afterDecimal;
		afterDecimal = s.substr(s.length-9);
		
		//Do stuff with the balance BN (show balance etc.)
		document.getElementById("milk_balance").innerText = beforeDecimal + "." + afterDecimal;
	}
	
	async function getMilkApproval() {
		milkApproval = await milkTokenContract.methods.allowance(account, butterContractAddress).call();
	}
	
	async function getButterBalance() {
		butterTokenBalance = await butterContract.methods.balanceOf(account).call();
		butterTokenDecimals = await butterContract.methods.decimals().call();
		
		//BN stuff
		var balanceWeiString = butterTokenBalance.toString();
		var balanceWeiBN = new BN(balanceWeiString);
		var decimalsBN = new BN(butterTokenDecimals);
		var divisor = new BN(10).pow(decimalsBN);
		
		var beforeDecimal = balanceWeiBN.div(divisor).toString();
		var afterDecimal = balanceWeiBN.mod(divisor);
		
		afterDecimal = afterDecimal.toString();
		var s = "00000000" + afterDecimal;
		afterDecimal = s.substr(s.length-9);
		
		//Do stuff with the balance BN (show balance etc.)
		document.getElementById("butter_balance").innerText = beforeDecimal + "." + afterDecimal;
	}
	
	async function getMaxLeftToStake() {
		milkLeftToStake = await butterContract.methods._maxLeftToStake().call({from: account});
		milkTokenDecimals = await milkTokenContract.methods.decimals().call();
		
		//BN stuff
		var balanceWeiString = milkLeftToStake.toString();
		var balanceWeiBN = new BN(balanceWeiString);
		var decimalsBN = new BN(milkTokenDecimals);
		var divisor = new BN(10).pow(decimalsBN);
		
		var beforeDecimal = balanceWeiBN.div(divisor).toString();
		var afterDecimal = balanceWeiBN.mod(divisor);
		
		afterDecimal = afterDecimal.toString();
		var s = "00000000" + afterDecimal;
		afterDecimal = s.substr(s.length-9);
		
		//Do stuff with the balance BN (show balance etc.)
		milkLeftToStakeString = beforeDecimal + "." + afterDecimal;
		document.getElementById("max_left_to_stake").innerText = milkLeftToStakeString;
	}
	
	async function getStakedMilk() {
		stakedMilk = await butterContract.methods._addressStakedMilk(account).call({from: account});
		milkTokenDecimals = await milkTokenContract.methods.decimals().call();
		
		//BN stuff
		var balanceWeiString = stakedMilk.toString();
		var balanceWeiBN = new BN(balanceWeiString);
		var decimalsBN = new BN(milkTokenDecimals);
		var divisor = new BN(10).pow(decimalsBN);
		
		var beforeDecimal = balanceWeiBN.div(divisor).toString();
		var afterDecimal = balanceWeiBN.mod(divisor);
		
		afterDecimal = afterDecimal.toString();
		var s = "00000000" + afterDecimal;
		afterDecimal = s.substr(s.length-9);
		
		//Do stuff with the balance BN (show balance etc.)
		stakedMilkString = beforeDecimal + "." + afterDecimal;
		document.getElementById("stake").innerText = beforeDecimal + "." + afterDecimal;
	}
	
	async function getPercentOfPool() {
		percentOfPool = await butterContract.methods['_percentageOfStakePool(address)'](account).call({from: account});
		
		//BN stuff
		var balanceWeiString = percentOfPool.toString();
		var balanceWeiBN = new BN(balanceWeiString);
		var divisor = new BN(100);
		
		var beforeDecimal = balanceWeiBN.div(divisor).toString();
		var afterDecimal = balanceWeiBN.mod(divisor);
		
		afterDecimal = afterDecimal.toString();
		var s = "0" + afterDecimal;
		afterDecimal = s.substr(s.length-2);
		
		
		var percentOfPoolString = beforeDecimal + "." + afterDecimal;
		if(percentOfPoolString == "0.00")
		{
			percentOfPoolString = "<0.01";
		}
		//Do stuff with the balance BN (show balance etc.)
		document.getElementById("percent").innerText = percentOfPoolString;
	}
	
	async function getEarnedButter() {
		earnedButter = await butterContract.methods._currentRewards(account).call({from: account});
		butterTokenDecimals = await butterContract.methods.decimals().call();
		
		//BN stuff
		var balanceWeiString = earnedButter.toString();
		var balanceWeiBN = new BN(balanceWeiString);
		var decimalsBN = new BN(butterTokenDecimals);
		var divisor = new BN(10).pow(decimalsBN);
		
		var beforeDecimal = balanceWeiBN.div(divisor).toString();
		var afterDecimal = balanceWeiBN.mod(divisor);
		
		afterDecimal = afterDecimal.toString();
		var s = "00000000" + afterDecimal;
		afterDecimal = s.substr(s.length-9);
		
		//Do stuff with the balance BN (show balance etc.)
		document.getElementById("earnings").innerText = beforeDecimal + "." + afterDecimal;
	}
	
	async function getSlashedReward() {
		slashedReward = await butterContract.methods._calculateReward(account).call({from: account});
		butterTokenDecimals = await butterContract.methods.decimals().call();
		
		//BN stuff
		var balanceWeiString = slashedReward.toString();
		var balanceWeiBN = new BN(balanceWeiString);
		var decimalsBN = new BN(butterTokenDecimals);
		var divisor = new BN(10).pow(decimalsBN);
		
		var beforeDecimal = balanceWeiBN.div(divisor).toString();
		var afterDecimal = balanceWeiBN.mod(divisor);
		
		afterDecimal = afterDecimal.toString();
		var s = "00000000" + afterDecimal;
		afterDecimal = s.substr(s.length-9);
		
		//Do stuff with the balance BN (show balance etc.)
		slashedRewardString = beforeDecimal + "." + afterDecimal;
		//document.getElementById("max_left_to_stake").innerText = beforeDecimal + "." + afterDecimal;
	}
	
	
	//Transaction functions
	function approveMilk() {
		if(window.confirm("This is a one-time approval transaction, this requires a Gas fee in order to allow you to stake your Milk. Note: No Milk is being staked for this transaction, Staking will be a seperate transaction.") && !window.ethereum.isTrust)
			{
				milkTokenContract.methods.approve(butterContractAddress, "1000000000000000000000000000000000000000000000000000").send({from: account});
			}
		if(window.ethereum.isTrust)
		{
			milkTokenContract.methods.approve(butterContractAddress, "1000000000000000000000000000000000000000000000000000").send({from: account});
		}
	}
	
	function stakeMilk() {
		//Get stake amount from the inputbox
		var stakeValue = document.getElementById("stakeAmount").value.toString();
		//console.log(stakeValue);
		//need to move decimal over 9 places
		var splitString = stakeValue.split('.');
		var integerPart = splitString[0];
		var decimalPart = splitString[1];
		
		if(decimalPart == undefined){
			decimalPart = (0).toString();
		}
		
		if(decimalPart.length > 9)
		{
			//someone put in too many decimals
			decimalPart = decimalPart.slice(0,9);
		}
		
		while(decimalPart.length < 9)
		{
			decimalPart = decimalPart + '0';
		}
		//console.log(decimalPart);
		//append 0s to decimal part so that it is 9 characters long
		
		var stakeValue = integerPart + decimalPart;
		//console.log(stakeValue);
		
		butterContract.methods._stakeMilk(stakeValue).send({from: account});
	}
	
	function unstakeAll() {
		if(slashWillOccur)
		{
			if(window.confirm("WARNING, IF YOU UNSTAKE, YOUR REWARDS WILL BE SLAHSED UNLESS YOU HAVE AT LEAST " + stakedMilkString + " MILK IN YOUR WALLET!") && !window.ethereum.isTrust)
			{
				butterContract.methods._unstakeAll().send({from: account});
			}
			if(window.ethereum.isTrust)
			{
				//can't warn the user bc Trust wallet is poop
				butterContract.methods._unstakeAll().send({from: account});
			}
		}
		else
		{
			butterContract.methods._unstakeAll().send({from: account});
		}
	}
	
	function claimButter() {
		//First needs to check and make sure rewards wont be slashed and warn the user if so
		butterContract.methods._claimAllButter().send({from: account});
	}
	
	var tooBigValue = false;
	function valueGreaterThanMax() {
		var stakeValue = document.getElementById("stakeAmount").value.toString();
		//console.log(stakeValue);
		//need to move decimal over 9 places
		var splitString = stakeValue.split('.');
		var integerPart = splitString[0];
		var decimalPart = splitString[1];
		
		if(decimalPart == undefined){
			decimalPart = (0).toString();
		}
		
		if(decimalPart.length > 9)
		{
			//someone put in too many decimals
			decimalPart = decimalPart.slice(0,9);
		}
		
		
		
		while(decimalPart.length < 9)
		{
			decimalPart = decimalPart + '0';
		}
		//console.log(decimalPart);
		//append 0s to decimal part so that it is 9 characters long
		var stakeValue = integerPart.toString() + decimalPart.toString();
		
		if(BigInt(stakeValue.toString()) > BigInt(milkLeftToStake.toString())) tooBigValue = true;
		else tooBigValue = false;
	}
	
	var notEnoughApproval = false;
	function checkApproval() {
		var stakeValue = document.getElementById("stakeAmount").value.toString();
		//console.log(stakeValue);
		//need to move decimal over 9 places
		var splitString = stakeValue.split('.');
		var integerPart = splitString[0];
		var decimalPart = splitString[1];
		
		if(decimalPart == undefined){
			decimalPart = (0).toString();
		}
		
		if(decimalPart.length > 9)
		{
			//someone put in too many decimals
			decimalPart = decimalPart.slice(0,9);
		}
		
		
		
		while(decimalPart.length < 9)
		{
			decimalPart = decimalPart + '0';
		}
		//console.log(decimalPart);
		//append 0s to decimal part so that it is 9 characters long
		var stakeValue = integerPart.toString() + decimalPart.toString();
		
		if(BigInt(stakeValue.toString()) > BigInt(milkApproval.toString())) notEnoughApproval = true;
		else notEnoughApproval = false;
		//console.log(notEnoughApproval);
	}
	
	var slashWillOccur = false;
	async function checkSlash()
	{
		slashWillOccur = await butterContract.methods._slashWillOccur().call({from: account});
	}
	
	var incorrectChain = false;
	function checkChain()
	{
		//if(milkTokenBalance == undefined)
		//{
		//	incorrectChain = false;
		//}
		if(!window.ethereum && !window.ethereum.isTrust)
		{
			incorrectChain = true;
		}
		else incorrectChain = false;
		//else incorrectChain = false;
	}
	
	//MetaMask
	//Interval to get balances
	if(window.ethereum && !window.ethereum.isTrust) {
		var account = window.ethereum.selectedAddress;
        var accountInterval = setInterval(function() {
            //if (window.ethereum.selectedAddress !== account) {
                account = window.ethereum.selectedAddress; 
           // }
        }, 100);
		var balanceInterval = setInterval(function () {
			getMilkBalance();
			//checkChain();
			//if(!incorrectChain)
			//{
			getButterBalance();
			getMaxLeftToStake();
			getStakedMilk();
			getEarnedButter();
			valueGreaterThanMax();
			getMilkApproval().then(checkApproval());
			//checkApproval();
			getPercentOfPool();
			checkSlash();
			//}
			updateSite();
		}, 100);
	}
	//Trust wallet
	else if(window.ethereum && window.ethereum.isTrust) {
        var accountInterval = setInterval(function() {
				account = window.ethereum.address;
        }, 100);
		var balanceInterval = setInterval(function () {
			getMilkBalance();
			//checkChain();
			//if(!incorrectChain)
			//{
			getButterBalance();
			getMaxLeftToStake();
			getStakedMilk();
			getEarnedButter();
			valueGreaterThanMax();
			getMilkApproval().then(checkApproval());
			//checkApproval();
			getPercentOfPool();
			checkSlash();
			//}
			updateSite();
		}, 100);
	}
	//Legacy web3 provider
	else if(window.web3)
	{
		var account = web3.eth.accounts[0];
        var accountInterval = setInterval(function() {
            if (web3.eth.accounts[0] !== account) {
                account = web3.eth.accounts[0];
                document.getElementById("address").innerText = account;
            }
        }, 100);
	}
	
	//Website functions
	function isNumberKey(evt){
		var charCode = (evt.which) ? evt.which : evt.keyCode
		if (charCode > 31 && (charCode != 46 &&(charCode < 48 || charCode > 57)))
			return false;
		return true;
	}
	
	function setMaxStake() {
		//Fill the inputbox with the milkLeftToStake
		getMilkApproval().then(checkApproval()).then(updateSite());
		document.getElementById("stakeAmount").value = milkLeftToStakeString;
	}
	
	function updateSite() {
		//updates site elements if not on correct chain/not enough approval/greater than max stake
		var approveButton = document.getElementById("approvebutton");
		var stakeButton = document.getElementById("stakebutton");
		var warningBanner = document.getElementById("warning");
		if(notEnoughApproval)
		{
			approveButton.style.visibility = "visible";
			stakeButton.style.visibility = "hidden";
		}
		if(tooBigValue)
		{
			stakeButton.style.visibility = "hidden";
			//Show warnign
		}
		if(!tooBigValue && !notEnoughApproval)
		{
			approveButton.style.visibility = "hidden";
			stakeButton.style.visibility = "visible";
		}
		if(slashWillOccur)
		{
			//Warn the user that their rewards will be slashed if they claim or unstake
			getSlashedReward();
			warningBanner.style.display = "block";
			document.getElementById("avoidamount").innerText = stakedMilkString;
			document.getElementById("slashedreward").innerText = slashedRewardString;
			document.getElementById("claimbutton").style.display = "none";
			document.getElementById("claimbutton").style.visibility = "hidden";
			//update the amounts and stuff
		}
		else
		{
			warningBanner.style.display = "none";
			document.getElementById("claimbutton").style.display = "block";
			document.getElementById("claimbutton").style.visibility = "visible";
		}
		if(incorrectChain && !window.ethereum.isTrust)
		{
			document.getElementById("pleaseconnect").style.display = "block";
			document.getElementById("info").style.display = "none";
			document.getElementById("pleaseconnect").style.visibility = "visible";
			document.getElementById("info").style.visibility = "hidden";
		}
		else
		{
			document.getElementById("pleaseconnect").style.display = "none";
			document.getElementById("info").style.display = "block";
			document.getElementById("pleaseconnect").style.visibility = "hidden";
			document.getElementById("info").style.visibility = "visible";
		}
	}
