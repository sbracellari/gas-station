import gas from './gas-stations.json'

export const get_current_position = async () => {
  // if i were using the APIs, this function would look something like

  // try {
  //   var lat
  //   var lng
  //   gm.info.getCurrentPosition(processPosition, true)

  //   function processPosition(position){
  //     lat = position.coords.latitude
  //     lng = position.coords.longitude
  //   }

  //   return await ({lat, lng})
  // } catch(err) {
  //   console.error(err)
  //   return err
  // }

  return await {
    latitude: 42.82810059948759,
    longitude: -83.43478272453847,
  }
}

export const find_nearest_gas = async (latitude, longitude) => {
  return await gas
}

export const update_destination = async (latitude, longitude) => {
  // if i were using the APIs, this function would look something like

  // try {
  // var success
  // gm.nav.getDestination(success, true)

  // function success(latitude, longitude) {
  //   console.log({latitude, longitude})
  //   success = true
  // }

  //   return await success
  // } catch(err) {
  //   console.error(err)
  //   return err
  // }

  return true
}
