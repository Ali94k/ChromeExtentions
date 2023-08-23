import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Switch,
  TextField,
  Typography,
} from '@material-ui/core'
import 'fontsource-roboto'
import './options.css'
import {
  getStoredOptions,
  LocalStorageOptions,
  setStoredOptions,
} from '../utils/storage'

type FormState = 'ready' | 'saving'

const App: React.FC<{}> = () => {
  const [options, setOptions] = useState<LocalStorageOptions | null>(null)
  const [formState, setFormState] = useState<FormState>('ready')

  useEffect(() => {
    getStoredOptions().then((options) => setOptions(options))
  }, [])

  const handleHomeCityChange = (homeCity: string) => {
    setOptions({
      ...options,
      homeCity,
    })
  }

  const handleToggleOverlayChange = (hasAutoOverlay: boolean) => {
    setOptions({
      ...options,
      hasAutoOverlay,
    })
  }

  const handleSaveButtonClick = () => {
    setFormState('saving')
    setStoredOptions(options).then(() => {
      setTimeout(() => {
        setFormState('ready')
      }, 1000)
    })
  }

  if (!options) {
    return null
  }

  const isFieldDisabled = formState === 'saving'

  return (
    <Box mx="10%" my="2%">
      <Card>
        <CardContent>
          <Grid container direction="column" spacing={4}>
            <Grid item>
              <Typography variant="h4">Options</Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1">home city</Typography>
              <TextField
                fullWidth
                placeholder="Enter a home city"
                value={options.homeCity}
                onChange={(event) => handleHomeCityChange(event.target.value)}
                disabled={isFieldDisabled}
              />
            </Grid>
            <Grid item>
              <Typography variant="body1">toggle overlay</Typography>
              <Switch
                color="primary"
                checked={options.hasAutoOverlay}
                onChange={(event, checked) => handleToggleOverlayChange(checked)}
                disabled={isFieldDisabled}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveButtonClick}
                disabled={isFieldDisabled}
              >
                {formState === 'ready' ? 'Save' : 'Saving...'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App />, root)
