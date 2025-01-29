import logo from './logo.svg';
import './App.css';
import React from "react";
//import {StyleSheet, Button, View, Text, Alert} from 'react-native';
import styled from "styled-components";

const theme = {
    blue: {
      default: "#3f51b5",
      hover: "#283593",
    },
    pink: {
      default: "#e91e63",
      hover: "#ad1457",
    },
  };

const Button = styled.button`
  background-color: ${(props) => theme[props.theme].default};
  color: white;
  padding: 5px 15px;
  border-radius: 5px;
  outline: 0;
  border: 0; 
  text-transform: uppercase;
  margin: 10px 0px;
  cursor: pointer;
  box-shadow: 0px 2px 2px lightgray;
  transition: ease background-color 250ms;
  &:hover {
    background-color: ${(props) => theme[props.theme].hover};
  }
  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
`;

Button.defaultProps = {
  theme: "blue",
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/*
        <Button
            onPress={
                console.log('You tapped the button!')
            }ERESOLVE unable to resolve dependency tree
            title="Learn More"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
        />
        */}
        <Button onClick={console.log('You tapped the button!')}>Styled Button</Button>
        <br></br>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.

          HELLO WORLD
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
