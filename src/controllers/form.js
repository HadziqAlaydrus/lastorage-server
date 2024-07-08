const { query } = require("express");
const db = require("../config/db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getUser = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM users');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Connection Error');
    }
};

const signupUser = async (req, res) => {
    const { username, nama, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.query(
            'INSERT INTO users (username, nama, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
            [username, nama, email, hashedPassword]
        );
        const user = result.rows[0];
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token, user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Sign Up Failed!');
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];


        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Login Failed!');
    }
};

const createForm = async (req, res) => {
    const { nama_makanan, tanggal_dibuat, tanggal_kadaluarsa, jumlah, tempat_penyimpanan } = req.body;
    const users_id = req["user"].id;

    try {
        if (!users_id || !nama_makanan || !tanggal_dibuat || !tanggal_kadaluarsa || !jumlah || !tempat_penyimpanan) {
            return res.status(400).json({ error: 'Incomplete form data' });
        }

        const insertQuery = `
            INSERT INTO form (users_id, nama_makanan, tanggal_dibuat, tanggal_kadaluarsa, jumlah, tempat_penyimpanan)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const values = [users_id, nama_makanan, tanggal_dibuat, tanggal_kadaluarsa, jumlah, tempat_penyimpanan];
        const result = await db.query(insertQuery, values);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to create form');
    }
};



const getForm = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM form');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Connection Error');
    }
};

const getFromByUserId = async (req, res) => {
    try{
        const userId = req.params.id
        const result = await db.query(`SELECT * FROM form WHERE users_id = $1`, [userId])
        res.status(200).json(result.rows)
    }catch(error){
        res.status(500).send("error get form by user id")
    }
}

const deleteFormById = async (req,res) =>{
    try {
        const id = req.params.id
        const result = await db.query('DELETE FROM form where id = $1', [id])
        res.status(200).json("Succes delete storage")
    } catch (error) {
        res.status(500).json("Error Deleting Storage", error.message)
    }
}

const updateFormById = async (req, res) => {
    try {
      const id = req.params.id;
      const { nama_makanan, tanggal_dibuat, tanggal_kadaluarsa, jumlah, tempat_penyimpanan } = req.body;
  
      const result = await db.query(
        'UPDATE form SET nama_makanan = $1, tanggal_dibuat = $2, tanggal_kadaluarsa = $3, jumlah = $4, tempat_penyimpanan = $5 WHERE id = $6',
        [nama_makanan, tanggal_dibuat, tanggal_kadaluarsa, jumlah, tempat_penyimpanan, id]
      );
  
      res.status(200).json({ message: "Success Updating Storage", result });
    } catch (error) {
      console.error('Error updating form:', error);
      res.status(500).send("Error Updating Storage");
    }
  };
  

module.exports = {
    getUser,
    signupUser,
    loginUser,
    createForm,
    getForm,
    getFromByUserId,
    deleteFormById,
    updateFormById
};
