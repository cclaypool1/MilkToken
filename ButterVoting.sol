pragma solidity ^0.6.12;
// SPDX-License-Identifier: Unlicensed
import "./Butter.sol";

struct Charity {
    string name;
    string website;
    string description;
    string logo;
    uint256 votes;
    bool partnered;
}

contract ButterVoting is Context, Ownable {
    using SafeMath for uint256;
    using Address for address;
    
    
    address payable butterAddress = 0x0110fF9e7E4028a5337F07841437B92d5bf53762;
    
    //Price calc stuff
    address wbnbAddress = 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c;
    address busdAddress = 0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56;
    address pancakeAddress = 0x1B96B92314C44b159149f7E0303511fB2Fc4774f;
    address butterLPaddress = 0xE1BD982AFea7FbA7A5B875e0a226cc38c7E9A7F2;
    IERC20 wbnb = IERC20(wbnbAddress);
    IERC20 busd = IERC20(busdAddress);
    
    
    //Vote tracking (use mapping to avoid having to iterate through arrays)
    mapping (address => mapping (uint256 => bool)) private voteCast; //[address][pollNumber] => hasVotedBool
    uint256 pollNumber = 0;
    uint256 maxCharitiesPerPoll = 20;
    uint256 butterPrice = 1000; //Price for suggestions (1 BUSD worth of Butter, 1000 for testnet purposes)
    bool polling = false;
    Charity[] charities;
    Charity[] partneredCharities;
    uint256 public _totalCharityCollected;
    
    event winnerChosen(
        string name,
        string website,
        string description,
        string logo,
        uint256 votes
    );
    
    string previousWinnerName;
    string previousWinnerWebsite;
    string previousWinnerDescription;
    string previousWinnerLogo;
    uint256 previousWinnerVotes;
    
    Butter butter = Butter(butterAddress);
    
    IUniswapV2Router02 public immutable uniswapV2Router;
    
    receive() external payable {}
    
    constructor () public {
        
        IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F);
         // Create a uniswap pair for this new token

        // set the rest of the contract variables
        uniswapV2Router = _uniswapV2Router;
        
    }
    
     function swapTokensForEth(uint256 tokenAmount) private {
        // generate the uniswap pair path of token -> weth
        address[] memory path = new address[](2);
        path[0] = butterAddress;
        path[1] = uniswapV2Router.WETH();

        butter.approve(address(uniswapV2Router), tokenAmount);

        // make the swap
        uniswapV2Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            tokenAmount,
            0, // accept any amount of ETH
            path,
            address(this),
            block.timestamp
        );
    }
    
    
    //public transact functions
    //owner functions
    function charityCollectAll() public onlyCharity
    {
        _totalCharityCollected = _totalCharityCollected.add(address(this).balance);
        charity().transfer(address(this).balance);
    }
    
    function clearCharities() public onlyOwner
    {
        //Clear out the charity array, pop all elements
        while(charities.length > 0)
        {
            charities.pop();
        }
    }
    
    function updateMaximumNumberOfCharities(uint256 maxCharities) public onlyOwner
    {
        maxCharitiesPerPoll = maxCharities;
    }
    
    function removeCharity(uint256 index) public onlyOwner
    {
        charities[index] = charities[charities.length-1];
        charities.pop();
    }
    
    function removePartneredCharity(uint256 index) public onlyOwner
    {
        partneredCharities[index] = partneredCharities[partneredCharities.length-1];
        partneredCharities.pop();
    }
    
    function addPartneredCharity(string memory name, string memory website, string memory description, string memory logo) public onlyOwner
    {
        //Add a partnered charity to the list
        Charity memory newCharity = Charity(name, website, description, logo, 0, true);
        partneredCharities.push(newCharity);
    }
    
    function addCharity(string memory name, string memory website, string memory description, string memory logo) public onlyOwner
    {
        require(charities.length < maxCharitiesPerPoll, "Charity list is full for this poll");
        Charity memory newCharity = Charity(name, website, description, logo, 0, false);
        charities.push(newCharity);
    }
    
    function startNewPoll() public onlyOwner
    {
        //Clear charity list
        require(!polling, "Poll already in progress");
        clearCharities();
        for(uint256 i = 0; i < partneredCharities.length; i++)
        {
            charities.push(partneredCharities[i]);
        }
        
        //update poll number
        pollNumber = pollNumber.add(1);
        
        //enable polling
        polling = true;
        
        //Burn any butter from suggestions
        if(butter.balanceOf(address(this)) > 0)
        {
            butter.transfer(burn(), butter.balanceOf(address(this)));
        }
    }
    
    function endPoll() public onlyOwner
    {
        require(polling, "No poll running");
        //disable polling
        polling = false;
        
        //find the winning charity
        uint256 mostVotes = 0;
        Charity memory winner;
        
        for(uint256 i = 0; i < charities.length; i++)
        {
            if(charities[i].votes > mostVotes)
            {
                winner = charities[i];
            }
        }
        
        previousWinnerName = winner.name;
        previousWinnerWebsite = winner.website;
        previousWinnerDescription = winner.description;
        previousWinnerLogo = winner.logo;
        previousWinnerVotes = winner.votes;
        
        emit winnerChosen(winner.name, winner.website, winner.description, winner.logo, winner.votes);
    }
    
    function updatePrice() public onlyOwner
    {
        //set butter price to 1 BUSD equivalent of Butter at the time this funciton is called
        butterPrice = getPrice();
    }
    
    //Update functions
    function updateCharityName(uint256 index, string memory name) public onlyOwner
    {
        charities[index].name = name;
    }
    
    function updateCharityWebsite(uint256 index, string memory website) public onlyOwner
    {
        charities[index].website = website;
    }
    
    function updateCharityDescription(uint256 index, string memory description) public onlyOwner
    {
        charities[index].description = description;
    }
    
    function updateCharityLogo(uint256 index, string memory logo) public onlyOwner
    {
        charities[index].logo = logo;
    }
    
    function updateParnteredCharityName(uint256 index, string memory name) public onlyOwner
    {
        partneredCharities[index].name = name;
    }
    
    function updateParnteredCharityWebsite(uint256 index, string memory website) public onlyOwner
    {
        partneredCharities[index].website = website;
    }
    
    function updateParnteredCharityDescription(uint256 index, string memory description) public onlyOwner
    {
        partneredCharities[index].description = description;
    }
    
    function updateParnteredCharityLogo(uint256 index, string memory logo) public onlyOwner
    {
        partneredCharities[index].logo = logo;
    }
    
    //public functions
    function castVote(uint256 charityIndex) public
    {
        require(butter.balanceOf(msg.sender) > 0, "You have no Butter to vote with!");
        require(voteCast[msg.sender][pollNumber] == false, "You have already voted in this poll");
        charities[charityIndex].votes = charities[charityIndex].votes.add(butter.balanceOf(msg.sender));
        voteCast[msg.sender][pollNumber] = true;
    }
    
    function suggestCharity(string memory name, string memory website, string memory description, string memory logo) public
    {
        updatePrice(); //Update the price to 1 BUSD equivalent of Butter
        
        require(butter.balanceOf(msg.sender) >= butterPrice, "You have no Butter to vote with!");
        require(charities.length < maxCharitiesPerPoll, "There are already the maximum number of charities in this poll!");
        require(voteCast[msg.sender][pollNumber] == false, "You have already voted in this poll, you cannot suggest a charity until the next poll");
        require(polling, "You cannot suggest a charity right now, wait until a poll is active");
        
        //Create a new charity object and cast the subjectors vote
        Charity memory newCharity = Charity(name, website, description, logo, butter.balanceOf(msg.sender), false);
        
        //push to charities list
        charities.push(newCharity);
        
        //mark the suggestor as having having voted
        voteCast[msg.sender][pollNumber] == true;
        
        //Take the appropriate amount of Butter from the suggestor
        uint256 startingButter = butter.balanceOf(address(this));
        butter.transferFrom(msg.sender, address(this), butterPrice);
        uint256 transferedButter = butter.balanceOf(address(this)).sub(startingButter);
        
        //Save half for burning, sell half for collection by charity wallet
        uint256 half = transferedButter.div(2);
        
        swapTokensForEth(half);
    }
    
    //public view functions
    function getCharity(uint256 index) public view returns(string memory, string memory, string memory, string memory, uint256, bool)
    {
        return(charities[index].name, charities[index].website, charities[index].description, charities[index].logo, charities[index].votes, charities[index].partnered);
    }
    
    function getPartneredCharity(uint256 index) public view returns(string memory, string memory, string memory, string memory)
    {
        return(partneredCharities[index].name, partneredCharities[index].website, partneredCharities[index].description, partneredCharities[index].logo);
    }
    
    function getMaxNumberOfCharities() public view returns (uint256)
    {
        return maxCharitiesPerPoll;
    }
    
    function getNumberOfCharities() public view returns (uint256)
    {
        return charities.length;
    }
    
    function getNumberOfPartneredCharities() public view returns (uint256)
    {
        return partneredCharities.length;
    }
    
    function pollingActive() public view returns (bool)
    {
        return polling;
    }
    
    function getPollNumber() public view returns (uint256)
    {
        return pollNumber;
    }
    
    function getPreviousWinner() public view returns (string memory, string memory, string memory, string memory, uint256)
    {
        return(previousWinnerName, previousWinnerWebsite, previousWinnerDescription, previousWinnerLogo, previousWinnerVotes);
    }
    
    function getPrice() public view returns (uint256)
    {
        //Returns 1 BUSD equivalent of BUTTER
        uint256 butterBNBamount = wbnb.balanceOf(butterLPaddress);
        uint256 butterAmount = butter.balanceOf(butterLPaddress);
        
        //Find BNB price in BUSD
        uint256 bnbAmount = wbnb.balanceOf(pancakeAddress);
        uint256 busdAmount = busd.balanceOf(pancakeAddress);
        uint256 bnbPrice = busdAmount.div(bnbAmount);
        
        //Normalize decimals to BNB/BUSD decimals, find amount of Butter 1 BNB is worth
        butterAmount = butterAmount.mul(10**9);
        uint256 butterPerBNB = butterAmount.div(butterBNBamount);
        
        //Find amount of Butter 1 BUSD is worth
        uint256 butterPerBUSD = butterPerBNB.div(bnbPrice);
        butterPerBUSD = butterPerBUSD.mul(10**9); //add back Butter decimals
        return butterPerBUSD;
    }
}
