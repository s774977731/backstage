import React from 'react';

class Other extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { children, location } = this.props;
    console.log(children.props.route.path);
    return (
      <div>
        {children}
      </div>
    );
  }
}

export default Other;
