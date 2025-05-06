
# AhorrApp

AhorrApp is a web application that helps you manage your expenses, set savings goals, and track your personal finances. It is built with **React.js** for the frontend and **Flask** with **SQLAlchemy** for the backend API.

## Features

- **Frontend with React.js**: A dynamic and easy-to-use interface for managing your finances.
- **Backend with Flask**: A RESTful API for handling user data, expenses, and savings goals.
- **Database with SQLAlchemy**: Database abstraction that allows you to store and manage data efficiently.
- **User management**: Allows the creation of users and authentication for personalized tracking.
- **Integrated with Pipenv**: Python dependency management.
- **Fast deployment to Heroku**: Simple deployment to Heroku for quick launch.

## Documentation

[Getting Started Documentation](https://start.4geeksacademy.com/starters/react-flask)  
[Video Tutorial](https://www.loom.com/share/f37c6838b3f1496c95111e515e83dd9b)

## Installation

### Backend (Flask)

1. **Install Python 3.10 and Pipenv**:
   If you don't have Python 3.10 and Pipenv installed, please install them on your local machine. You can install Pipenv with the following command:

   ```bash
   pip install pipenv
   ```

2. **Install Python dependencies**:
   Once your environment is set up, install the backend dependencies:

   ```bash
   pipenv install
   ```

3. **Set up environment variables**:
   Create a `.env` file from the example `.env.example`:

   ```bash
   cp .env.example .env
   ```

   Then configure the `DATABASE_URL` variable for your database, depending on which one you're using:

   - **SQLite**: `sqlite:///test.db`
   - **MySQL**: `mysql://username:password@localhost:port/example`
   - **PostgreSQL**: `postgres://username:password@localhost:5432/example`

4. **Run database migrations**:
   If you have made changes to the models (in `./src/api/models.py`), run the migrations:

   ```bash
   pipenv run migrate
   pipenv run upgrade
   ```

5. **Start the application**:
   To start the backend server, run:

   ```bash
   pipenv run start
   ```

### Frontend (React)

1. **Install Node.js**:
   Make sure you have **Node.js version 14+** installed on your machine.

2. **Install frontend dependencies**:
   Enter the frontend directory and run:

   ```bash
   npm install
   ```

3. **Start the development server**:
   Once the dependencies are installed, run the development server with:

   ```bash
   npm run start
   ```

## Deployment

### Deployment on Heroku

This project is ready to be deployed to **Heroku** in just a few steps. Follow the official documentation to deploy your app on the platform.

1. Create an account on [Heroku](https://www.heroku.com/).
2. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).
3. Follow the steps in the official documentation to create an app and link it to your repository.

## Contributors

**Contributors:**

- **Jose Luis Nunez**
- **Juan Salazar**
- **Rafael Varga**
- **Federico Serron**

This project was developed as part of the learning process in Full Stack development. Contributions are welcome! If you find any bugs or have an idea to improve the application, feel free to make a **Pull Request**.

## License

This project is licensed under the MIT License.

---

**AhorrApp** is a simple yet powerful solution to help you take control of your personal finances and save effectively. Let's start saving together!
