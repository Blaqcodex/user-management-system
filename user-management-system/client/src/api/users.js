// client/src/api/users.js
import axios from 'axios';
const BASE = 'http://localhost:5000/api/users';

export const getUsers    = ()       => axios.get(BASE);
export const createUser  = (data)   => axios.post(BASE, data);
export const updateUser  = (id, d)  => axios.put(`${BASE}/${id}`, d);
export const deleteUser  = (id)     => axios.delete(`${BASE}/${id}`);