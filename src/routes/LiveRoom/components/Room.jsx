import React from 'react';

class Room extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { children, location } = this.props;
    //console.log(children.props);
    return (
      <div>
        {children}
      </div>
    );
  }
}

export default Room;
