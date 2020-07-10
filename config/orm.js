const { connect_db, close_db } = require('./connection');

class DB {
    constructor(db_name) {
        this.connection = connect_db(db_name);
    }

    close() {
        return close_db(this.connection);
    }

    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    selectAll(tableName) {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT * FROM ??', [tableName], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }

    selectSome(tableName, columnName, searchValue) {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT * FROM ?? WHERE ?? = ?', [tableName, columnName, searchValue], (
                err,
                rows,
            ) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }

    selectSomeBetter(tableName, columnName1, searchValue1, columnName2, searchValue2) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                'SELECT * FROM ?? WHERE ?? = ? AND ?? = ?',
                [tableName, columnName1, searchValue1, columnName2, searchValue2],
                (err, rows) => {
                    if (err) reject(err);
                    resolve(rows);
                },
            );
        });
    }

    selectSomeFuzzy(tableName, columnName, searchValue) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                'SELECT * FROM ?? WHERE ?? LIKE CONCAT(\'%\', ?, \'%\')',
                [tableName, columnName, searchValue],
                (err, rows) => {
                    if (err) reject(err);
                    resolve(rows);
                },
            );
        });
    }

    insertOne(tableName, value) {
        return new Promise((resolve, reject) => {
            this.connection.query('INSERT INTO ?? SET ?', [tableName, value], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }

    updateOne(tableName, update, condition) {
        // requires a string for tablename, and objects with a single key value pair for update and condition
        return new Promise((resolve, reject) => {
            this.connection.query('UPDATE ?? SET ? WHERE ?', [tableName, update, condition], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }

    removeOne(tableName, condition) {
        return new Promise((resolve, reject) => {
            this.connection.query('DELETE FROM ?? WHERE ?', [tableName, condition], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }

    leftJoinWhere(leftTable, rightTable, leftKey, rightKey, whereClauseCol, whereClauseVal) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                'SELECT * FROM ?? LEFT JOIN ?? ON ?? = ?? WHERE ?? = ?',
                [leftTable, rightTable, leftKey, rightKey, whereClauseCol, whereClauseVal],
                (err, rows) => {
                    if (err) reject(err);
                    resolve(rows);
                },
            );
        });
    }

    innerJoinSorted(leftTable, rightTable, leftKey, rightKey, orderMethod) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                'SELECT * FROM ?? INNER JOIN ?? ON ?? = ?? ORDER BY ??',
                [leftTable, rightTable, leftKey, rightKey, orderMethod],
                (err, rows) => {
                    if (err) reject(err);
                    resolve(rows);
                },
            );
        });
    }
}

module.exports = DB;
