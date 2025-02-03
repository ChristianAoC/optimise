//<script src="http://localhost:8097"></script>
import { useState, useEffect } from 'react'
import { AngleSlider, Button, Group, MantineProvider, Text } from '@mantine/core';
import './App.css'
import '@mantine/core/styles.css';

export default function App() {
  const [value, setThermostat] = useState(0);

  const [gamePaused, setGamePaused] = useState(false);
  const [gameStepSize, setGameStepSize] = useState(1000);
  const [gameTurn, setGameTurn] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => !gamePaused && setGameTurn(gameTurn+1), gameStepSize)
    return () => clearTimeout(timer)
   },
   [gamePaused, gameTurn, gameStepSize]
  )
  
  function pauseGame() {
    setGamePaused(!gamePaused);
  }

  function increaseGameStepSize() {
    setGameStepSize(gameStepSize*2);
  }

  function decreaseGameStepSize() {
    setGameStepSize(gameStepSize/2);
  }

  return (
    <MantineProvider>
      <AngleSlider
        aria-label="Angle slider"
        //formatLabel={(value) => `${value}`}
        //remove label (see below) until we figure out how to actually display label not value
        withLabel={false}
        size={300}
        thumbSize={30}
        value={value}
        onChange={setThermostat}
        restrictToMarks
        marks={[
          { value: 270, label: "Off" },
          { value: 315, label: 1 },
          { value: 345, label: 2 },
          { value:  15, label: 3 },
          { value:  45, label: 4 },
          { value:  75, label: 5 }
        ]}
      />

      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <Group>
        <p>Day: {Math.floor(gameTurn/24)}, time: {gameTurn % 24}:00</p>
        <Button variant="filled" color="green" size="md" radius="md" onClick={decreaseGameStepSize}>(slower)</Button>
        <Button variant="filled" color="green" size="lg" radius="lg" onClick={pauseGame}>Pause</Button>
        <Button variant="filled" color="green" size="md" radius="md" onClick={increaseGameStepSize}>(faster)</Button>
        <p>Speed:</p><p>{gameStepSize/1000}x</p>
      </Group>
    </MantineProvider>
  )
}
