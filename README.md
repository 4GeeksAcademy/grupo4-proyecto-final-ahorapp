
# AhorrApp

AhorrApp es una aplicación web que te ayuda a gestionar tus gastos, estableciendo metas de ahorro y realizando un seguimiento de tus finanzas personales. Está construida con **React.js** para el frontend y **Flask** con **SQLAlchemy** para el backend API.

## Características

- **Frontend con React.js**: Una interfaz dinámica y fácil de usar para gestionar tus finanzas.
- **Backend con Flask**: API RESTful para manejar los datos de los usuarios, sus gastos, y sus metas de ahorro.
- **Base de datos con SQLAlchemy**: Abstracción de base de datos que te permite almacenar y gestionar datos de manera eficiente.
- **Gestión de usuarios**: Permite la creación de usuarios y autenticación para el seguimiento personalizado.
- **Integración con Pipenv**: Gestión de dependencias Python.
- **Despliegue rápido a Heroku**: Implementación simple de la aplicación en Heroku.

## Documentación

[Documentación de inicio](https://start.4geeksacademy.com/starters/react-flask)  
[Video tutorial de uso](https://www.loom.com/share/f37c6838b3f1496c95111e515e83dd9b)

## Instalación

### Backend (Flask)

1. **Instalar Python 3.10 y Pipenv**:
   Si no tienes Python 3.10 y Pipenv instalados, instálalos en tu máquina local. Puedes instalar Pipenv con el siguiente comando:

   ```bash
   pip install pipenv
   ```

2. **Instalar las dependencias de Python**:
   Una vez que tengas el entorno preparado, instala las dependencias del backend:

   ```bash
   pipenv install
   ```

3. **Configurar variables de entorno**:
   Crea un archivo `.env` a partir del ejemplo `.env.example`:

   ```bash
   cp .env.example .env
   ```

   Luego, configura la variable `DATABASE_URL` para tu base de datos, dependiendo de cuál estés usando:

   - **SQLite**: `sqlite:///test.db`
   - **MySQL**: `mysql://usuario:contraseña@localhost:puerto/ejemplo`
   - **PostgreSQL**: `postgres://usuario:contraseña@localhost:5432/ejemplo`

4. **Migrar la base de datos**:
   Si has hecho cambios en los modelos (en `./src/api/models.py`), ejecuta las migraciones:

   ```bash
   pipenv run migrate
   pipenv run upgrade
   ```

5. **Ejecutar la aplicación**:
   Para iniciar el servidor backend, corre el siguiente comando:

   ```bash
   pipenv run start
   ```

### Frontend (React)

1. **Instalar Node.js**:
   Asegúrate de tener **Node.js versión 14+** instalada en tu máquina.

2. **Instalar las dependencias de frontend**:
   Entra al directorio del frontend y ejecuta:

   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**:
   Una vez instaladas las dependencias, ejecuta el servidor de desarrollo con:

   ```bash
   npm run start
   ```

## Despliegue

### Despliegue en Heroku

Este proyecto está listo para ser desplegado en **Heroku** con tan solo unos pocos pasos. Sigue la documentación oficial para desplegar tu app en la plataforma.

1. Crea una cuenta en [Heroku](https://www.heroku.com/).
2. Instala el [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).
3. Sigue los pasos en la documentación oficial para crear una aplicación y conectarla con tu repositorio.

## Contribuciones

**Contribuyentes:**

- **Jose Luis Nuñez**
- **Juan Salazar**
- **Rafael Vargas**
- **Federico Serron**

Este proyecto fue desarrollado como parte del aprendizaje en el desarrollo de aplicaciones Full Stack. ¡Contribuciones son bienvenidas! Si encuentras algún error o tienes una idea para mejorar la aplicación, no dudes en hacer un **Pull Request**.

## Licencia

Este proyecto está bajo la licencia MIT.

---

**AhorrApp** es una solución sencilla pero potente para ayudarte a tener el control de tus finanzas personales y ahorrar de manera efectiva. ¡Empecemos a ahorrar juntos!
