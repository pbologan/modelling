import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { PollutionPage } from './PollutionPage.tsx';
import { PopulationPage } from './PopulationPage.tsx';

enum Page {
  POPULATION,
  POLLUTION
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.POPULATION);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
      }}>
        <Button
          disabled={currentPage === Page.POPULATION}
          onClick={() => setCurrentPage(Page.POPULATION)}
        >
          Популяция
        </Button>
        <Button
          disabled={currentPage === Page.POLLUTION}
          onClick={() => setCurrentPage(Page.POLLUTION)}
        >
          Загрязнение реки
        </Button>
      </Box>
      {currentPage === Page.POPULATION
        ? <PopulationPage />
        : <PollutionPage />
      }
    </Box>
  )

}

export default App
