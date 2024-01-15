import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface DistData {
  distance: number;
  cp_dist: number;
  do2_dist: number;
}

interface DayData {
  day: number;
  cp_day: number;
  do2_day: number;
}

export const PollutionPage: FC = () => {
  const [intervalId, setIntervalId] = useState<number>(-1);
  const [started, setStarted] = useState(false);
  const [cp0, setCp0] = useState(100);
  const [d0, setD0] = useState(20);
  const [k1, setK1] = useState(0.25);
  const [k2, setK2] = useState(0.4);
  const [vRiver, setVRiver ] = useState(1);
  const [showResetButton, setShowResetButton] = useState(false);

  const [distData, setDistData] = useState<DistData[]>([{
    distance: 0,
    cp_dist: 100,
    do2_dist: 20
  }]);
  const [dayData, setDayData] = useState<DayData[]>([{
    day: 0,
    cp_day: 100,
    do2_day: 20
  }]);

  useEffect(() => {
    const { cp_dist} = distData[distData.length - 1];
    const { cp_day} = dayData[dayData.length - 1];
    if (cp_day === 0 && cp_dist === 0 && intervalId !== -1) {
      clearInterval(intervalId);
      setIntervalId(-1);
      setShowResetButton(true);
      setStarted(false);
    }
  }, [intervalId, distData, dayData]);

  const onStartButtonClick = () => {
    if (!started) {
      const id = setInterval(() => {
        setDistData(d => {
          let result = [...d];
          const lastData = d[d.length - 1];
          if (lastData.cp_dist !== 0) {
            const nextDistance = lastData.distance + 1;
            const distERatio = nextDistance / (vRiver / 1000 * 3600);
            const cp_dist = Math.round(cp0 * Math.exp(-k1 * distERatio));
            const do2_dist = Math.round((k1 * cp0) / (k2 - k1) * (Math.exp(-k1 * distERatio) - Math.exp(-k2 * distERatio)) + d0 * Math.exp(-k2 * distERatio));
            result = [
              ...d,
              {
                distance: nextDistance,
                cp_dist,
                do2_dist
              }
            ];
          }

          return result;
        });

        setDayData(d => {
          let result = [...d];
          const lastData = d[d.length - 1];
          if (lastData.cp_day !== 0) {
            const nextDay = lastData.day + 1;
            const cp_day = Math.round(cp0 * Math.exp(-k1 * nextDay));
            const do2_day = Math.round((k1 * cp0) / (k2 - k1) * (Math.exp(-k1 * nextDay) - Math.exp(-k2 * nextDay)) + d0 * Math.exp(-k2 * nextDay));
            result = [
              ...d,
              {
                day: nextDay,
                cp_day,
                do2_day,
              }
            ];
          }
          return result;
        });
      }, 500);
      setStarted(true);
      setIntervalId(id);
    } else {
      setStarted(false);
      clearInterval(intervalId);
      setIntervalId(-1);
      setDistData([{
        distance: 0,
        do2_dist: d0,
        cp_dist: cp0
      }]);
      setDayData([{
        day: 0,
        do2_day: d0,
        cp_day: cp0,
      }]);
    }
  };

  const onResetButtonClick = () => {
    setDistData([{
      distance: 0,
      do2_dist: d0,
      cp_dist: cp0
    }]);
    setDayData([{
      day: 0,
      do2_day: d0,
      cp_day: cp0,
    }]);
    setShowResetButton(false);
  };

  return (
    <Box sx={{
      width: "100%",
      display: "flex",
      flexDirection: "column",
    }}>
      <Box sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <TextField
          disabled={started}
          size="small"
          sx={{ m: 1 }}
          label="Нач. конц-я отходов [мг/л]"
          type="number"
          value={cp0}
          onChange={(e) => {
            const c = Number(e.target.value);
            setCp0(c);
            setDistData([{
              distance: 0,
              cp_dist: c,
              do2_dist: d0
            }]);
            setDayData([{
              day: 0,
              cp_day: c,
              do2_day: d0,
            }]);
          }}
        />
        <TextField
          disabled={started}
          size="small"
          sx={{ m: 1 }}
          label="Нач. дефицит кислорода [мг/л]"
          type="number"
          value={d0}
          onChange={(e) => {
            const newD = Number(e.target.value);
            setD0(newD);
            setDistData([{
              distance: 0,
              cp_dist: cp0,
              do2_dist: newD
            }]);
            setDayData([{
              day: 0,
              cp_day: cp0,
              do2_day: newD,
            }]);
          }}
        />
        <TextField
          disabled={started}
          size="small"
          sx={{ m: 1 }}
          label="К-т потребл кислорода [1/день]"
          type="number"
          value={k1}
          onChange={(e) => {
            const k = Number(e.target.value);
            setK1(k);
            setDistData([{
              distance: 0,
              cp_dist: cp0,
              do2_dist: d0
            }]);
            setDayData([{
              day: 0,
              cp_day: cp0,
              do2_day: d0,
            }]);
          }}
        />
        <TextField
          disabled={started}
          size="small"
          sx={{ m: 1 }}
          label="К-т реаэрации [1/день]"
          type="number"
          value={k2}
          onChange={(e) => {
            const k = Number(e.target.value);
            setK2(k);
            setDistData([{
              distance: 0,
              cp_dist: cp0,
              do2_dist: d0
            }]);
            setDayData([{
              day: 0,
              cp_day: cp0,
              do2_day: d0,
            }]);
          }}
        />
        <TextField
          disabled={started}
          size="small"
          sx={{ m: 1 }}
          label="Скорость реки [м/сек]"
          type="number"
          value={vRiver}
          onChange={(e) => {
            const v = Number(e.target.value);
            setVRiver(v);
            setDistData([{
              distance: 0,
              cp_dist: cp0,
              do2_dist: d0
            }]);
            setDayData([{
              day: 0,
              cp_day: cp0,
              do2_day: d0,
            }]);
          }}
        />
        <Button
          sx={{ m: 1 }}
          variant="contained"
          color={started ? "error" : "primary"}
          onClick={onStartButtonClick}
        >
          {started ? "Stop" : "Start"}
        </Button>
        {showResetButton && <Button
          sx={{ m: 1 }}
          variant="outlined"
          color="error"
          onClick={onResetButtonClick}
        >
          Reset
        </Button>}
      </Box>
      <Typography variant="h5" textAlign="center">Зависимость концентрации отходов и дефицита кислорода</Typography>
          <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row"
              }}
          >
          {dayData.length > 0 &&
            <Box sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1
            }}>
              <Typography variant="h5" marginBottom={1} textAlign="center">От времени (мес)</Typography>
              <ResponsiveContainer width="100%" height={570}>
                <LineChart data={dayData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line stroke="#82ca9d" type="monotone" dataKey="cp_day"  name="Концентрация отходов"  />
                  <Line type="monotone" dataKey="do2_day"  name="Дефицит кислорода"  />
                </LineChart>
              </ResponsiveContainer>
              <Table sx={{ maxWidth: 520 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: "1.1rem", fontWeight: 600 }}>День</TableCell>
                    <TableCell sx={{ fontSize: "1.1rem", fontWeight: 600 }}>Концентрация отходов мг/л</TableCell>
                    <TableCell sx={{ fontSize: "1.1rem", fontWeight: 600 }}>Дефицит кислорода мг/л</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontSize: "1.1rem" }}>{dayData[dayData.length - 1].day}</TableCell>
                    <TableCell sx={{ fontSize: "1.1rem" }}>{dayData[dayData.length - 1].cp_day}</TableCell>
                    <TableCell sx={{ fontSize: "1.1rem" }}>{dayData[dayData.length - 1].do2_day}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>}
            {distData.length > 0 &&
              <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                flexGrow: 1
              }}>
                <Typography variant="h5" marginBottom={1} textAlign="center">От расстояния (км)</Typography>
                <ResponsiveContainer width="100%" height={570}>
                  <LineChart data={distData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="distance" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line stroke="#82ca9d" type="monotone" dataKey="cp_dist" name="Концентрация отходов" />
                    <Line type="monotone" dataKey="do2_dist" name="Дефицит кислорода" />
                  </LineChart>
                </ResponsiveContainer>
                <Table sx={{ maxWidth: 520 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize: "1.1rem", fontWeight: 600 }}>Расстояние</TableCell>
                      <TableCell sx={{ fontSize: "1.1rem", fontWeight: 600 }}>Концентрация отходов мг/л</TableCell>
                      <TableCell sx={{ fontSize: "1.1rem", fontWeight: 600 }}>Дефицит кислорода мг/л</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ fontSize: "1.1rem" }}>{distData[distData.length - 1].distance}</TableCell>
                      <TableCell sx={{ fontSize: "1.1rem" }}>{distData[distData.length - 1].cp_dist}</TableCell>
                      <TableCell sx={{ fontSize: "1.1rem" }}>{distData[distData.length - 1].do2_dist}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>}
          </Box>
    </Box>
  );
}
