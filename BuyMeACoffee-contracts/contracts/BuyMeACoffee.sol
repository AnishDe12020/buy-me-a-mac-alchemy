//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract BuyMeACoffee {
  // Event to emit when a Memo is created
  event NewMemo(
    address indexed from,
    uint256 indexed timestamp,
    string name,
    string message
  );

  // Memo Struct
  struct Memo {
    address from;
    uint256 timestamp;
    string name;
    string message;
  }

  // List of all memos received
  Memo[] memos;

  // Address of contract deployer
  address payable owner;

  // Deploy logic
  constructor() {
    owner = payable(msg.sender);
  }

  /**
    * @dev buy a coffee for the contract owner
    * @param _name name of the coffee buyer
    * @param _message message to be sent to the buyer
  */
  function buyCoffee(string memory _name, string memory _message) public payable {
    require(msg.value > 0, "coffee costs more than 0 ETH");

    // Add the memo to storage
    memos.push(Memo(
      msg.sender,
      block.timestamp,
      _name,
      _message
    ));

    // Emit a log event
    emit NewMemo(msg.sender, block.timestamp, _name, _message);
  }

  /**
    * @dev send the entire balance stored in the contract to the owner
  */
  function withdrawTips() public {
    require(owner.send(address(this).balance));
  }

  /**
    * @dev retrieve all the memos stored on the blockchain
  */
  function getMemos() public view returns(Memo[] memory) {
    return memos;
  }
}
