const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cors = require('cors');

const app = express();
const port = 4000;

const localidades_dana = [
    "Alaquàs",
    "Albal",
    "Aldaia",
    "Alfafar",
    "Algemesí",
    "Benetússer",
    "Beniparrell",
    "Catarroja",
    "Chiva",
    "Llocnou de la Corona",
    "Massanassa",
    "Paiporta",
    "Picanya",
    "Sedaví",
    "Utiel",
    "La Torre",
    "Alcúdia",
    "Alginet",
    "Buñol",
    "Catadau",
    "Cheste",
    "Godelleta",
    "Guadassuar",
    "Loriguilla",
    "Mislata",
    "Pedralba",
    "Quart de Poblet",
    "Rafelguaraf",
    "Requena",
    "Riba-roja de Túria",
    "Torrent",
    "Vilamarxant",
    "Xirivella",
    "Forn d'Alcedo",
    "Alberic",
    "Alborache",
    "Alfarb",
    "Benifaió",
    "Camporrobles",
    "Carcaixent",
    "Carlet",
    "Castelló",
    "Cullera",
    "Llombai",
    "Macastre",
    "Picassent",
    "Pobla Llarga",
    "Tous",
    "Turís",
    "Yàtova",
    "Alcàsser",
    "Alzira",
    "Benimodo",
    "Benimuslem",
    "Bugarra",
    "Caudete de las Fuentes",
    "Dos Aguas",
    "Fortaleny",
    "Fuenterrobles",
    "Gavarda",
    "Manises",
    "Manuel",
    "Massalavés",
    "Montroi",
    "Montserrat",
    "Real",
    "Siete Aguas",
    "Silla",
    "Sollana",
    "Sot de Chera",
    "Sueca",
    "Castellar-Oliveral"
];

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json('Proyecto https://www.torneacasa.es');
});

app.post('/CheckValid', (req, res) => {
    const streetName = req.body.streetName;

    const removeAccents = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    const streetNameWithoutAccents = removeAccents(streetName);

    const isAffected = localidades_dana.some(localidad => {
        const localidadWithoutAccents = removeAccents(localidad);
        return streetNameWithoutAccents.includes(localidadWithoutAccents);
    });

    if (typeof streetName === 'string' && streetName.trim() !== '') {
         const url = `https://nominatim.openstreetmap.org/search?street=${encodeURIComponent(streetName)}&format=json`;
        var latitude, longitude;
         fetch(url)
             .then(response => response.json())
             .then(data => {
                 if (data.length > 0) {
                    const { lat, lon } = data[0];
                     latitude = lat;
                     longitude = lon;
                     console.log(`Affected: ${isAffected}, Latitud: ${lat}, Longitud: ${lon}`);
                     res.status(200).json({ isAffected, latitude, longitude });
                 } else {
                     console.log('No se encontraron resultados para la calle proporcionada.');
                     res.status(400).send('No se encontraron resultados para la calle proporcionada.');
                 }
             })
             .catch(error => {
                 console.error('Error al obtener la geocodificación:', error);
                 res.status(400).send('Error al obtener la geocodificación');
             });
     } else {
        res.status(400).send('Nombre de calle no válido');
     }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;