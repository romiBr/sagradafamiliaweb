const mysql = require('mysql');

module.exports = () => {
    return mysql.createConnection({
        host: 'sql2.freesqldatabase.com',
        user: 'sql2296920',
        password: 'vG7%vM8%',
        database: 'sql2296920'
    });
}

/* module.exports = () => {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'sagradafamilia'
    });
} */