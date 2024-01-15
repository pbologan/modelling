import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { FC, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface Data {
  time: number;
  expN: number;
  logN: number;
  r: number;
  K: number;
}

export const PopulationPage: FC = () => {
  const [data, setData] = useState<Data[]>([{
    expN: 1000,
    logN: 1000,
    time: 0,
    K: 10000,
    r: 0.2
  }]);
  const [N, setN] = useState<number>(1000);
  const [r, setR] = useState<number>(0.2);
  const [K, setK] = useState(10000);
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
      }, 500);
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
          type="number"
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
          type="number"
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
          type="number"
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
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1
            }}>
              <Typography variant="h5" margin={1} textAlign="center">Экспоненциальная модель</Typography>
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
                  <Line type="monotone" dataKey="expN" name="Численность популяции" />
                </LineChart>
              </ResponsiveContainer>
              <Table sx={{ maxWidth: 400 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: "1.1rem", fontWeight: 600 }}>Месяц</TableCell>
                    <TableCell sx={{ fontSize: "1.1rem", fontWeight: 600 }}>Численность</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontSize: "1.1rem" }}>{data[data.length - 1].time}</TableCell>
                    <TableCell sx={{ fontSize: "1.1rem" }}>{data[data.length - 1].expN}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
            <Box sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1
            }}>
              <Typography variant="h5" margin={1} textAlign="center">Логистическая модель</Typography>
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
                  <Line type="monotone" dataKey="logN" name="Численность популяции" />
                </LineChart>
              </ResponsiveContainer>
              <Table sx={{ maxWidth: 400 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: "1.1rem", fontWeight: 600 }}>Месяц</TableCell>
                    <TableCell sx={{ fontSize: "1.1rem", fontWeight: 600 }}>Численность</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontSize: "1.1rem" }}>{data[data.length - 1].time}</TableCell>
                    <TableCell sx={{ fontSize: "1.1rem" }}>{data[data.length - 1].logN}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Box>
      }
    </Box>
  )
};
