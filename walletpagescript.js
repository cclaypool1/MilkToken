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
	/*else if (window.BinanceChain){
		//Tell the user to connect
		web3 = new Web3(window.BinanceChain);
		
		try {
			window.BinanceChain.requestAccounts().then(function() {
			
			});
		} catch(e) {
		
		}
	}*/
	else
	{
		alert('You must connect to Web3!');
	}
	//Init stuff
	const BN = web3.utils.BN;
	
	
	if (window.ethereum) {
		//Do the functions in here to avoid JS errors when unconnected
		var wbnbAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
        var busdAddress = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";
		var milkContractAddress = "0xb7CEF49d89321e22dd3F51a212d58398Ad542640";
		var butterContractAddress = "0x0110fF9e7E4028a5337F07841437B92d5bf53762";
		
		var milkLPaddress = "0x18e13207ef3032275cbca9f210b2fb513d3ba1b1";
		var butterLPaddress = "0xe1bd982afea7fba7a5b875e0a226cc38c7e9a7f2";
		
		var pancakeAddress = "0x1B96B92314C44b159149f7E0303511fB2Fc4774f";
		
		var butterContract = new web3.eth.Contract(JSON.parse(butterABI), butterContractAddress);
		var milkContract = new web3.eth.Contract(JSON.parse(milkABI), milkContractAddress);
		var wbnbContract = new web3.eth.Contract(JSON.parse(wbnbABI), wbnbAddress);
		var busdContract = new web3.eth.Contract(JSON.parse(busdABI), busdAddress);
		
		var milkTokenBalance;
		var milkTokenDecimals;
		
		var butterTokenBalance;
		var butterTokenDecimals;
		
		var stakedMilk;
		var earnedButter;
		
		var milkTokenBalanceString;
		var butterTokenBalanceString;
		var stakedMilkString;
		var earnedButterString;
		var totalMilkString;
		var totalButterString;
		
		var totalMilk;
		var totalButter;
		
		var totalMilkFloat;
		var totalButterFloat;
		
		var milkPrice;
		var butterPrice;
		var bnbPrice;
		var milkValue;
		var butterValue;
		var totalValue;
		
		
		var account = window.ethereum.selectedAddress;
		if(!window.ethereum.isTrust)
		{
			var accountInterval = setInterval(function() {
				//if (window.ethereum.selectedAddress !== account) {
					account = window.ethereum.selectedAddress; 
			// }
			}, 100);
		}
		else
		{
			var accountInterval = setInterval(function() {
				account = window.ethereum.address;
			}, 100);
		}
		
		var balanceInterval = setInterval(function () {
			updateSite();
		}, 100);
		
		
		
		async function getMilkBalance() {
			milkTokenBalance = await milkContract.methods.balanceOf(account).call();
			milkTokenDecimals = await milkContract.methods.decimals().call();
		
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
			milkTokenBalanceString = beforeDecimal;// + "." + afterDecimal;
			//document.getElementById("milk_balance").innerText = beforeDecimal + "." + afterDecimal;
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
			butterTokenBalanceString = beforeDecimal;// + "." + afterDecimal;
			//document.getElementById("butter_balance").innerText = beforeDecimal + "." + afterDecimal;
		}
		
		async function getStakedMilk() {
			stakedMilk = await butterContract.methods._addressStakedMilk(account).call({from: account});
			milkTokenDecimals = await milkContract.methods.decimals().call();
		
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
			stakedMilkString = beforeDecimal;// + "." + afterDecimal;
			//document.getElementById("stake").innerText = beforeDecimal + "." + afterDecimal;
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
			earnedButterString = beforeDecimal;// + "." + afterDecimal;
			//document.getElementById("earnings").innerText = beforeDecimal + "." + afterDecimal;
		}
		
		async function getTotals()
		{
			
			
			totalMilk = BigInt(milkTokenBalance) + BigInt(stakedMilk);
			totalButter = BigInt(butterTokenBalance) + BigInt(earnedButter);
			
			var totalMilkTruncated = totalMilk / BigInt(10**9);
			var totalButterTruncated = totalButter / BigInt(10**9);
			
			totalMilkString = totalMilkTruncated.toString();
			totalButterString = totalButterTruncated.toString();
			
			totalMilkFloat = parseFloat(totalMilkString);
			totalButterFloat = parseFloat(totalButterString);
		}
		
		async function getPrices()
		{
			
			
			//Token LP info
			var butterBNBamount = await wbnbContract.methods.balanceOf(butterLPaddress).call();
			var milkBNBamount = await wbnbContract.methods.balanceOf(milkLPaddress).call();
			var milkAmount = await milkContract.methods.balanceOf(milkLPaddress).call();
			var butterAmount = await butterContract.methods.balanceOf(butterLPaddress).call();
			
			//BNB Price info
			var bnbAmount = await wbnbContract.methods.balanceOf(pancakeAddress).call();
			var busdAmount = await busdContract.methods.balanceOf(pancakeAddress).call();
			bnbPrice = parseFloat(busdAmount) / parseFloat(bnbAmount);
			
			milkAmount = parseFloat(milkAmount) * parseFloat(10 ** (18 - 9));
			butterAmount = parseFloat(butterAmount) * parseFloat(10 ** (18 - 9));
			
			milkPrice = milkBNBamount / milkAmount * bnbPrice;
			butterPrice = butterBNBamount / butterAmount * bnbPrice;
			
			milkValue = totalMilkFloat * milkPrice;
			butterValue = totalButterFloat * butterPrice;
			totalValue = milkValue + butterValue;
			totalValue = totalValue.toFixed(2);
		}
		
		async function updateSite()
		{
			//set all the site elements here
			await getMilkBalance();
			await getButterBalance();
			await getEarnedButter();
			await getStakedMilk();
			await getTotals();
			await getPrices();
			
			document.getElementById("milkwallet").innerText = parseFloat(milkTokenBalanceString).toLocaleString();
			document.getElementById("stakedmilk").innerText = parseFloat(stakedMilkString).toLocaleString();
			document.getElementById("butterwallet").innerText = parseFloat(butterTokenBalanceString).toLocaleString();
			document.getElementById("butterrewards").innerText = parseFloat(earnedButterString).toLocaleString();
			document.getElementById("totalmilk").innerText = parseFloat(totalMilkString).toLocaleString();
			document.getElementById("totalbutter").innerText = parseFloat(totalButterString).toLocaleString();
			document.getElementById("totalusd").innerText = "$" + totalValue.toString();
		}
		
		
	}
