
# HR Management System

This project is a system used by HR companies to manage their acquaintances from employees around different companies. The backend is built using Python Flask with a MySQL database, and the frontend is built using React JS.

## Requirements

- **Python 3.x**: Make sure you have Python installed. You can download it from [python.org](https://www.python.org/downloads/).
- **MySQL**: Install MySQL and set up your database. You can download it from [mysql.com](https://dev.mysql.com/downloads/mysql/).
- **Node.js and npm**: Install Node.js and npm. You can download them from [nodejs.org](https://nodejs.org/).
- **Visual Studio Code (VSCode)**: Install VSCode. You can download it from [code.visualstudio.com](https://code.visualstudio.com/).

## Setup

### Backend

1. **Clone the repository**:

    ```bash
    git clone https://github.com/awtell/HR-managment.git
    cd HR-managment/api
    ```

2. **Create a virtual environment and activate it**:

    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

3. **Install the required Python packages**:

    ```bash
    pip install -r requirements.txt
    ```

4. **Set up the MySQL database**:

    - Create a database named `intern`.
    - Update the database credentials in `config.py` accordingly.

5. **Initialize the database**:

    ```python
    python3
    >>> from app import db
    >>> db.create_all()
    ```

6. **Run the backend server**:

    ```bash
    python3 app.py
    ```

### Frontend

1. **Navigate to the frontend directory**:

    ```bash
    cd ../frontend
    ```

2. **Install the required npm packages**:

    ```bash
    npm install
    ```

3. **Start the frontend server**:

    ```bash
    npm start
    ```

## Usage

1. Ensure both the backend and frontend servers are running.
2. Open your browser and navigate to `http://localhost:3000` to use the application.

## Contributing

Please fork this repository and create a pull request with your changes.

## License

This project is licensed under the MIT License.

## Contact

For more concerns, don't hesitate to contact me at chkhoury00@gmail.com.
