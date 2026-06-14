## Resumen de la refactorización

Cada carpeta `src/0X-*` empezaba con un error a propósito en uno de los principios SOLID, todo dentro de un ejemplo sobre una reserva ecológica. Se pidió además según el titulo de la actividad: pensar también en cómo hacer que el código siga funcionando bien aunque algo falle (a esto se le llama "resiliencia"). A continuación se explica cómo estaba el código "antes" y cómo quedó "después" en cada ejercicio, por qué la solución arregla el problema, y una opinión sobre las decisiones que se tomaron.

### 1. SRP — `src/01-srp`

**Antes:** una sola clase `ProductBloc` hacía tres cosas distintas: cargar productos (`loadProduct`), guardarlos (`saveProduct`) y enviar correos a los clientes (`notifyCustomer`), con el código del correo escrito directamente dentro del Bloc.

**Después:** se separó en tres partes, cada una con un solo trabajo:
- `product-repository.ts` → `ProductRepository`: solo guarda y busca datos (`load`, `save`, `remove`).
- `notification-service.ts` → `NotificationService` (interfaz) y `ConsoleEmailNotifier`: solo se encarga de avisar al cliente.
- `product-service.ts` → `ProductService`: organiza el proceso de registrar un producto (`registerProduct`), usando las otras dos partes que recibe por constructor.

**Por qué arregla el problema de SRP:** cada clase cambia solo por un motivo. Si mañana se cambia el proveedor de correo, solo se toca `notification-service.ts`; si cambia la forma de guardar los datos, solo `product-repository.ts`. `ProductService` no necesita saber cómo funcionan por dentro ninguno de los dos.

**Resiliencia aplicada:** `registerProduct` primero guarda el producto y después avisa al cliente. Si el aviso falla (por ejemplo, un correo inválido), `ProductService` deshace lo que hizo: borra el producto guardado (`repository.remove`) y devuelve un `Result` de error. Es una forma simple de asegurarse de que no quede un producto guardado sin que el cliente sepa de él.

**Comentario:** este "deshacer" pasa todo de forma inmediata y dentro de la memoria del programa, lo que es fácil de entender pero no se parece mucho a un caso real, donde guardar el producto y avisar al cliente podrían pasar en sistemas distintos, y deshacer el guardado también podría fallar. En un sistema real haría falta otra forma de avisar al cliente más adelante (por ejemplo, guardando el aviso pendiente para reintentarlo), en lugar de simplemente borrar lo guardado.

---

### 2. OCP — `src/02-ocp`

**Antes:** `NewsService` y `PhotosService` llamaban directamente a `axios.get(...)`. Si se quería cambiar de librería para hacer peticiones HTTP (por ejemplo a `fetch`), había que modificar el código de los dos servicios.

**Después:**
- `http-client.ts` define una interfaz general `HttpClient` (con el método `get<T>(url)`) y una sola clase que la implementa, `AxiosHttpClient`.
- `news-service.ts` y `photos-service.ts` reciben un `HttpClient` por constructor y no saben nada sobre axios.

**Por qué arregla el problema de OCP:** los servicios no necesitan cambiar para usar otra librería HTTP, pero sí se pueden ampliar fácilmente: basta con crear una nueva clase que cumpla `HttpClient` (por ejemplo `FetchHttpClient`) y pasarla como dependencia.

**Resiliencia aplicada:** las dos llamadas usan `retry()` (`src/shared/retry.ts`), que vuelve a intentar la operación si hay un fallo pasajero de red, esperando un tiempo fijo entre intentos, y devuelve un `Result<T, Error>` en vez de lanzar un error directo. Así, si la API externa falla una vez, no se rompe toda la aplicación.

**Comentario:** el `retry` actual es bastante simple: siempre espera lo mismo entre intentos y no distingue entre errores que vale la pena reintentar y los que no (por ejemplo, no tiene sentido reintentar un error 404). En un caso real convendría revisar el tipo de error antes de reintentar, y dejar de intentar por un rato si el servicio externo está caído por mucho tiempo.

---

### 3. LSP — `src/03-lsp`

**Antes:** `VehicleManager.printVehicleDetails` recibía una lista con tipos concretos (`Tesla | Audi | Toyota | Honda | Ford`) y usaba una cadena de `if (vehicle instanceof Marca)` para decidir qué mostrar de cada uno. Agregar una marca nueva significaba modificar `VehicleManager`.

**Después:** `vehicle.ts` define una clase base `Vehicle` con el método `describe(): string`. Cada marca (`Tesla`, `Audi`, `Toyota`, `Honda`, `Ford`) extiende `Vehicle` e implementa su propio `describe()`. `VehicleManager.printVehicleDetails(vehicles: Vehicle[])` simplemente recorre la lista y llama `console.log(vehicle.describe())`.

**Por qué arregla LSP/OCP:** cualquier marca que extienda `Vehicle` se puede usar en lugar de `Vehicle` sin que `VehicleManager` necesite saber de qué marca se trata ni que su comportamiento cambie. Agregar una marca nueva (por ejemplo `Volvo`) es solo añadir código nuevo, sin tocar `VehicleManager`.

**Comentario:** se separó "qué información se muestra" (`describe()` devuelve un texto) de "cómo se muestra" (el `console.log` queda en `VehicleManager`), lo que además hace más fácil probar el código, porque se puede revisar el texto que devuelve `describe()` sin tener que capturar lo que se imprime en pantalla. El límite de esta idea es que asume que todos los vehículos se pueden describir de la misma forma; si en el futuro algún vehículo necesitara algo muy distinto (por ejemplo, mostrar información en tiempo real), `describe()` ya no sería suficiente y habría que pensar de nuevo esa parte.

---

### 4. ISP — `src/04-isp`

**Antes:** una interfaz grande llamada `Bird` obligaba a todas las aves a tener los métodos `eat()`, `fly()` y `swim()`. `Ostrich` (avestruz, que no vuela) lanzaba un error en `fly()`, y `Hummingbird` (colibrí, que no nada) lanzaba un error en `swim()`. Estos errores solo se notaban al ejecutar el programa.

**Después:** `bird.ts` define interfaces pequeñas y específicas: `CanEat`, `CanFly`, `CanSwim`, junto con funciones `feedBird`, `letItFly`, `letItSwim` que solo piden la capacidad que necesitan. En `bird-catalog.ts`, `Toucan` y `Hummingbird` implementan `CanEat, CanFly`; `Ostrich` implementa `CanEat, CanSwim`. Ninguna clase tiene que implementar un método que no le corresponde.

**Por qué arregla ISP:** nada depende de métodos que no usa, y ninguna clase está obligada a tener (o a lanzar errores en) comportamientos que no tienen sentido para ella. Ahora es el propio editor de código, y no el programa al ejecutarse, el que avisa si se intenta pasar un `Ostrich` a `letItFly`.

**Comentario:** este cambio convierte un error que antes aparecía al ejecutar el programa en un error que aparece antes, mientras se escribe el código, lo cual es una mejora clara porque evita fallos que antes solo se veían en producción. El costo es tener tres interfaces en vez de una, pero esto vale la pena porque refleja mejor lo que cada animal realmente puede hacer.

---

### 5. DIP — `src/05-dip`

**Antes:** `PostService.getPosts()` creaba directamente `new LocalDatabaseService()` dentro del método. Esto significaba que `PostService` dependía de una clase concreta, y no se podía usar `JsonDatabaseService` (u otra fuente de datos) sin modificar `PostService`.

**Después:** `src/data/local-database.ts` define una interfaz general `DatabaseProvider` (con el método `getPosts(): Promise<Post[]>`), que implementan tanto `LocalDatabaseService` como `JsonDatabaseService`. `PostService` recibe **dos** proveedores por constructor: uno principal y uno de respaldo (`fallback`).

**Por qué arregla DIP:** tanto `PostService` como los proveedores dependen de la interfaz `DatabaseProvider`, y no uno del otro directamente. `PostService` puede recibir cualquier combinación de proveedores (incluso versiones falsas para pruebas) sin que su código cambie.

**Resiliencia aplicada:** `getPosts()` primero intenta con `primaryProvider`; si este falla, registra el error y usa `fallbackProvider` antes de devolver un `Result` de error. Esto representa una idea muy usada en sistemas reales: tener una fuente de datos de respaldo por si la principal no responde.

**Comentario:** en este ejercicio los dos proveedores son datos guardados en memoria, así que en la práctica nunca se llega a usar el de respaldo durante la demostración; con solo recibir las dependencias por constructor ya se arregla el problema de DIP. El valor de tener un respaldo es pensar a futuro: el día que `LocalDatabaseService` sea una API real que pueda fallar, el sistema podrá seguir funcionando en vez de romperse por completo.
