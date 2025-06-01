import { useState, useEffect } from 'react'
import { AngleSlider, Box, Button, Center, Grid, Group, Image, MantineProvider, Modal, Popover, Stack, Text, TextInput, Title, em } from '@mantine/core';
import { useElementSize, useMediaQuery } from '@mantine/hooks';
import { useSearchParams } from "react-router";
import './main.css'
import '@mantine/core/styles.css';

export default function App() {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

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
    315: 20,
    345: 25,
     15: 30,
     45: 35,
     75: 40
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

  const { ref, width } = useElementSize();
  const angleSize = Math.max(Math.min(width, 300), 100);

  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  const [nameInputOpen, setNameInputOpen] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [nameInput, setNameInput] = useState("");

  const [pendingScore, setPendingScore] = useState(0);

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
            gameOver(1)
          } else if (failedTurns > 10) {
            setSassyMessage("Are you even trying? You're about to lose, act now!")
          } else {
            setSassyMessage("TOO F****** HIGH BRUH")
          }
          setFailedTurns(failedTurns+1)
        } else if (newInTemp <= lowerComf){
          if (failedTurns > 15) {
            gameOver(2)
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

  function gameOver(cond) {
    setGamePaused(true)
    setGameFailed(cond)
    setPendingScore(score);
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

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

  function saveScore(name, score) {
    const old = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    const updated = [...old, { name, score }];
    updated.sort((a, b) => b.score - a.score); // sort descending
    localStorage.setItem('leaderboard', JSON.stringify(updated.slice(0, 10))); // keep top 10
  }

  return (
  <MantineProvider>
    <Grid align="center" mt="10">

    <Modal
      opened={leaderboardOpen}
      onClose={() => setLeaderboardOpen(false)}
      title="Leaderboard"
    >
      {leaderboard.length === 0 ? (
        <Text>No scores yet.</Text>
      ) : (
        leaderboard.map((entry, i) => (
          <Text key={i}>{i + 1}. {entry.name}: {entry.score}</Text>
        ))
      )}
      <Button onClick={() => window.location.reload()} mt="20">Try Again!</Button>
    </Modal>

    <Modal
      opened={gameFailed}
      title={
        <Text fw="bold" size="lg" style={{ width: '100%', textAlign: 'center' }}>
          You Failed!
        </Text>
      }
      withCloseButton={false}
      >
      <Image src={failureImages[gameFailed]} alt="Game failed" />
      <Text ta="center">
        You lasted {Math.floor(gameTurn/24)} days and {gameTurn % 24} hours.
      </Text>

      {!isSaving && !hasSaved && (
        <Center>
        <Button onClick={() => setIsSaving(true)} mt="md" color="blue">
          Save Your Score
        </Button>
        </Center>
      )}

      {isSaving && !hasSaved && (
        <Center>
          <TextInput
            label="Enter your name"
            placeholder="e.g. coolgamer42"
            value={nameInput}
            onChange={(e) => setNameInput(e.currentTarget.value)}
            mt="md"
          />
          <Button
            onClick={() => {
              if (nameInput.trim() === "") return;
              const sanitized = escapeHtml(nameInput.trim());
              const scores = JSON.parse(localStorage.getItem("leaderboard") || "[]");

              scores.push({
                name: sanitized,
                score: pendingScore,
                time: new Date().toISOString(),
              });

              scores.sort((a, b) => b.score - a.score);
              const top10 = scores.slice(0, 10);

              localStorage.setItem("leaderboard", JSON.stringify(top10));
              setHasSaved(true);
              setIsSaving(false);
            }}
            mt="sm"
            color="green"
          >
          Confirm Save
          </Button>
        </Center>
      )}

      {hasSaved && (
        <Text mt="md" color="green">
          🎉 Score saved as <strong>{nameInput}</strong>!
        </Text>
      )}
      <Center mt="sm">
        <Button onClick={() => window.location.reload()}>Try Again!</Button>
        <Button
          ml="sm"
          variant="light"
          onClick={() => {
            setGameFailed(false);
            const scores = JSON.parse(localStorage.getItem('leaderboard') || '[]');
            setLeaderboard(scores);
            setLeaderboardOpen(true); // then open leaderboard
          }}
        >
          View Leaderboard
        </Button>
      </Center>
  </Modal>

    <Grid.Col span={12} align="right" mt="xl">
      <Center>
        <Title order={1}>Optimise!</Title>
      </Center>
    </Grid.Col>
    
    <Grid.Col span={12} ta="center">
      <Center>
        <Text>Hello desk monkey. You have one job. Keep the system in the safe zone. Good luck.</Text>
      </Center>
    </Grid.Col>

    <Grid.Col span={2} align="right">
      <Text align="right" hidden>Current temperature:</Text>
    </Grid.Col>
    <Grid.Col span={8} m="0" p="0" align="center">
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
      <Grid.Col span={2}>
        <Text align="left" hidden>Inside: {indoorTemp}ºC, outside: {outdoorTemp}ºC</Text>
      </Grid.Col>

      <Grid.Col span={12}>
      <Center>
        <Text fw="bold" m="1em">Keep it comfy!</Text>
      </Center>
      </Grid.Col>

      <Grid.Col span={3}>
      </Grid.Col>
      <Grid.Col span={6}>
        <Center>
        <Box ref={ref} w="100%" maw={300}>
        <AngleSlider
          aria-label="Angle slider"
          //formatLabel={(value) => `${value}`}
          //remove label (see below) until we figure out how to actually display label not value
          withLabel={false}
          size={angleSize}
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
        </Box>
        </Center>
        </Grid.Col>
      <Grid.Col span={3}>
      </Grid.Col>

        <Grid.Col span={12} >
          <Center>
            <Title order={2} ta="center">{sassyMessage}</Title>
          </Center>
        </Grid.Col>

        <Grid.Col span="auto" hidden={isMobile ? true : false}>
          <Center>
          <Group className="app-footer">
            <Text w="12em">Day: {Math.floor(gameTurn/24)}, time: {gameTurn % 24}:00</Text>
            <Button variant="filled" color="green" size="md" radius="md" onClick={decreaseGameStepSize}>(slower)</Button>
            <Popover width={200} position="bottom" withArrow shadow="md" opened={gamePaused && !gameFailed && !isMobile && !leaderboardOpen}>
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

        <Grid.Col span="auto" hidden={isMobile ? false : true}>
          <Center>
          <Group className="app-footer">
            <Stack>
              <Center>
            <Button variant="filled" color="green" size="md" radius="md" onClick={decreaseGameStepSize}>(slower)</Button>
            <Popover width={200} position="bottom" withArrow shadow="md" opened={gamePaused && !gameFailed && isMobile && !leaderboardOpen} mr="10" ml="10">
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
            </Center>
            <Center>
            <Text w="12em" pl="20">Day: {Math.floor(gameTurn/24)}, time: {gameTurn % 24}:00</Text>
            <Text w="12em" ta="right" pr="20">Speed: {(1/delay)*1000}x</Text>
            </Center>
            </Stack>
          </Group>
          </Center>
        </Grid.Col>

      </Grid>
    </MantineProvider>
  )

}
