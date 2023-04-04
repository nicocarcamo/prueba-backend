// const express = require('express');
// const data = require('./testDataset.json');
// const app = express();

// app.get('/itinerarios', (req, res) => {
//   const itinerarios = data.results.map(it => ({
//     Origen: it.pol.name,
//     Destino: it.pod.name,
//     Naviera: it.carrier.short_name,
//     ETD: it.etd,
//     ETA: it.eta
//   }));
//   res.json(itinerarios);
// });

// app.listen(3000, () => {
//   console.log('Servidor iniciado en el puerto 3000');
// });


const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

app.get('/itineraries', (req, res) => {
  const origin = req.query.origin;
  const destination = req.query.destination;
  const eta = req.query.eta;
  const transitTime = req.query.transitTime;

  fs.readFile('./testDataset.json', (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error interno del servidor');
    } else {
      const jsonData = JSON.parse(data);
      const itineraries = jsonData.results.filter(result => {
        if (
          (origin === undefined || result.pol.name.toLowerCase() === origin.toLowerCase()) &&
          (destination === undefined || result.pod.name.toLowerCase() === destination.toLowerCase()) &&
          (eta === undefined || result.eta.includes(eta)) &&
          (transitTime === undefined || result.transit_time.toString() === transitTime)
        ) {
          return true;
        }
        return false;
      }).map(result => {
        return {
          Origen: result.pol.name,
          Destino: result.pod.name,
          Naviera: result.carrier.short_name,
          ETD: result.etd,
          ETA: result.eta
        }
      });
      res.send(itineraries);
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
