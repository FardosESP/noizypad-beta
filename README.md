# NoizyPad beta: control de copias

Las copias beta de NoizyPad descargan `lease.json` de aquí cada 10 minutos. Va firmado, así que
nadie puede falsificarlo, y caduca a las 48 horas. Una Action lo vuelve a firmar cada 12 horas.

**Si no tocas nada, las copias beta funcionan sin límite.**

## Bloquear

Edita `control.json` (desde la web de GitHub vale) y haz commit. En un minuto se firma la nueva
lease y en 10 minutos como mucho las copias afectadas se cierran (restauran el audio antes).

| Campo | Qué hace |
|---|---|
| `blocked_versions` | Versiones bloqueadas, p. ej. `["0.11.0"]` |
| `min_version` | Bloquea todo lo anterior, p. ej. `"0.11.1"` |
| `block_all` | `true` bloquea todas las copias beta |

Para desbloquear, deshaz el cambio: las copias vuelven a abrir en cuanto descargan la nueva lease.

Una copia sin internet sigue abriendo hasta que caduque su última lease (48 h como mucho), y
después se bloquea hasta que se conecte.

No toques `lease.json` a mano: lo escribe la Action.
