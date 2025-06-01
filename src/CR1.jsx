import { useState, useEffect } from 'react'
import { AngleSlider, Box, Button, Center, Grid, Group, Image, MantineProvider, Modal, Popover, Text, Title } from '@mantine/core';
import { useSearchParams } from "react-router";
import './main.css'
import '@mantine/core/styles.css';

export default function App() {
  const [params, setParams] = useSearchParams();

  const [indoorTemp, setIndoorTemp] = useState(21);
  const [outdoorTemp, setOutdoorTemp] = useState(10);
  const [outdoorTempMax, setOutdoorTempMax] = useState(22);
  const [outdoorTempMin, setOutdoorTempMin] = useState(-8);
  // hardcoded right now b/c too complicated with CSS otherwise
  const [lowerComf, setLowerComf] = useState(16);
  const [higherComf, setHigherComf] = useState(24);

  const [sassyMessage, setSassyMessage] = useState("Everything is fine!")

  // https://www.h2xengineering.com/blogs/calculating-heat-loss-simple-understandable-guide/
  const [heatLoss, setHeatLoss] = useState(0.1); // heat loss per hour per degree - 0.1 would be more realistic but "too slow".

  const [thermostat, setThermostat] = useState(270);
  const thermToHeat = {
    270: 0,
    315: 15,
    345: 18,
     15: 21,
     45: 24,
     75: 27
  }

  const [gamePaused, setGamePaused] = useState(true);

  const delay = Number(params.get("delay")) || 1000;
  const [gameTurn, setGameTurn] = useState(24);

  const [failedTurns, setFailedTurns] = useState(0);
  const [gameFailed, setGameFailed] = useState(false);

  const failureImages = {
    1: 'src/assets/failed1.jpg',
    2: 'src/assets/failed2.jpg',
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!gamePaused) {
        setGameTurn(gameTurn+1)

        // calculate new outdoortemp
        var newOutTemp = outdoorTemp + Math.floor((Math.random()*3)-1)
        if (newOutTemp < outdoorTempMin) { setOutdoorTemp(outdoorTempMin) }
        else if (newOutTemp > outdoorTempMax) { setOutdoorTemp(outdoorTempMax) }
        else { setOutdoorTemp(newOutTemp) }

        // calculate new indoortemp
        var newInTemp = indoorTemp // old indoor temp
        newInTemp += (outdoorTemp-indoorTemp) * heatLoss // temp lost to outside
        if (thermToHeat[thermostat] > newInTemp) {
          newInTemp = (newInTemp + thermToHeat[thermostat]) / 2 // temp gained from heating
        }
        newInTemp = Math.round(newInTemp * 10) / 10 // round to one decimal
        setIndoorTemp(newInTemp)

        if (newInTemp >= higherComf) {
          if (failedTurns > 15) {
            setGamePaused(true)
            setGameFailed(1)
          } else if (failedTurns > 10) {
            setSassyMessage("Are you even trying? You're about to lose, act now!")
          } else {
            setSassyMessage("TOO F****** HIGH BRUH")
          }
          setFailedTurns(failedTurns+1)
        } else if (newInTemp <= lowerComf){
          if (failedTurns > 15) {
            setGamePaused(true)
            setGameFailed(2)
          } else if (failedTurns > 10) {
            setSassyMessage("Are you even trying? You're about to lose, act now!")
          } else {
            setSassyMessage("TOO F****** LOW BRUH")
          }
          setFailedTurns(failedTurns+1)
        } else {
          setFailedTurns(0)
          setSassyMessage("Everything is fine?")
        }

      }
    }, delay)
    return () => clearTimeout(timer)
   },
   [gamePaused, gameTurn, delay, indoorTemp, outdoorTemp]
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
    setParams({ delay: Number(delay*2)})
  }

  function increaseGameStepSize() {
    setParams({ delay: Number(delay/2)})
  }

  function setTempGauge(temp) {
    temp = (temp-21)*5
  }


  return (
  <MantineProvider>
    <Grid align="center" mt="10">

    <Modal
      opened={gameFailed}
      title={
        <Text fw="bold" size="lg" style={{ width: '100%', textAlign: 'center' }}>
          Game Failed!
        </Text>
      }
      withCloseButton={false}
      >
      <Image src={failureImages[gameFailed]} alt="Game failed" />
      <Center>
        <Button mt="1em" onClick={() => window.location.reload()}>Try Again!</Button>
      </Center>
  </Modal>

    <Grid.Col span={12} align="right" mt="xl">
      <Center>
        <Title order={1}>Optimise!</Title>
      </Center>
    </Grid.Col>
    
    <Grid.Col span={12} align="right" >
      <Center>
        <Text>Hello desk monkey. You have one job. Keep the system in the safe zone. Good luck.</Text>
      </Center>
    </Grid.Col>

    <Grid.Col span={3} align="right">
      <Text align="right" hidden>Current temperature:</Text>
    </Grid.Col>
    <Grid.Col span={6} m="0" p="0" align="center">
        <Box
          bg="linear-gradient(90deg, var(--mantine-color-blue-filled) 0%, var(--mantine-color-red-filled) 100%)"
          w="100%"
          m="0"
          p="0"
          h="2em"
        >
        <Group justify="space-between">
          <Text align="left" ml="10px">too cold</Text>
          <Text align="right" mr="10px">too warm</Text>
        </Group>
        <Box h="2.4em" mt="-1.75em" ml={(lowerComf-1)*2.5+"%"} mr={(41-higherComf)*2.5+"%"} bd="3px dotted black">
            <Text align="center">comfy</Text>
        </Box>
        <Box h="2.1em" mt="-2.25em" ml={(indoorTemp-21)*5+"%"}  w="3px" bg="yellow"></Box>
        </Box>
      </Grid.Col>
      <Grid.Col span={3}>
        <Text align="left" hidden>Inside: {indoorTemp}ºC, outside: {outdoorTemp}ºC</Text>
      </Grid.Col>

      <Grid.Col span={12}>
      <Center>
        <Text fw="bold" m="1em">Keep it comfy!</Text>
      </Center>
      </Grid.Col>

      <Grid.Col span={3}>
        <Text fw="bold" hidden={true}>Too cold! Your workplace isn't comfortable anymore, increase the temperature.</Text>
      </Grid.Col>
      <Grid.Col span={6}>
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
        <Grid.Col span={3}>
        </Grid.Col>

        <Grid.Col span={12} >
          <Center>
            <Title order={2}>{sassyMessage}</Title>
          </Center>
        </Grid.Col>

        <Grid.Col span="auto">
          <Center>
          <Group id="app-footer">
            <Text w="12em">Day: {Math.floor(gameTurn/24)}, time: {gameTurn % 24}:00</Text>
            <Button variant="filled" color="green" size="md" radius="md" onClick={decreaseGameStepSize}>(slower)</Button>
            <Popover width={200} position="bottom" withArrow shadow="md" opened={gamePaused && !gameFailed}>
              <Popover.Target>
                <Button w="6em" id="gamePauseButton" variant="filled" color="green" size="lg" radius="lg" onClick={(e) => pauseGame(e)}>Play</Button>
              </Popover.Target>
              <Popover.Dropdown>
                <Text size="s" ta="center" mb="-1em">
                  Hit "Play" to start/resume the game!<br /><br />
                </Text>
                <Text className="bounce arrow" ta="center"mt="1.5em">.</Text>
              </Popover.Dropdown>
            </Popover>
            <Button variant="filled" color="green" size="md" radius="md" onClick={increaseGameStepSize}>(faster)</Button>
            <Text w="12em">Speed: {(1/delay)*1000}x</Text>
          </Group>
          </Center>
        </Grid.Col>
      </Grid>
    </MantineProvider>
  )

}
