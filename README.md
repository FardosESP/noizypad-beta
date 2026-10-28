# NoizyPad beta: control de copias

Cada exe de prueba lleva un **código de entrega** (lo dice `build-beta.sh` al compilar y va en el
nombre del exe). Las copias descargan `lease.json` de aquí al abrir y cada 10 minutos: va firmado,
así que nadie puede falsificarlo, y caduca a las 48 horas. Una Action lo vuelve a firmar cada 12 horas.

**Un exe funciona mientras su código esté en `builds`. Si no tocas nada, funciona sin límite.**

## Activar o quitar una entrega

Edita `control.json` (desde la web de GitHub vale) y haz commit:

```json
{
  "block_all": false,
  "builds": {
    "k3x9q2m7ta": "0.11.0, entregada el 28/10 a los testers del Discord",
    "p8w2n5r1zc": "0.11.1, entregada el 02/11"
  }
}
```

- Añadir un código: ese exe abre (GitHub tarda hasta 5 minutos en servir el cambio).
- Quitar un código: ese exe muestra "Esta versión de prueba ha caducado" en unos 15 minutos como mucho
  (si estaba abierto, se cierra restaurando el audio antes).
- `block_all: true`: se bloquean todas las copias beta.

La nota de cada código es solo para ti: no la ve nadie en la app.

Una copia sin internet sigue abriendo hasta que caduque su última lease (48 h como mucho), y
después se bloquea hasta que se conecte.

No toques `lease.json` a mano: lo escribe la Action.
