pragma solidity ^0.6.12;
// SPDX-License-Identifier: Unlicensed
import "./Milk.sol";

contract Butter is Context, IERC20, Ownable {
    using SafeMath for uint256;
    using Address for address;
    
    
    //Milk stuff
    address private milkAddress = address(0x7B166D9Cf7B3aaCA5EbC8c403281817Ab40a9c48);
    IERC20 milk = IERC20(milkAddress);
    
    //Staking mappings
    address[] internal stakeholders;
    mapping (address => uint256) private _stakedMilk;
    mapping (address => uint256) private _accruedButter;
    
    function isStakeholder(address _address) public view returns(bool, uint256)
    {
        for (uint256 i = 0; i < stakeholders.length; i++)
        {
            if (_address == stakeholders[i]) return (true, i);
        }
        return (false, 0);
    }
    
    function addStakeholder(address _stakeholder) private
    {
        (bool _isStakeholder, ) = isStakeholder(_stakeholder);
        if(!_isStakeholder) stakeholders.push(_stakeholder);
    } 

   function removeStakeholder(address _stakeholder) private
   {
       (bool _isStakeholder, uint256 s) = isStakeholder(_stakeholder);
       if(_isStakeholder){
           stakeholders[s] = stakeholders[stakeholders.length - 1];
           stakeholders.pop();
       }
   }
    
    
    //Staking pool
    uint256 private _stakedMilkPool;
    uint256 private _totalAccruedButter;
    
    //expense wallets
    address payable private _expenseWallet;
    
    function setExpenseWallet(address payable _address) public onlyOwner
    {
        require(_expenseWallet == address(0), "The expense wallet cannot be changed once set");
        {
            _expenseWallet = _address;
        }
    }
    
    function expense() public view returns(address payable)
    {
        return _expenseWallet;
    }
    
    modifier onlyExpense() {
        require(_expenseWallet == _msgSender(), "Caller is not the expense address");
        _;
    }

    event ExpensesCollected(uint256 ethCollected);
    
    uint256 private _ethReservedForExpenses;
    uint256 private _ethReservedForCharity;
    
    //Failsafe bool to disable redistribution if the number of stakeholders is too high/gas costs exceed max for transactions;
    bool private _failSafe = false;
    function setFailsafe(bool _value) public onlyOwner
    {
        _failSafe = _value;
    }
    
    function failsafe() public view returns(bool)
    {
        return _failSafe;
    }
    
    
    mapping (address => uint256) private _rOwned;
    mapping (address => uint256) private _tOwned;
    mapping (address => mapping (address => uint256)) private _allowances;

    mapping (address => bool) private _isExcludedFromFee;
    mapping (address => bool) private _isDevWallet;

    mapping (address => bool) private _isExcluded;
    address[] private _excluded;
   
    uint256 private constant MAX = ~uint256(0);
    uint256 private _tTotal = 1000000 * 10**6 * 10**12;
    uint256 private _rTotal = (MAX - (MAX % _tTotal));
    uint256 private _tFeeTotal;

    string private _name = "Butter";
    string private _symbol = "BUTTER";
    uint8 private _decimals = 12;
    
    //There are no taxes on butter
    uint256 public _taxFee = 0;
    uint256 private _previousTaxFee = _taxFee;
    
    uint256 public _liquidityFee = 10;
    uint256 private _previousLiquidityFee = _liquidityFee;
    
    uint256 private _charityPercentageOfLiquidity = 50;
    uint256 private _expensePrecentageOfLiquidity = 10;
    uint256 private _stakingPoolPercentageOfLiquidity=20;
    
    uint256 private _totalCharityCollected = 0;
    uint256 private _totalExpensesCollected = 0;

    IUniswapV2Router02 public immutable uniswapV2Router;
    address public immutable uniswapV2Pair;
    
    bool inSwapAndLiquify;
    bool public swapAndLiquifyEnabled = true;
    
    uint256 public _maxTxAmount = 1000000 * 10**6 * 10**12;
    uint256 private numTokensSellToAddToLiquidity = 500 * 10**6 * 10**12;
    
    event MinTokensBeforeSwapUpdated(uint256 minTokensBeforeSwap);
    event SwapAndLiquifyEnabledUpdated(bool enabled);
    event SwapAndLiquify(
        uint256 tokensSwapped,
        uint256 ethReceived,
        uint256 tokensIntoLiqudity
    );
    
    event CharityCollected(uint256 ethCollected);

    
    modifier lockTheSwap {
        inSwapAndLiquify = true;
        _;
        inSwapAndLiquify = false;
    }
    
    constructor () public {
        require(owner() == milkAddress);//*
        _rOwned[_msgSender()] = _rTotal;
        
        IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(0xD99D1c33F9fC3444f8101754aBC46c52416550D1);
         // Create a uniswap pair for this new token
        uniswapV2Pair = IUniswapV2Factory(_uniswapV2Router.factory())
            .createPair(address(this), _uniswapV2Router.WETH());

        // set the rest of the contract variables
        uniswapV2Router = _uniswapV2Router;
        
        //exclude owner and this contract from fee
        _isExcludedFromFee[owner()] = true;
        _isExcludedFromFee[address(this)] = true;
        _isExcludedFromFee[burn()] = true;
        require(charity() == milkAddress);//*
        
        emit Transfer(address(0), _msgSender(), _tTotal);
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view override returns (uint256) {
        return _tTotal;
    }

    function balanceOf(address account) public view override returns (uint256) {
        if (_isExcluded[account]) return _tOwned[account];
        return tokenFromReflection(_rOwned[account]);
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    function allowance(address owner, address spender) public view override returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) public override returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        _transfer(sender, recipient, amount);
        _approve(sender, _msgSender(), _allowances[sender][_msgSender()].sub(amount, "ERC20: transfer amount exceeds allowance"));
        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].add(addedValue));
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].sub(subtractedValue, "ERC20: decreased allowance below zero"));
        return true;
    }

    function isExcludedFromReward(address account) public view returns (bool) {
        return _isExcluded[account];
    }

    function totalFees() public view returns (uint256) {
        return _tFeeTotal;
    }
    
    
    function charityPercentageOfLiquidity() public view returns (uint256)
    {
        return _charityPercentageOfLiquidity;
    }
    
    function totalCharityCollected() public view returns (uint256)
    {
        return _totalCharityCollected;
    }
    
    function deliver(uint256 tAmount) public {
        address sender = _msgSender();
        require(!_isExcluded[sender], "Excluded addresses cannot call this function");
        (uint256 rAmount,,,,,) = _getValues(tAmount);
        _rOwned[sender] = _rOwned[sender].sub(rAmount);
        _rTotal = _rTotal.sub(rAmount);
        _tFeeTotal = _tFeeTotal.add(tAmount);
    }

    function reflectionFromToken(uint256 tAmount, bool deductTransferFee) public view returns(uint256) {
        require(tAmount <= _tTotal, "Amount must be less than supply");
        if (!deductTransferFee) {
            (uint256 rAmount,,,,,) = _getValues(tAmount);
            return rAmount;
        } else {
            (,uint256 rTransferAmount,,,,) = _getValues(tAmount);
            return rTransferAmount;
        }
    }

    function tokenFromReflection(uint256 rAmount) public view returns(uint256) {
        require(rAmount <= _rTotal, "Amount must be less than total reflections");
        uint256 currentRate =  _getRate();
        return rAmount.div(currentRate);
    }

    function excludeFromReward(address account) public onlyOwner() {
        // require(account != 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D, 'We can not exclude Uniswap router.');
        require(!_isExcluded[account], "Account is already excluded");
        if(_rOwned[account] > 0) {
            _tOwned[account] = tokenFromReflection(_rOwned[account]);
        }
        _isExcluded[account] = true;
        _excluded.push(account);
    }

    function includeInReward(address account) external onlyOwner() {
        require(_isExcluded[account], "Account is already excluded");
        for (uint256 i = 0; i < _excluded.length; i++) {
            if (_excluded[i] == account) {
                _excluded[i] = _excluded[_excluded.length - 1];
                _tOwned[account] = 0;
                _isExcluded[account] = false;
                _excluded.pop();
                break;
            }
        }
    }
    
    function devWallet(address account) public view returns(bool) {
        return _isDevWallet[account];
    }
    
    function setAsDevWallet(address account) external onlyOwner() {
        _isDevWallet[account] = true;
    }
    
    function _transferBothExcluded(address sender, address recipient, uint256 tAmount) private {
        (uint256 rAmount, uint256 rTransferAmount, uint256 rFee, uint256 tTransferAmount, uint256 tFee, uint256 tLiquidity) = _getValues(tAmount);
        _tOwned[sender] = _tOwned[sender].sub(tAmount);
        _rOwned[sender] = _rOwned[sender].sub(rAmount);
        _tOwned[recipient] = _tOwned[recipient].add(tTransferAmount);
        _rOwned[recipient] = _rOwned[recipient].add(rTransferAmount);        
        _takeLiquidity(tLiquidity);
        _reflectFee(rFee, tFee);
        emit Transfer(sender, recipient, tTransferAmount);
    }
    
        function excludeFromFee(address account) public onlyOwner {
        _isExcludedFromFee[account] = true;
    }
    
    function includeInFee(address account) public onlyOwner {
        _isExcludedFromFee[account] = false;
    }

    function setSwapAndLiquifyEnabled(bool _enabled) public onlyOwner {
        swapAndLiquifyEnabled = _enabled;
        emit SwapAndLiquifyEnabledUpdated(_enabled);
    }
    
     //to recieve ETH from uniswapV2Router when swaping
    receive() external payable {}

    function _reflectFee(uint256 rFee, uint256 tFee) private {
        _rTotal = _rTotal.sub(rFee);
        _tFeeTotal = _tFeeTotal.add(tFee);
    }

    function _getValues(uint256 tAmount) private view returns (uint256, uint256, uint256, uint256, uint256, uint256) {
        (uint256 tTransferAmount, uint256 tFee, uint256 tLiquidity) = _getTValues(tAmount);
        (uint256 rAmount, uint256 rTransferAmount, uint256 rFee) = _getRValues(tAmount, tFee, tLiquidity, _getRate());
        return (rAmount, rTransferAmount, rFee, tTransferAmount, tFee, tLiquidity);
    }

    function _getTValues(uint256 tAmount) private view returns (uint256, uint256, uint256) {
        uint256 tFee = calculateTaxFee(tAmount);
        uint256 tLiquidity = calculateLiquidityFee(tAmount);
        uint256 tTransferAmount = tAmount.sub(tFee).sub(tLiquidity);
        return (tTransferAmount, tFee, tLiquidity);
    }

    function _getRValues(uint256 tAmount, uint256 tFee, uint256 tLiquidity, uint256 currentRate) private pure returns (uint256, uint256, uint256) {
        uint256 rAmount = tAmount.mul(currentRate);
        uint256 rFee = tFee.mul(currentRate);
        uint256 rLiquidity = tLiquidity.mul(currentRate);
        uint256 rTransferAmount = rAmount.sub(rFee).sub(rLiquidity);
        return (rAmount, rTransferAmount, rFee);
    }

    function _getRate() private view returns(uint256) {
        (uint256 rSupply, uint256 tSupply) = _getCurrentSupply();
        return rSupply.div(tSupply);
    }

    function _getCurrentSupply() private view returns(uint256, uint256) {
        uint256 rSupply = _rTotal;
        uint256 tSupply = _tTotal;      
        for (uint256 i = 0; i < _excluded.length; i++) {
            if (_rOwned[_excluded[i]] > rSupply || _tOwned[_excluded[i]] > tSupply) return (_rTotal, _tTotal);
            rSupply = rSupply.sub(_rOwned[_excluded[i]]);
            tSupply = tSupply.sub(_tOwned[_excluded[i]]);
        }
        if (rSupply < _rTotal.div(_tTotal)) return (_rTotal, _tTotal);
        return (rSupply, tSupply);
    }
    
    function _takeLiquidity(uint256 tLiquidity) private {
        
        //Do the staking redistribtuion here so it can be done every transaction
         //Take a percentage out of the tLiqudity here and distribute;
        if(stakeholders.length > 1 && !_failSafe)
        {
            //there are people staking MILK
            uint256 distributionAmount = (tLiquidity.mul(_stakingPoolPercentageOfLiquidity)).div(10**2);
            _distributeButter(distributionAmount);
        }
        
        uint256 currentRate =  _getRate();
        uint256 rLiquidity = tLiquidity.mul(currentRate);
        
       
        
        _rOwned[address(this)] = _rOwned[address(this)].add(rLiquidity);
        if(_isExcluded[address(this)])
            _tOwned[address(this)] = _tOwned[address(this)].add(tLiquidity);
            
        
    }
    
    function calculateTaxFee(uint256 _amount) private view returns (uint256) {
        return _amount.mul(_taxFee).div(
            10**2
        );
    }

    function calculateLiquidityFee(uint256 _amount) private view returns (uint256) {
        return _amount.mul(_liquidityFee).div(
            10**2
        );
    }
    
    function removeAllFee() private {
        if(_taxFee == 0 && _liquidityFee == 0) return;
        
        _previousTaxFee = _taxFee;
        _previousLiquidityFee = _liquidityFee;
        
        _taxFee = 0;
        _liquidityFee = 0;
    }
    
    function restoreAllFee() private {
        _taxFee = _previousTaxFee;
        _liquidityFee = _previousLiquidityFee;
    }
    
    function setDevWalletFee() private {
        //Any dev wallets are subjected to a higher fee (2x)
        if(_taxFee == 0 && _liquidityFee == 0) return;
        
        _previousTaxFee = _taxFee;
        _previousLiquidityFee = _liquidityFee;
        
        _liquidityFee = _liquidityFee.mul(2);
        _taxFee = _taxFee.mul(2);
    }

    
    function isExcludedFromFee(address account) public view returns(bool) {
        return _isExcludedFromFee[account];
    }

    function _approve(address owner, address spender, uint256 amount) private {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function _transfer(
        address from,
        address to,
        uint256 amount
    ) private {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        require(to != charity(), "The charity address cannot receive tokens");
        require(from != charity(), "The charity address cannot send tokens");
        require(from != expense(), "The expense address cannot send tokens");
        require(to != expense(), "The expense address cannot receive tokens");
        require(amount > 0, "Transfer amount must be greater than zero");
        if((from != owner() && to != owner()))
            require(amount <= _maxTxAmount, "Transfer amount exceeds the maxTxAmount.");

        // is the token balance of this contract address over the min number of
        // tokens that we need to initiate a swap + liquidity lock?
        // also, don't get caught in a circular liquidity event.
        // also, don't swap & liquify if sender is uniswap pair.
        uint256 contractTokenBalance = balanceOf(address(this)).sub(_totalAccruedButter);
        
        if(contractTokenBalance >= _maxTxAmount)
        {
            contractTokenBalance = _maxTxAmount;
        }

        //This needs to ignore the accrued butter otherwise it wont be reserved for the pool to claim
        bool overMinTokenBalance = contractTokenBalance >= numTokensSellToAddToLiquidity;
        if (
            overMinTokenBalance &&
            !inSwapAndLiquify &&
            from != uniswapV2Pair &&
            swapAndLiquifyEnabled
        ) {
            contractTokenBalance = numTokensSellToAddToLiquidity;
            //add liquidity
            swapAndLiquify(contractTokenBalance);
        }
        
        //indicates if fee should be deducted from transfer
        bool takeFee = true;
        
        //if any account belongs to _isExcludedFromFee account then remove the fee
        if(_isExcludedFromFee[from] || _isExcludedFromFee[to]){
            takeFee = false;
        }
        
        //transfer amount, it will take tax, burn, liquidity fee
        _tokenTransfer(from,to,amount,takeFee);
    }
    
    function collectCharity() public onlyCharity
    {
        _totalCharityCollected = _totalCharityCollected.add(_ethReservedForCharity);
        emit CharityCollected(_ethReservedForCharity);
        charity().transfer(_ethReservedForCharity);
        _ethReservedForCharity = 0;
    }
    
    
    //This will be used if the contract begins to accrue BNB through liquidity swap
    //That would otherwise be untouchable
    function charityCollectAll() public onlyCharity
    {
        _totalCharityCollected = _totalCharityCollected.add(address(this).balance);
        emit CharityCollected(address(this).balance);
        charity().transfer(address(this).balance);
        _ethReservedForCharity = 0;
        _ethReservedForExpenses = 0;
    }
    
    function collectExpenses() public onlyExpense
    {
        _totalExpensesCollected = _totalExpensesCollected.add(_ethReservedForExpenses);
        emit ExpensesCollected(_ethReservedForExpenses);
        expense().transfer(_ethReservedForExpenses);
        _ethReservedForExpenses = 0;
    }

    function swapAndLiquify(uint256 contractTokenBalance) private lockTheSwap {
        // split the contract balance into halves
        uint256 half = contractTokenBalance.div(2);
        uint256 otherHalf = contractTokenBalance.sub(half);
        

        // capture the contract's current ETH balance.
        // this is so that we can capture exactly the amount of ETH that the
        // swap creates, and not make the liquidity event include any ETH that
        // has been manually sent to the contract
        // this also ignores any ETH that was reserved for charity last time
        // this was called
        uint256 initialBalance = address(this).balance;

        // swap tokens for ETH
        swapTokensForEth(half); // <- this breaks the ETH -> MILK swap when swap+liquify is triggered

        // how much ETH did we just swap into?
        uint256 newBalance = address(this).balance.sub(initialBalance);
        
        
        //Now reserve some of that eth for charity to collect
        uint256 balanceToCharity = (newBalance.mul(charityPercentageOfLiquidity())).div(10**2);
        _ethReservedForCharity = _ethReservedForCharity.add(balanceToCharity);
        uint256 tokensExtraFromCharity = (otherHalf.mul(charityPercentageOfLiquidity())).div(10**2);
        uint256 balanceToExpense = (newBalance.mul(_expensePrecentageOfLiquidity)).div(10**2);
        _ethReservedForExpenses = _ethReservedForCharity.add(balanceToExpense);
        uint256 tokensExtraFromExpense = (otherHalf.mul(_expensePrecentageOfLiquidity)).div(10**2);
        
        //How much eth is left for liquidity?
        newBalance = newBalance.sub(balanceToCharity).sub(balanceToExpense);
        
        //how many tokens are left for liquidity?
        otherHalf = otherHalf.sub(tokensExtraFromCharity).sub(tokensExtraFromExpense);
        
        //Leftover tokens will be swapped into liquidity the next time this is called
        

        // add liquidity to uniswap
        addLiquidity(otherHalf, newBalance);
        
        emit SwapAndLiquify(half, newBalance, otherHalf);
    }

    function swapTokensForEth(uint256 tokenAmount) private {
        // generate the uniswap pair path of token -> weth
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = uniswapV2Router.WETH();

        _approve(address(this), address(uniswapV2Router), tokenAmount);

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
        _approve(address(this), address(uniswapV2Router), tokenAmount);

        // add the liquidity
        uniswapV2Router.addLiquidityETH{value: ethAmount}(
            address(this),
            tokenAmount,
            0, // slippage is unavoidable
            0, // slippage is unavoidable
            lockedLiquidity(),
            block.timestamp
        );
    }

    //this method is responsible for taking all fee, if takeFee is true
    function _tokenTransfer(address sender, address recipient, uint256 amount,bool takeFee) private {
        if(!takeFee)
            removeAllFee();
        if(devWallet(sender)) setDevWalletFee();
        
    
            if (_isExcluded[sender] && !_isExcluded[recipient]) {
            _transferFromExcluded(sender, recipient, amount);
        } else if (!_isExcluded[sender] && _isExcluded[recipient]) {
            _transferToExcluded(sender, recipient, amount);
        } else if (!_isExcluded[sender] && !_isExcluded[recipient]) {
            _transferStandard(sender, recipient, amount);
        } else if (_isExcluded[sender] && _isExcluded[recipient]) {
            _transferBothExcluded(sender, recipient, amount);
        } else {
            _transferStandard(sender, recipient, amount);
        }
        
        if(!takeFee)
            restoreAllFee();
        if(devWallet(sender)) restoreAllFee();
    }

    function _transferStandard(address sender, address recipient, uint256 tAmount) private {
        (uint256 rAmount, uint256 rTransferAmount, uint256 rFee, uint256 tTransferAmount, uint256 tFee, uint256 tLiquidity) = _getValues(tAmount);
        _rOwned[sender] = _rOwned[sender].sub(rAmount);
        _rOwned[recipient] = _rOwned[recipient].add(rTransferAmount);
        _takeLiquidity(tLiquidity);
        _reflectFee(rFee, tFee);
        emit Transfer(sender, recipient, tTransferAmount);
    }
    
     function _transferToExcluded(address sender, address recipient, uint256 tAmount) private {
        (uint256 rAmount, uint256 rTransferAmount, uint256 rFee, uint256 tTransferAmount, uint256 tFee, uint256 tLiquidity) = _getValues(tAmount);
        _rOwned[sender] = _rOwned[sender].sub(rAmount);
        _tOwned[recipient] = _tOwned[recipient].add(tTransferAmount);
        _rOwned[recipient] = _rOwned[recipient].add(rTransferAmount);           
        _takeLiquidity(tLiquidity);
        _reflectFee(rFee, tFee);
        emit Transfer(sender, recipient, tTransferAmount);
    }

    function _transferFromExcluded(address sender, address recipient, uint256 tAmount) private {
        (uint256 rAmount, uint256 rTransferAmount, uint256 rFee, uint256 tTransferAmount, uint256 tFee, uint256 tLiquidity) = _getValues(tAmount);
        _tOwned[sender] = _tOwned[sender].sub(tAmount);
        _rOwned[sender] = _rOwned[sender].sub(rAmount);
        _rOwned[recipient] = _rOwned[recipient].add(rTransferAmount);   
        _takeLiquidity(tLiquidity);
        _reflectFee(rFee, tFee);
        emit Transfer(sender, recipient, tTransferAmount);
    }
    
    
    //Milk staking functions
    function _stakeMilk(uint256 stakeAmount) public
    {
        //Make sure the message sender has enought Milk
        require(milk.balanceOf(msg.sender) >= stakeAmount, "Insufficient Milk balance");
        
        //Find out how much Milk is staked
        uint256 initialMilkBalance = milk.balanceOf(address(this));
        
        //Transfer milk from the sender
        milk.transferFrom(msg.sender, address(this), stakeAmount);
        
        //Find out how much Milk was collected 
        uint256 newMilkBalance = milk.balanceOf(address(this));
        
        
        uint256 milkReceived = newMilkBalance.sub(initialMilkBalance);
        
        
        _stakedMilk[msg.sender] = _stakedMilk[msg.sender].add(milkReceived);
        _stakedMilkPool = _stakedMilkPool.add(milkReceived);
        
        //Ensure that the message sender address is in the butter earnings pool
        _accruedButter[msg.sender] = _accruedButter[msg.sender];
        
        
        //Add the user as a stakeholder if they are not already
        (bool _isStakeholder, ) = isStakeholder(msg.sender);
        if (!_isStakeholder) addStakeholder(msg.sender);
    }
    
    function _unstakeMilk(uint256 unstakeAmount) public
    {
        //Make sure that the sender has this amount of milk _stakedMilkPool
        require(_stakedMilk[msg.sender] >= unstakeAmount, "Insufficient staked Milk");
        
        //Remove the stakeholder if the person has taken out all of their milk
        if (unstakeAmount == _stakedMilk[msg.sender])
        {
            removeStakeholder(msg.sender);
        }
        
        //Transfer milk back to the sender
        _stakedMilk[msg.sender] = _stakedMilk[msg.sender].sub(unstakeAmount);
        _stakedMilkPool = _stakedMilkPool.sub(unstakeAmount);
        milk.transfer(msg.sender, unstakeAmount);
        
    }

    //Staking view funcitons
    function _addressStakedMilk(address addy) public view returns (uint256)
    {
        return _stakedMilk[addy];
    }
    
    function _totalStakedMilk() public view returns (uint256)
    {
        return _stakedMilkPool;
    }
    
    
    //Butter Earning Stuff
    function _claimButter(uint256 amount) public
    {
        require(_accruedButter[msg.sender] >= amount, "Insufficient accrued butter");
        
        //Use min here to avoid potential edge case due to rounding somewhere
        transfer(msg.sender, min(amount, _totalAccruedButter));
        _totalAccruedButter = _totalAccruedButter.sub(min(amount, _totalAccruedButter));
        _accruedButter[msg.sender] = _accruedButter[msg.sender].sub(min(amount, _totalAccruedButter));
    }
    
    function min(uint256 a, uint256 b) internal pure returns (uint256) 
    {
        if(a >= b) return b;
        else return a;
    }
    
    function _distributeButter(uint256 amount) private
    {
        //Distribute an amount of Butter to all users with staked Milk proportional to their staked
        uint256 remainingAmount = amount;
        uint256 stakedAmount;
        uint256 earnedAmount;
        for(uint256 i = 0; i < stakeholders.length; i++)
        {
            stakedAmount = _stakedMilk[stakeholders[i]];
            earnedAmount = (stakedAmount.mul(amount)).div(_totalStakedMilk());
            
            //Use min here to avoid giving the total shareholders more than the amount as the result of integer rounding
            _accruedButter[stakeholders[i]] = _accruedButter[stakeholders[i]].add(min(earnedAmount, remainingAmount));
            remainingAmount = remainingAmount.sub(min(earnedAmount, remainingAmount));
            _totalAccruedButter = _totalAccruedButter.add(min(earnedAmount, remainingAmount));
        }
    }
}