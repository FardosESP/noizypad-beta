# NoizyPad beta: control de copias

Cada exe de prueba lleva un **código de entrega** secreto. Aquí nunca se publica el código, solo su
**id** (una huella de 32 caracteres de la que no se puede sacar el código). `build-beta.sh` imprime
el id al compilar y apunta el código en `fardospad/beta/entregas.txt`, que no se sube a ningún sitio. Las copias descargan `lease.json` de aquí al abrir y cada 10 minutos: va firmado,
así que nadie puede falsificarlo, y caduca a las 48 horas. Una Action lo vuelve a firmar cada 12 horas.

**Un exe funciona mientras su id esté en `builds`. Si no tocas nada, funciona sin límite.**

## Activar o quitar una entrega

Edita `control.json` (desde la web de GitHub vale) y haz commit:

```json
{
  "block_all": false,
  "builds": {
    "0182a9d6b8d50675debf381870d0f06d": "0.11.0, 28/10",
    "5c1e07b2a94f3d68e0b7a1c2d3f4e5a6": "0.11.1, 02/11"
  }
}
```

- Añadir un id: ese exe abre (unos 2 minutos).
- Quitar un id: ese exe muestra "Esta versión de prueba ha caducado" en unos 12 minutos como mucho
  (si estaba abierto, se cierra restaurando el audio antes).
- `block_all: true`: se bloquean todas las copias beta.

La nota de cada id no sale en la app, pero el repo es público: no pongas nombres de testers ni
códigos. La Action rechaza cualquier cosa que no sea un id.

Una copia sin internet sigue abriendo hasta que caduque su última lease (48 h como mucho), y
después se bloquea hasta que se conecte.

No toques `lease.json` a mano: lo escribe la Action.
