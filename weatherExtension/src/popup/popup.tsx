import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { Box, Grid, InputBase, IconButton, Paper } from '@material-ui/core'
import {
  Add as AddIcon,
  PictureInPicture as PictureInPictureIcon,
} from '@material-ui/icons'
import './popup.css'
import 'fontsource-roboto'
import WeatherCard from '../components/WeatherCard'
import {
  setStoredCities,
  getStoredCities,
  setStoredOptions,
  getStoredOptions,
  LocalStorageOptions,
} from '../utils/storage'
import { Messages } from '../utils/messages'

const App: React.FC<{}> = () => {
  const [city, setCity] = useState<string[]>([])
  const [cityInput, setCityInput] = useState<string>('')
  const [options, setOptions] = useState<LocalStorageOptions | null>(null)

  useEffect(() => {
    getStoredCities().then((cities) => setCity(cities))
    getStoredOptions().then((options) => setOptions(options)) //runs parallel
  }, [])

  //console.log(cityInput)

  const handleCityButtonClick = () => {
    if (cityInput === '') {
      return
    }

    const newCity = [...city, cityInput]

    setStoredCities(newCity).then(() => {
      setCity(newCity)
      setCityInput('')
    })
  }

  const handleCityDeleteButtonClick = (index: number) => {
    city.splice(index, 1)

    const newCity = [...city]

    setStoredCities(newCity).then(() => {
      setCity(newCity)
    })
  }

  const handleTempScaleButtonClick = () => {
    const newOptions: LocalStorageOptions = {
      ...options,
      tempScale: options.tempScale === 'metric' ? 'imperial' : 'metric',
    }

    setStoredOptions(newOptions).then(() => {
      setOptions(newOptions)
    })
  }

  const handleOverlayButtonClick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, Messages.TOGGLE_OVERLAY)
      }
    })
  }

  if (!options) {
    return null
  }

  return (
    <Box mx="8px" my="16px">
      <Grid container justifyContent="space-evenly">
        <Grid item>
          <Paper>
            <Box px="15px" py="5px">
              <InputBase
                placeholder="Add a city name"
                value={cityInput}
                onChange={(event) => setCityInput(event.target.value)}
              />
              <IconButton onClick={handleCityButtonClick}>
                <AddIcon />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
        <Grid item>
          <Paper>
            <Box py="4px">
              <IconButton onClick={handleTempScaleButtonClick}>
                {options.tempScale === 'metric' ? '\u2103' : '\u2109'}
              </IconButton>
            </Box>
          </Paper>
        </Grid>
        <Grid item>
          <Paper>
            <Box py="4px">
              <IconButton onClick={handleOverlayButtonClick}>
                <PictureInPictureIcon />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {options.homeCity != '' && (
        <WeatherCard city={options.homeCity} tempScale={options.tempScale} />
      )}
      {city.map((city, index) => (
        <WeatherCard
          city={city}
          tempScale={options.tempScale} // follow tempScale and other props
          key={index}
          onDelete={() => handleCityDeleteButtonClick(index)}
        />
      ))}
      <Box height="16px" />
    </Box>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App />, root)
