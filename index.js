const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

// filtramos según parámetro de consulta
const filterItineraries = (origin, destination, eta, transitTime) => {
  return result => (
    (origin === undefined || result.pol.name.toLowerCase() === origin.toLowerCase()) &&
    (destination === undefined || result.pod.name.toLowerCase() === destination.toLowerCase()) &&
    (eta === undefined || result.eta.includes(eta)) &&
    (transitTime === undefined || result.transit_time.toString() === transitTime)
  );
};

// definimos la ruta que maneja las solicitudes
app.get('/itineraries', (req, res) => {
  const origin = req.query.origin;
  const destination = req.query.destination;
  const eta = req.query.eta;
  const transitTime = req.query.transitTime;

  fs.readFile('./testDataset.json', (err, data) => {
    //error catch
    if (err) {
      console.log(err);
      res.status(500).send('Error interno del servidor');
    } else {
      // else parsear json  
      const jsonData = JSON.parse(data);
      const itineraries = jsonData.results.filter(filterItineraries(origin, destination, eta, transitTime)).map(result => {
        return {
          Origen: result.pol.name,
          Destino: result.pod.name,
          Naviera: result.carrier.short_name,
          ETD: result.etd,
          ETA: result.eta
        }
      });
      // enviamos respuesta en el formato solicitado
      res.send(itineraries);
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
