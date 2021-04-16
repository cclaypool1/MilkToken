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
    
    
    address payable butterAddress = 0xc71BE573D834755D44B35C1c14C9Cc7906E16d62; //testnet butter
    
    
    //Vote tracking (use mapping to avoid having to iterate through arrays)
    mapping (address => mapping (uint256 => bool)) private voteCast; //[address][pollNumber] => hasVotedBool
    uint256 pollNumber = 0;
    uint256 maxCharitiesPerPoll = 20;
    uint256 butterPrice = 1000; //Price for suggestions (1 BUSD worth of Butter, 1000 for testnet purposes)
    bool polling = false;
    Charity[] charities;
    Charity[] partneredCharities;
    uint256 public _totalCharityCollected;
    
    string previousWinnerName;
    string previousWinnerWebsite;
    string previousWinnerDescription;
    string previousWinnerLogo;
    uint256 previousWinnerVotes;
    
    Butter butter = Butter(butterAddress);
    
    IUniswapV2Router02 public immutable uniswapV2Router;
    
    receive() external payable {}
    
    constructor () public {
        
        IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(0xD99D1c33F9fC3444f8101754aBC46c52416550D1); //testnet factory
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
        for(uint i = 0; i < partneredCharities.length; i++)
        {
            charities.push(partneredCharities[i]);
        }
        
        //update poll number
        pollNumber = pollNumber.add(1);
        
        //enable polling
        polling = true;
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
        require(voteCast[msg.sender][pollNumber] == false, "You have already voted in this poll");
        charities[charityIndex].votes = charities[charityIndex].votes.add(butter.balanceOf(msg.sender));
        voteCast[msg.sender][pollNumber] = true;
    }
    
    //public view functions
    function getCharity(uint256 index) public view returns(string memory, string memory, string memory, string memory)
    {
        return(charities[index].name, charities[index].website, charities[index].description, charities[index].logo);
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
}
