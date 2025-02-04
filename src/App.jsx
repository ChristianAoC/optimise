//<script src="http://localhost:8097"></script>
import { useState, useEffect } from 'react'
import { AngleSlider, Box, Button, Center, Grid, Group, MantineProvider, Text } from '@mantine/core';
import './App.css'
import '@mantine/core/styles.css';

export default function App() {
  const [value, setThermostat] = useState(270);

  const [gamePaused, setGamePaused] = useState(false);
  const [gameStepSize, setGameStepSize] = useState(1000);
  const [gameTurn, setGameTurn] = useState(24);

  useEffect(() => {
    const timer = setTimeout(() => !gamePaused && setGameTurn(gameTurn+1), gameStepSize)
    return () => clearTimeout(timer)
   },
   [gamePaused, gameTurn, gameStepSize]
  )
  
  function pauseGame(e) {
    if (!gamePaused) {
      e.target.innerHTML = "Play";
    } else {
      e.target.innerHTML = "Pause";
    }
    setGamePaused(!gamePaused);
  }

  function decreaseGameStepSize() {
    setGameStepSize(gameStepSize*2);
  }

  function increaseGameStepSize() {
    setGameStepSize(gameStepSize/2);
  }

  return (
  <MantineProvider>
    <Grid align="center">
    <Grid.Col span={2} align="right">
      Current<br></br>temperature:
    </Grid.Col>
    <Grid.Col span={8} m="0" p="0">
      <Center align="center" m="0" p="0">
        <Box
          bg="linear-gradient(90deg, var(--mantine-color-blue-filled) 0%, var(--mantine-color-red-filled) 100%)"
          w="100%"
          m="0"
          p="0"
          h="2em"
        >
        </Box>
      </Center>
      </Grid.Col>
      <Grid.Col span={2}>
      </Grid.Col>

      <Grid.Col span={12}>
      <Center>
        <p>Hello World!</p>
      </Center>
      </Grid.Col>

      <Grid.Col span={12}>
      <Center>
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
        </Center>
        </Grid.Col>

        <Grid.Col span="auto">
          <Center>
          <Group id="app-footer">
            <p>Day: {Math.floor(gameTurn/24)}, time: {gameTurn % 24}:00</p>
            <Button variant="filled" color="green" size="md" radius="md" onClick={decreaseGameStepSize}>(slower)</Button>
            <Button id="gamePauseButton" variant="filled" color="green" size="lg" radius="lg" onClick={(e) => pauseGame(e)}>Pause</Button>
            <Button variant="filled" color="green" size="md" radius="md" onClick={increaseGameStepSize}>(faster)</Button>
            <p>Speed: {(1/gameStepSize)*1000}x</p>
          </Group>
          </Center>
        </Grid.Col>
      </Grid>
    </MantineProvider>
  )
}
