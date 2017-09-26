import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Top from '../components/Top';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

class App extends React.Component {
  render() {
    let styles = {
      marginLeft: '200px',
      marginTop: '70px',
      WebkitTransition: 'all .3s ease-in-out',
      MozTransition: 'all .3s ease-in-out',
      OTransition: 'all .3s ease-in-out',
      transition: 'all .3s ease-in-out',
      height: '100%'
    };
    return (
      <div className="app-container">
        <Sidebar />
        <div style={ styles }>
          <Top />
          { this.props.children }
          <Footer />
        </div>
      </div>
    );
  }
}

export default App;
