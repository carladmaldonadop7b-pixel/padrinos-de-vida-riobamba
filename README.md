# Padrinos de Vida Riobamba

La landing está lista en `index.html` y el formulario de la segunda pantalla está en `registro.html`.

## Navegación incluida

- **Inicio** vuelve a la portada `Padrinos de Vida`.
- **Registro** abre `registro.html`, la segunda pantalla del diseño.
- **Historias** se desliza a **Algunos animalitos buscan padrino**.
- **Sobre nosotros** se desliza a **Acerca de nosotros**.
- El botón **Registro aquí** y cada tarjeta de animal llevan a la página de registro. Al llegar desde una tarjeta, el formulario muestra qué animal se quiere apadrinar.

## Imágenes

Las imágenes extraídas del PDF están dentro de `img/` y mantienen los nombres solicitados: `logo1.png`, `cielo.png`, `adorno1.png` a `adorno4.png`, `padrino1.png` a `padrino3.png` y `perro1.png` a `perro7.png`.

## Conectar el registro con tu Excel de SharePoint

Un sitio HTML público no debe escribir directamente en un Excel de SharePoint: requeriría credenciales de Microsoft y quedarán expuestas. La forma segura y sencilla es usar **Power Automate** como intermediario.

1. En el Excel de SharePoint, crea una tabla llamada `Registros` con estas columnas: `Nombre`, `Edad`, `Cedula`, `Correo`, `Telefono`, `AnimalInteres`, `FechaRegistro`.
2. En Power Automate, crea un flujo con el disparador **Cuando se recibe una solicitud HTTP**.
3. Agrega la acción **Excel Online (Business) → Agregar una fila a una tabla**, selecciona tu archivo compartido y la tabla `Registros`.
4. Asigna los valores recibidos: `nombre`, `edad`, `cedula`, `correo`, `telefono`, `animal`, `fechaRegistro`.
5. Añade una respuesta HTTP con estado `200` y copia la URL del disparador.
6. Abre `config.js` y pega esa URL entre las comillas de `registrationEndpoint`.

El formulario enviará este formato al flujo:

```json
{
  "nombre": "Carla Maldonado",
  "edad": "22",
  "cedula": "0600000000",
  "correo": "carla@ejemplo.com",
  "telefono": "0990000000",
  "animal": "Toby",
  "fechaRegistro": "2026-07-12T00:00:00.000Z"
}
```

## Nombre y logo al publicarlo

El título, la descripción y el favicon ya están configurados como **Padrinos de Vida Riobamba** y usan `img/logo1.png`. Para que aparezca en Google hace falta publicar esta carpeta en un dominio público y solicitar la indexación desde Google Search Console. Google decide finalmente cuándo muestra el resultado y el icono.
