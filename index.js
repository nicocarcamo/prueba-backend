const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

// definimos la ruta que maneja las solicitudes
app.get('/itineraries', (req, res) => {
    const origin = req.query.origin;
    const destination = req.query.destination;
    const eta = req.query.eta;
    const transitTime = req.query.transitTime;

    // usamos el módulo fs para leer el archivo json
    fs.readFile('./testDataset.json', (err, data) => {

        // error catch
        if (err) {
            console.log(err);
            res.status(500).send('Error interno del servidor');
        } else {
            // parsear json
            const jsonData = JSON.parse(data);
            // filtramos según parámetro de consulta
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
            // enviamos respuesta en el formato solicitado
            res.send(itineraries);
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
