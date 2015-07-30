(function() {

  "use strict";

  var React                     = require('react')
    , AddFriendButton           = require('./friendshipStatus/addFriendButton.jsx')
    , RequestPendingLabel       = require('./friendshipStatus/requestPendingLabel.jsx')
    , RespondToFriendshipButton = require('./friendshipStatus/respondToFriendshipButton.jsx')
    , UpdateFriendshipButton    = require('./friendshipStatus/updateFriendshipButton.jsx')

  var FriendshipStatusComponent = React.createClass({

    buttonSwitch: function(friendship) {
      if (friendship.friendship) {
        return <UpdateFriendshipButton />
      } else if (friendship.sentRequest) {
        return <RequestPendingLabel />
      } else if (friendship.receivedRequest) {
        return <RespondToFriendshipButton />
      }
      return <AddFriendButton />
    },

    render: function() {
      return (
        <div className="friendship-status">
          {this.buttonSwitch(this.props.friendship)}
        </div>
      );
    }
  })

  module.exports = FriendshipStatusComponent;

}())
