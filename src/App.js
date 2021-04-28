import React, { useState, useEffect } from 'react'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import LocalGasStationIcon from '@material-ui/icons/LocalGasStation'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'

import { makeStyles } from '@material-ui/core/styles'
import { find_nearest_gas, get_current_position, update_destination } from './api/api'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
  },
  paper: {
    width: 800,
  },
  gasIcon: {
    fontSize: 50,
  },
  dialog: {
    maxHeight: 390,
  },
  content: {
    display: 'flex',
    padding: 0,
    overflow: 'hidden',
  },
  list: {
    padding: 0,
  },
  item: {
    paddingLeft: 30,
    paddingRight: 15,
    paddingBottom: 5,
  },
  selectedItem: {
    paddingLeft: 30,
    paddingRight: 15,
    paddingBottom: 5,
    backgroundColor: 'lightgrey',
  },
  name: {
    fontSize: 23,
    paddingBottom: 20,
  },
  desc: {
    fontSize: 20,
  },
  title: {
    borderBottom: '1px solid lightgrey',
    textAlign: 'center',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    margin: 10,
  },
  titleRoot: {
    fontSize: 25,
  },
  section1: {
    width: '35%',
  },
  actions: {
    padding: 0,
  },
  container2: {
    width: '65%',
  },
  content2: {
    height: '68%',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  contentRoot: {
    padding: 0,
  },
}))

function sort(stations, latitude, longitude) {
  const lat = latitude
  const lng = longitude

  const d = []

  stations.forEach((station) => {
    let name = station.name
    let address = station.address
    let price = station.price
    let latitude = station.latitude
    let longitude = station.longitude

    let distance = Math.sqrt(
      Math.pow(Math.abs(latitude * 69 - lat * 69), 2) +
        Math.pow(Math.abs(longitude * 69 - lng * 69), 2)
    )

    d.push({
      name,
      address,
      price,
      latitude,
      longitude,
      distance,
    })
  })

  return d.sort((a, b) => (a.distance > b.distance ? 1 : -1))
}

export default function App() {
  const classes = useStyles()
  const [open, set_open] = useState(false)
  const [longitude, set_longitude] = useState(0.0)
  const [latitude, set_latitude] = useState(0.0)
  const [stations, set_stations] = useState([])
  const [selected, set_selected] = useState(0)
  const [distances, set_distances] = useState([])

  useEffect(() => {
    get_current_position().then((location) => {
      set_latitude(location.latitude)
      set_longitude(location.longitude)
    })
  }, [])

  const handleClick = () => {
    find_nearest_gas(latitude, longitude).then((gas) => {
      set_stations(gas)
      set_distances(sort(gas, latitude, longitude))
    })

    set_open(true)
  }

  return (
    <>
      <div className={classes.root}>
        <IconButton onClick={handleClick}>
          <LocalGasStationIcon className={classes.gasIcon} color='secondary' />
        </IconButton>
      </div>
      <Dialog
        classes={{
          paper: classes.paper,
        }}
        className={classes.dialog}
        onClose={() => set_open(false)}
        open={open}
      >
        <DialogTitle
          className={classes.title}
          classes={{
            root: classes.titleRoot,
          }}
        >
          Find Gas Near Me
        </DialogTitle>
        <div className={classes.content}>
          <DialogContent
            className={classes.section1}
            classes={{
              root: classes.contentRoot,
            }}
          >
            <List className={classes.list}>
              {distances.map((s, i) => (
                <ListItem
                  className={selected === i ? classes.selectedItem : classes.item}
                  button
                  key={i}
                  onClick={() => set_selected(i)}
                >
                  <ListItemText
                    primary={s.name}
                    secondary={
                      <ul>
                        {s.price !== null && <li>{s.price}</li>}
                        <li>{s.distance.toFixed(2)} mi</li>
                      </ul>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <div className={classes.container2}>
            <DialogContent className={classes.content2}>
              <div className={classes.container}>
                {distances.length !== 0 ? (
                  <>
                    <Typography className={classes.name}>
                      <strong>{distances[selected].name}</strong>
                    </Typography>
                    <Typography className={classes.desc}>{distances[selected].address}</Typography>
                    {distances[selected].price !== null && (
                      <Typography className={classes.desc}>{distances[selected].price}</Typography>
                    )}
                    <Typography className={classes.desc}>
                      {distances[selected].distance.toFixed(2)} mi
                    </Typography>
                  </>
                ) : (
                  <Typography>No station selected</Typography>
                )}
              </div>
            </DialogContent>
            <DialogActions className={classes.actions}>
              <Button
                className={classes.button}
                variant='outlined'
                color='secondary'
                onClick={() => set_open(false)}
              >
                CLOSE
              </Button>
              <Button
                className={classes.button}
                variant='outlined'
                color='secondary'
                onClick={() =>
                  update_destination(distances[selected].latitude, distances[selected].longitude)
                }
              >
                GO
              </Button>
            </DialogActions>
          </div>
        </div>
      </Dialog>
    </>
  )
}
