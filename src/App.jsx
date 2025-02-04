//<script src="http://localhost:8097"></script>
import { useState, useEffect } from 'react'
import { AngleSlider, Box, Button, Center, Grid, Group, MantineProvider, Text } from '@mantine/core';
import './App.css'
import '@mantine/core/styles.css';

export default function App() {
  const [indoorTemp, setIndoorTemp] = useState(21);
  const [outdoorTemp, setOutdoorTemp] = useState(10);
  const [outdoorTempMax, setOutdoorTempMax] = useState(22);
  const [outdoorTempMin, setOutdoorTempMin] = useState(-8);
  const [lowerComf, setLowerComf] = useState(18);
  const [higherComf, setHigherComf] = useState(24);

  // https://www.h2xengineering.com/blogs/calculating-heat-loss-simple-understandable-guide/
  const [heatLoss, setHeatLoss] = useState(0.1); // heat loss per hour per degree - 0.1 would be more realistic but "too slow".

  const [thermostat, setThermostat] = useState(270);
  const thermToHeat = {
    270: 0,
    315: 0.5,
    345: 1,
     15: 1.75,
     45: 2.5,
     75: 3.5
  }

  const [gamePaused, setGamePaused] = useState(false);
  const [gameStepSize, setGameStepSize] = useState(10); // 1000 is one second ticks
  const [gameTurn, setGameTurn] = useState(24);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!gamePaused) {
        setGameTurn(gameTurn+1)

        // calculate new outdoortemp
        var newOutTemp = outdoorTemp + Math.floor((Math.random()*3)-1)
        if (newOutTemp < outdoorTempMin) { setOutdoorTemp(outdoorTempMin) }
        else if (newOutTemp > outdoorTempMax) { setOutdoorTemp(outdoorTempMax) }
        else { setOutdoorTemp(newOutTemp) }
        setOutdoorTemp(newOutTemp)

        // calculate new indoortemp
        var newInTemp = indoorTemp // old indoor temp
        newInTemp += (outdoorTemp-indoorTemp) * heatLoss // temp lost to outside
        newInTemp += thermToHeat[thermostat] // temp gained from heating
        newInTemp = Math.round(newInTemp * 10) / 10 // round to one decimal
        setIndoorTemp(newInTemp)
      }
    }, gameStepSize)
    return () => clearTimeout(timer)
   },
   [gamePaused, gameTurn, gameStepSize, indoorTemp, outdoorTemp]
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
    <Grid align="center" mt="10">
    <Grid.Col span={3} align="right">
      Current temperature:
    </Grid.Col>
    <Grid.Col span={6} m="0" p="0">
      <Center align="center" m="0" p="0">
        <Box
          bg="linear-gradient(90deg, var(--mantine-color-blue-filled) 0%, var(--mantine-color-red-filled) 100%)"
          w="100%"
          m="0"
          p="0"
          h="2em"
        >
          <Group justify="space-between">
            <Text align="left" ml="10px">too cold</Text>
            <Box bd="2px dotted black" m="-2px" h="2.2em" p="0px 2em 0px 2em">
              <Text align="center">comfy</Text>
            </Box>
            <Text align="right" mr="10px">too warm</Text>
          </Group>
        </Box>
      </Center>
      </Grid.Col>
      <Grid.Col span={3}>
        <Text align="left">Inside: {indoorTemp}, outside: {outdoorTemp}</Text>
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
          value={thermostat}
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
