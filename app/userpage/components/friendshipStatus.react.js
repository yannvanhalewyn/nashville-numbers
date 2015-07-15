(function() {

  "use strict";

  var React                     = require('react')
    , AddFriendButton           = require('./friendshipStatus/addFriendButton.react')
    , RequestPendingLabel       = require('./friendshipStatus/requestPendingLabel.react')
    , RespondToFriendshipButton = require('./friendshipStatus/respondToFriendshipButton.react')
    , UpdateFriendshipButton    = require('./friendshipStatus/UpdateFriendshipButton.react')

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
