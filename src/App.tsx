import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Data } from './calculations';

const defaultData: Data = {
  expN: 1000,
  logN: 1000,
  time: 0,
  K: 10000,
  r: 0.2
};

function App() {

  const [data, setData] = useState<Data[]>([defaultData]);
  const [N, setN] = useState<number>(defaultData.logN);
  const [r, setR] = useState<number>(defaultData.r);
  const [K, setK] = useState(defaultData.K);
  const [started, setStarted] = useState(false);
  const [intervalId, setIntervalId] = useState<number>();

  const onStartButtonClick = () => {
    if (!started) {
      const id = setInterval(() => {
        setData(d => {
          const lastData = d[d.length - 1];
          const expN = Math.round(N * Math.exp(r * (lastData.time + 1)));
          const logN = Math.round((N * K * Math.exp(r * (lastData.time + 1))) / (K - N + N * Math.exp(r * (lastData.time + 1))));

          return [
            ...d,
            {
              time: lastData.time + 1,
              expN,
              logN,
              r,
              K
            }
          ];
        });
      }, 1000);
      setStarted(true);
      setIntervalId(id);
    } else {
      setStarted(false);
      clearInterval(intervalId);
      setIntervalId(-1);
      setData([{
        time: 0,
        logN: N,
        expN: N,
        r,
        K
      }])
    }
  };

  return (
    <Box sx={{
      width: "100%",
      display: "flex",
      flexDirection: "column",
    }}>
      <Box sx={{
        mt: 2,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <TextField
          disabled={started}
          size="small"
          sx={{ m: 1 }}
          label="Начальная численность"
          inputProps={{ inputMode: "numeric" }}
          value={N}
          onChange={(e) => {
            const n = Number(e.target.value);
            setN(n);
            setData([{
              time: 0,
              expN: n,
              logN: n,
              K,
              r
            }]);
          }}
        />
        <TextField
          disabled={started}
          size="small"
          sx={{ m: 1 }}
          label="Биотический потенциал"
          inputProps={{ inputMode: "numeric" }}
          value={r}
          onChange={(e) => {
            const newR = Number(e.target.value);
            setR(newR);
            setData([{
              time: 0,
              expN: N,
              logN: N,
              K,
              r: newR
            }]);
          }}
        />
        <TextField
          disabled={started}
          size="small"
          sx={{ m: 1 }}
          label="Ёмкость среды"
          inputProps={{ inputMode: "numeric" }}
          value={K}
          onChange={(e) => {
            const k = Number(e.target.value);
            setK(k);
            setData([{
              time: 0,
              expN: N,
              logN: N,
              K: k,
              r
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
      </Box>
      {data.length > 0 &&
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row"
            }}
          >
            <Box sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1
            }}>
              <Typography variant="h4" margin={2} textAlign="center">Экспоненциальная модель</Typography>
              <ResponsiveContainer width="100%" height={600}>
                <LineChart
                    data={data}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="expN" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
            <Box sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1
            }}>
              <Typography variant="h4" margin={2} textAlign="center">Логистическая модель</Typography>
              <ResponsiveContainer width="100%" height={600}>
                <LineChart
                    data={data}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="logN" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Box>
      }
    </Box>
  )
}

export default App
